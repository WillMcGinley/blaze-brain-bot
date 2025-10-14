import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";

const PersonalCompanion = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Personal Cannabis Companion
            </h1>
          </div>
          <Button variant="ghost" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <ChatInterface />
      </div>
    </div>
  );
};

export default PersonalCompanion;
