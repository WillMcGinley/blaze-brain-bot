import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, MapPin, ShoppingBag, TrendingUp, MessageSquare, Package, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const { toast } = useToast();

  const examplePrompts = [
    "I'm a 150 pound woman, fairly new with cannabis and want something that will bring me a peaceful mind on my hike.",
    "I'm an experienced user, 200 pounds, looking for an energizing sativa for gaming sessions with friends.",
    "First-time user, 130 pounds, need something gentle to help me sleep without feeling too high.",
    "Moderate experience, 170 pounds, want a creative boost for my art projects without anxiety.",
  ];

  const handleSearch = async (query?: string) => {
    const searchText = query || searchQuery;
    if (!searchText.trim()) {
      toast({
        title: "Please enter a question",
        description: "Tell us what you're looking for",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setRecommendation("");
    
    try {
      const { data, error } = await supabase.functions.invoke('cannabis-recommendations', {
        body: { userInput: searchText }
      });

      if (error) throw error;

      if (data?.recommendation) {
        setRecommendation(data.recommendation);
      }
    } catch (error) {
      console.error('Error getting recommendation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (prompt: string) => {
    setSearchQuery(prompt);
    handleSearch(prompt);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Cannabis Companion
            </h1>
          </div>
          <nav className="flex gap-4">
            <Button variant="ghost">How It Works</Button>
            <Button variant="ghost">Products</Button>
            <Button variant="secondary">Subscribe</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Your AI-Powered Guide to the{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Perfect Cannabis Experience
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get personalized recommendations for strains, products, and consumption methods
              based on your preferences and desired activities.
            </p>

            {/* Example Prompts */}
            <div className="mb-8 max-w-3xl mx-auto">
              <h3 className="text-lg font-semibold mb-4 text-center">Try asking something like:</h3>
              <div className="grid gap-3">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(prompt)}
                    className="text-left p-4 bg-card/50 hover:bg-card border border-border rounded-lg transition-colors"
                  >
                    <p className="text-sm text-muted-foreground">
                      {["💆‍♀️", "🎮", "😴", "🎨"][index]} {prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Search Box */}
            <Card className="p-6 max-w-2xl mx-auto shadow-lg border-2 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <MessageSquare className="h-5 w-5" />
                  <p className="font-semibold">Ask our AI Companion</p>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., 'I want something relaxing for movie night' or 'Best edibles for beginners'"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSearch()}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button onClick={() => handleSearch()} className="gap-2" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our AI will find the best products from local and online dispensaries
                </p>
              </div>
            </Card>

            {/* Recommendation Result */}
            {recommendation && (
              <Card className="p-6 max-w-2xl mx-auto mt-6 shadow-lg border-2 border-secondary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-secondary">
                    <Sparkles className="h-5 w-5" />
                    <p className="font-semibold">AI Recommendation</p>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground whitespace-pre-wrap">{recommendation}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose Cannabis Companion?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-xl transition-shadow border-primary/10">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">AI-Powered Recommendations</h4>
            <p className="text-muted-foreground">
              Our intelligent system learns your preferences and suggests products tailored to your
              experience level and desired effects.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow border-secondary/10">
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-secondary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Local & Online Options</h4>
            <p className="text-muted-foreground">
              Connect with dispensaries within 5-500 miles or browse online stores that deliver to
              your location.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow border-primary/10">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Real-Time Inventory</h4>
            <p className="text-muted-foreground">
              See what's actually in stock at your local dispensaries and make informed decisions
              before you shop.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow border-secondary/10">
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-secondary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Personalized Experience</h4>
            <p className="text-muted-foreground">
              Tell us about your experience level, preferences, and activities - get recommendations
              that match your lifestyle.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow border-primary/10">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Subscription Service</h4>
            <p className="text-muted-foreground">
              Never run out! Set up recurring orders for your favorite products with convenient
              delivery options.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow border-secondary/10">
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-secondary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Expert Guidance</h4>
            <p className="text-muted-foreground">
              From first-timers to connoisseurs, get recommendations on strains, edibles, vapes, and
              accessories.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold">Ready to Find Your Perfect Match?</h3>
            <p className="text-lg text-muted-foreground">
              Start your personalized cannabis journey today with AI-powered recommendations
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">Cannabis Companion</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Cannabis Companion. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
