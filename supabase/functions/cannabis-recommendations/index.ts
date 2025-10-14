import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userInput, structuredInput } = await req.json();
    
    if (!userInput) {
      return new Response(
        JSON.stringify({ error: 'User input is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Processing cannabis recommendation request:', userInput);

    // System prompt that guides the AI to provide personalized cannabis recommendations
    const systemPrompt = `You are Cannabis Companion AI, a knowledgeable and friendly cannabis advisor.

${structuredInput ? `The user has provided structured preferences:
- Activity/Category: ${structuredInput.category}
- Experience Level: ${structuredInput.experience}
- Desired Vibe: ${structuredInput.vibe}
- Preferred Consumption: ${structuredInput.consumption}
- Onset Speed: ${structuredInput.onset}` : ''}

Provide a personalized recommendation in this EXACT format:

**Recommended Product:** [Specific product name and type]
**Strain:** [Specific strain name - Indica/Sativa/Hybrid]
**Consumption Method:** [The method that matches their preference]
**Why This Works:** [2-3 sentences explaining why this is perfect for their situation and preferences]

**Additional Info:**
- THC/CBD Levels: [Recommended range based on experience]
- Starting Dosage: [Specific amount for their experience level]
- Onset Time: [How long until effects kick in]
- Duration: [How long effects last]
- Effects: [Key effects they can expect]

Keep it conversational, helpful, and safety-focused. Always recommend starting with a lower dose for beginners.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required, please add funds to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI gateway error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const recommendation = data.choices[0].message.content;

    console.log('Successfully generated recommendation');

    return new Response(
      JSON.stringify({ recommendation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in cannabis-recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});