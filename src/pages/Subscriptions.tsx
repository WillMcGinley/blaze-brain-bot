import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, DollarSign, Plus, Trash2, Pause, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Subscription {
  id: string;
  productName: string;
  frequency: string;
  nextDelivery: string;
  price: string;
  status: "active" | "paused";
}

const Subscriptions = () => {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: "1",
      productName: "Blue Dream - 3.5g Flower",
      frequency: "Every 2 weeks",
      nextDelivery: "2025-11-01",
      price: "$45",
      status: "active"
    },
    {
      id: "2",
      productName: "CBD Gummies - 30 Pack",
      frequency: "Monthly",
      nextDelivery: "2025-11-15",
      price: "$35",
      status: "paused"
    }
  ]);

  const toggleStatus = (id: string) => {
    setSubscriptions(subs => 
      subs.map(sub => 
        sub.id === id 
          ? { ...sub, status: sub.status === "active" ? "paused" : "active" as "active" | "paused" }
          : sub
      )
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subs => subs.filter(sub => sub.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Subscriptions
            </h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Never Run Out of Your Favorites</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Manage your recurring orders and discover new products to add to your routine
          </p>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Start a New Subscription
          </Button>
        </div>

        {/* Active Subscriptions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Your Active Subscriptions</h3>
            <Badge variant="secondary" className="text-sm">
              {subscriptions.filter(s => s.status === "active").length} Active
            </Badge>
          </div>

          {subscriptions.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <Package className="h-16 w-16 text-muted-foreground mx-auto" />
                <h4 className="text-xl font-semibold">No subscriptions yet</h4>
                <p className="text-muted-foreground">
                  Start a subscription to get your favorite products delivered regularly
                </p>
                <Button className="gap-2 mt-4">
                  <Plus className="h-4 w-4" />
                  Browse Products
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{subscription.productName}</CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {subscription.frequency}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {subscription.price}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                        {subscription.status === "active" ? "Active" : "Paused"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Next Delivery</p>
                        <p className="font-semibold">
                          {new Date(subscription.nextDelivery).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(subscription.id)}
                          className="gap-2"
                        >
                          {subscription.status === "active" ? (
                            <>
                              <Pause className="h-4 w-4" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              Resume
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSubscription(subscription.id)}
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Benefits Section */}
        <Card className="mt-12 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardContent className="p-8">
            <h4 className="text-xl font-bold mb-4 text-center">Subscription Benefits</h4>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h5 className="font-semibold">Save 15%</h5>
                <p className="text-sm text-muted-foreground">
                  Get exclusive discounts on all subscription orders
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h5 className="font-semibold">Free Delivery</h5>
                <p className="text-sm text-muted-foreground">
                  No delivery fees on any subscription order
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h5 className="font-semibold">Flexible Schedule</h5>
                <p className="text-sm text-muted-foreground">
                  Change, pause, or cancel anytime with no commitments
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscriptions;
