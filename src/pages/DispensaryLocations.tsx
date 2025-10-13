import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

const DispensaryLocations = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState([50]);
  const [dispensaries, setDispensaries] = useState<any[]>([]);

  const handleSearch = () => {
    // This will be implemented with actual dispensary API integration
    // For now, showing placeholder
    setDispensaries([
      {
        id: 1,
        name: "Green Leaf Dispensary",
        distance: 2.3,
        address: "123 Main St, City, State",
        type: "local",
      },
      {
        id: 2,
        name: "Cloud Nine Cannabis",
        distance: 5.7,
        address: "456 Oak Ave, City, State",
        type: "local",
      },
      {
        id: 3,
        name: "Premium Greens Online",
        distance: null,
        address: "Delivers to your area",
        type: "online",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Find Dispensaries
              </h1>
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Home
          </Button>
        </div>
      </header>

      {/* Search Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="p-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Find Dispensaries Near You</h2>
              <p className="text-muted-foreground">
                Enter your location to discover local dispensaries and online delivery options
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Location</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter city, state, or ZIP code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} className="gap-2">
                    <MapPin className="h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Distance: {distance[0]} miles
                </label>
                <Slider
                  value={distance}
                  onValueChange={setDistance}
                  min={1}
                  max={500}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 mile</span>
                  <span>500 miles</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Map Section - Placeholder */}
      {dispensaries.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <Card className="p-6 max-w-4xl mx-auto">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive map will be displayed here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing dispensaries within {distance[0]} miles of {location}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Nearby Dispensaries</h3>
              <div className="grid gap-4">
                {dispensaries.map((dispensary) => (
                  <Card key={dispensary.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{dispensary.name}</h4>
                          {dispensary.type === "online" && (
                            <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                              Online Delivery
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {dispensary.address}
                        </p>
                        {dispensary.distance && (
                          <p className="text-sm text-primary font-medium">
                            {dispensary.distance} miles away
                          </p>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
};

export default DispensaryLocations;
