import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, MapPin, ShoppingBag, TrendingUp, MessageSquare, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

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
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose Cannabis Companion?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card 
            className="p-6 hover:shadow-xl transition-shadow border-secondary/10 cursor-pointer group relative"
            onClick={() => navigate('/personal-companion')}
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('/personal-companion', '_blank');
                }}
                className="text-xs"
              >
                Open in New Tab ↗
              </Button>
            </div>
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-secondary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Personal Cannabis Companion</h4>
            <p className="text-muted-foreground">
              A friendly, knowledgeable cannabis companion that helps you discover products tailored to your vibe, tolerance, and goals. Ask anything and get warm, conversational guidance.
            </p>
          </Card>

          <Card 
            className="p-6 hover:shadow-xl transition-shadow border-primary/10 cursor-pointer"
            onClick={() => navigate('/ai-companion')}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Fast Match</h4>
            <p className="text-muted-foreground">
              A friendly, knowledgeable cannabis companion that helps you discover products tailored to your vibe, tolerance, and goals. Ask anything and get warm, conversational guidance.
            </p>
          </Card>

          <Card 
            className="p-6 hover:shadow-xl transition-shadow border-primary/10 cursor-pointer"
            onClick={() => navigate('/subscriptions')}
          >
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Subscription Service</h4>
            <p className="text-muted-foreground">
              Never run out! Set up recurring orders for your favorite products with convenient
              delivery options.
            </p>
          </Card>

          <Card 
            className="p-6 hover:shadow-xl transition-shadow border-secondary/10 cursor-pointer"
            onClick={() => navigate('/dispensaries')}
          >
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-secondary" />
            </div>
            <h4 className="text-xl font-semibold mb-2">Local & Online Options</h4>
            <p className="text-muted-foreground">
              Connect with dispensaries within 5-500 miles or browse online stores that deliver to
              your location.
            </p>
          </Card>

          <Card 
            className="p-6 hover:shadow-xl transition-shadow border-primary/10 cursor-pointer"
            onClick={() => navigate('/real-time-inventory')}
          >
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
              <Button size="lg" className="gap-2" onClick={() => navigate('/ai-companion')}>
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
