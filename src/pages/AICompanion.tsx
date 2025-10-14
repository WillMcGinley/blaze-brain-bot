import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CategoryGrid } from "@/components/CategoryGrid";
import { QuestionFlow } from "@/components/QuestionFlow";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { ChatInterface } from "@/components/ChatInterface";

type View = "categories" | "questions" | "results" | "chat";

const AICompanion = () => {
  const [currentView, setCurrentView] = useState<View>("categories");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const { toast } = useToast();

  const handleCategorySelect = (categoryId: string) => {
    console.log("Category selected:", categoryId);
    if (categoryId === "personalized") {
      console.log("Setting view to chat");
      setCurrentView("chat");
      return;
    }
    setSelectedCategory(categoryId);
    setCurrentView("questions");
  };

  const handleQuestionFlowComplete = async (answers: Record<string, string>) => {
    setIsLoading(true);
    setRecommendation("");
    
    try {
      const { data, error } = await supabase.functions.invoke('cannabis-recommendations', {
        body: { 
          userInput: `Category: ${answers.category}, Experience: ${answers.experience}, Vibe: ${answers.vibe}, Consumption: ${answers.consumption}, Onset: ${answers.onset}`,
          structuredInput: answers
        }
      });

      if (error) throw error;

      if (data?.recommendation) {
        setRecommendation(data.recommendation);
        setCurrentView("results");
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

  const handleStartOver = () => {
    setCurrentView("categories");
    setSelectedCategory("");
    setRecommendation("");
  };

  const handleBackToCategories = () => {
    setCurrentView("categories");
    setSelectedCategory("");
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
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Sparkles className="h-12 w-12 text-primary animate-pulse mx-auto" />
              <p className="text-lg text-muted-foreground">Finding your perfect match...</p>
            </div>
          </div>
        )}

        {!isLoading && currentView === "categories" && (
          <CategoryGrid onSelectCategory={handleCategorySelect} />
        )}

        {!isLoading && currentView === "questions" && (
          <QuestionFlow
            category={selectedCategory}
            onComplete={handleQuestionFlowComplete}
            onBack={handleBackToCategories}
          />
        )}

        {!isLoading && currentView === "results" && recommendation && (
          <ProductRecommendations
            recommendation={recommendation}
            onStartOver={handleStartOver}
          />
        )}

        {!isLoading && currentView === "chat" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Button variant="outline" onClick={handleStartOver}>
                ← Back to Categories
              </Button>
            </div>
            <ChatInterface />
          </div>
        )}
      </div>
    </div>
  );
};

export default AICompanion;
