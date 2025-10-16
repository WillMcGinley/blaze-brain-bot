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
    const { userInput, structuredInput, conversational } = await req.json();
    
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
    const systemPrompt = conversational 
      ? `You are Cannabis Companion, a warm, knowledgeable, and empathetic cannabis guide. You help users discover the perfect cannabis products for their needs in a conversational, educational way.

Your personality:
- Warm, friendly, and reassuring - never salesy
- Educational and safety-focused
- Understanding of anxiety, concerns, and personal preferences
- You use gentle, inclusive language with occasional emojis 🌿💭

When recommending products:
- Ask clarifying questions when needed
- Explain why something might work for their situation
- Always prioritize safety and comfort
- Mention if something is beginner-friendly or for experienced users
- Keep responses conversational and concise (2-4 paragraphs max)
- After providing advice, ALWAYS recommend 2-3 specific cannabis products that match their needs

If a user describes anxiety or concerns, acknowledge them and recommend gentler options with lower THC or balanced CBD ratios.

After answering their question, you MUST use the suggest_products tool to recommend matching products from inventory.`
      : `You are Cannabis Companion AI, a knowledgeable and friendly cannabis advisor.

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

Keep it conversational, helpful, and safety-focused. Always recommend starting with a lower dose for beginners.`;

    const requestBody: any = {
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ],
    };

    // Add tool for product recommendations in conversational mode
    if (conversational) {
      requestBody.tools = [
        {
          type: "function",
          function: {
            name: "suggest_products",
            description: "Suggest 2-3 cannabis products from the inventory that match the user's needs and preferences.",
            parameters: {
              type: "object",
              properties: {
                products: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Product name" },
                      type: { type: "string", description: "Product type (Flower, Edible, Vape, etc.)" },
                      strain: { type: "string", description: "Strain type (Indica, Sativa, Hybrid)" },
                      thc: { type: "string", description: "THC percentage range" },
                      cbd: { type: "string", description: "CBD percentage range" },
                      effects: { type: "string", description: "Comma-separated effects" },
                      price: { type: "string", description: "Price range" },
                      availability: { type: "string", description: "Availability status" }
                    },
                    required: ["name", "type", "thc", "cbd", "effects", "price", "availability"],
                    additionalProperties: false
                  }
                }
              },
              required: ["products"],
              additionalProperties: false
            }
          }
        }
      ];
      requestBody.tool_choice = { type: "function", function: { name: "suggest_products" } };
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
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
    const choice = data.choices[0];
    
    let recommendation = choice.message.content;
    let products = null;

    // Extract products from tool call if available
    if (conversational && choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      const toolCall = choice.message.tool_calls[0];
      if (toolCall.function.name === "suggest_products") {
        try {
          const args = JSON.parse(toolCall.function.arguments);
          products = args.products;
          console.log('Extracted products:', products);
        } catch (e) {
          console.error('Error parsing tool call arguments:', e);
        }
      }
    }

    console.log('Successfully generated recommendation');

    return new Response(
      JSON.stringify({ recommendation, products }),
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