import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, MapPin, ShoppingBag, TrendingUp, MessageSquare, Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "Personal Cannabis Companion",
      description: "Your friendly, knowledgeable cannabis guide that helps you discover products tailored to your vibe, tolerance, and goals. Have a conversation and get personalized recommendations based on your preferences and desired experience.",
      color: "secondary"
    },
    {
      icon: Sparkles,
      title: "Fast Match",
      description: "Quick and easy product matching powered by AI. Answer a few simple questions about your preferences and what you're looking for, and we'll instantly recommend the perfect products for you.",
      color: "primary"
    },
    {
      icon: Package,
      title: "Subscription Service",
      description: "Never run out of your favorites! Set up recurring deliveries of your preferred products with flexible scheduling options. Manage your subscriptions, pause or modify orders, and enjoy the convenience of automatic delivery.",
      color: "primary"
    },
    {
      icon: MapPin,
      title: "Local & Online Options",
      description: "Connect with dispensaries within 5-500 miles of your location or browse online stores that deliver to your area. Find the most convenient shopping options whether you prefer in-person visits or doorstep delivery.",
      color: "secondary"
    },
    {
      icon: ShoppingBag,
      title: "Real-Time Inventory",
      description: "See what's actually available at dispensaries near you before you visit. Browse current stock, check prices, and make informed decisions. No more wasted trips - know exactly what's in stock before you shop.",
      color: "primary"
    },
    {
      icon: MessageSquare,
      title: "Expert Guidance",
      description: "From first-timers to connoisseurs, get comprehensive recommendations on strains, edibles, vapes, and accessories. Learn about effects, dosing, consumption methods, and best practices for a safe and enjoyable experience.",
      color: "secondary"
    }
  ];

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
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              How Cannabis Companion{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover the six powerful features that make finding your perfect cannabis experience effortless
            </p>
          </div>
        </div>
      </section>

      {/* Features Breakdown */}
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-8 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className={`p-8 hover:shadow-xl transition-all border-${feature.color}/10`}
              >
                <div className="flex gap-6 items-start">
                  <div className={`h-16 w-16 rounded-full bg-${feature.color}/10 flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-8 w-8 text-${feature.color}`} />
                  </div>
                  <div className="space-y-3 flex-1">
                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
            <p className="text-lg text-muted-foreground">
              Choose any feature above to begin your personalized cannabis journey
            </p>
            <Button size="lg" className="gap-2" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default HowItWorks;
