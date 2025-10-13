import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, MessageSquare, Loader2, ChevronDown, ChevronUp, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const AICompanion = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [isRecommendationExpanded, setIsRecommendationExpanded] = useState(true);
  const { toast } = useToast();

  const examplePrompts = [
    "I'm a 150 pound woman, fairly new with cannabis and want something that will bring me a peaceful mind on my hike.",
    "I'm an experienced user, 200 pounds, looking for an energizing sativa for gaming sessions with friends.",
    "First-time user, 130 pounds, need something gentle to help me sleep without feeling too high.",
    "Moderate experience, 170 pounds, want a creative boost for my art projects without anxiety.",
  ];

  const getCollapsedRecommendation = (text: string) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 6).join(" ");
  };

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
              AI Companion
            </h1>
          </div>
          <Button variant="ghost" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="max-w-3xl">
              <h2 className="text-4xl font-bold mb-4">
                Your Personal Cannabis Advisor
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Get AI-powered recommendations tailored to your experience level, preferences, and desired activities.
              </p>

              {/* AI Search Box */}
              <Card className="p-6 shadow-lg border-2 border-primary/20">
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
                <Card className="p-6 shadow-lg border-2 border-secondary/20">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-secondary">
                        <Sparkles className="h-5 w-5" />
                        <p className="font-semibold">AI Recommendation</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsRecommendationExpanded(!isRecommendationExpanded)}
                        className="gap-2"
                      >
                        {isRecommendationExpanded ? (
                          <>
                            <ChevronUp className="h-4 w-4" />
                            Collapse
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Expand
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-foreground whitespace-pre-wrap">
                        {isRecommendationExpanded 
                          ? recommendation 
                          : getCollapsedRecommendation(recommendation)}
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 space-y-4">
            <Card className="p-6 sticky top-24">
              <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
                Need Specific Inspiration?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try asking about: experience level, weight, activity, or objective of consumption
              </p>
              <div className="space-y-3">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(prompt)}
                    className="w-full text-left p-4 bg-card/50 hover:bg-card border border-border rounded-lg transition-colors"
                  >
                    <p className="text-sm text-muted-foreground">
                      {["💆‍♀️", "🎮", "😴", "🎨"][index]} {prompt}
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          </aside>

          {/* Mobile Sidebar */}
          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="rounded-full shadow-lg gap-2">
                  <Menu className="h-5 w-5" />
                  Examples
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Need Specific Inspiration?</SheetTitle>
                </SheetHeader>
                <p className="text-sm text-muted-foreground my-4">
                  Try asking about: experience level, weight, activity, or objective of consumption
                </p>
                <div className="space-y-3">
                  {examplePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleExampleClick(prompt)}
                      className="w-full text-left p-4 bg-card/50 hover:bg-card border border-border rounded-lg transition-colors"
                    >
                      <p className="text-sm text-muted-foreground">
                        {["💆‍♀️", "🎮", "😴", "🎨"][index]} {prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;
