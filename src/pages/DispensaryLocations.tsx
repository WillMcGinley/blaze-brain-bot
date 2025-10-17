import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const DispensaryLocations = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState([25]);
  const [dispensaries, setDispensaries] = useState<any[]>([]);
  const [mapboxToken, setMapboxToken] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [stateCode, setStateCode] = useState<string>("");

  // States where cannabis delivery is legal
  const legalDeliveryStates = ["CA", "CO", "MA", "MI", "OR", "NV", "IL", "WA"];

  // Fetch location suggestions as user types
  useEffect(() => {
    if (location.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      if (!mapboxToken) return;
      
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxToken}&country=US&types=place,postcode`
        );
        const data = await response.json();
        setSuggestions(data.features || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [location, mapboxToken]);

  const handleSelectLocation = (suggestion: any) => {
    setLocation(suggestion.place_name);
    setSelectedCoordinates(suggestion.center);
    setOpen(false);
    
    // Extract state code for delivery check
    const context = suggestion.context || [];
    const stateContext = context.find((c: any) => c.id.startsWith("region"));
    if (stateContext) {
      setStateCode(stateContext.short_code?.replace("US-", "") || "");
    }
  };

  const handleSearch = () => {
    if (!mapboxToken) {
      alert("Please enter your Mapbox token first");
      return;
    }

    if (!selectedCoordinates) {
      alert("Please select a location from the suggestions");
      return;
    }

    // Sample dispensary data with coordinates
    const sampleDispensaries = [
      {
        id: 1,
        name: "Green Leaf Dispensary",
        distance: 2.3,
        address: "123 Main St, City, State",
        type: "local",
        coordinates: [selectedCoordinates[0] + 0.01, selectedCoordinates[1] + 0.01],
      },
      {
        id: 2,
        name: "Cloud Nine Cannabis",
        distance: 5.7,
        address: "456 Oak Ave, City, State",
        type: "local",
        coordinates: [selectedCoordinates[0] - 0.02, selectedCoordinates[1] + 0.015],
      },
    ];

    // Add online delivery option if legal in the state
    if (legalDeliveryStates.includes(stateCode)) {
      sampleDispensaries.push({
        id: 3,
        name: "Premium Greens Online",
        distance: null,
        address: "Delivers to your area",
        type: "online",
        coordinates: null,
      });
    }

    setDispensaries(sampleDispensaries);

    // Initialize map
    if (mapContainer.current && !map.current) {
      mapboxgl.accessToken = mapboxToken;
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: selectedCoordinates,
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    // Clear existing markers and add new ones
    if (map.current) {
      map.current.setCenter(selectedCoordinates);
      
      // Add markers for each dispensary
      sampleDispensaries.forEach((dispensary) => {
        if (dispensary.coordinates && map.current) {
          const marker = new mapboxgl.Marker({ color: "#8B5CF6" })
            .setLngLat(dispensary.coordinates as [number, number])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<div class="p-2">
                  <h3 class="font-semibold">${dispensary.name}</h3>
                  <p class="text-sm">${dispensary.address}</p>
                  ${dispensary.distance ? `<p class="text-sm font-medium">${dispensary.distance} miles away</p>` : ''}
                </div>`
              )
            )
            .addTo(map.current);
        }
      });

      // Add circle to show search radius
      if (map.current.getSource('search-radius')) {
        map.current.removeLayer('search-radius');
        map.current.removeSource('search-radius');
      }

      map.current.addSource('search-radius', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: selectedCoordinates,
          },
          properties: {},
        },
      });

      map.current.addLayer({
        id: 'search-radius',
        type: 'circle',
        source: 'search-radius',
        paint: {
          'circle-radius': {
            stops: [
              [0, 0],
              [20, distance[0] * 50], // Approximate pixel radius based on miles
            ],
            base: 2,
          },
          'circle-color': '#8B5CF6',
          'circle-opacity': 0.1,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#8B5CF6',
          'circle-stroke-opacity': 0.3,
        },
      });
    }
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
              {!mapboxToken && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Mapbox Token (Required)
                  </label>
                  <Input
                    placeholder="Enter your Mapbox public token"
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your free token at{" "}
                    <a
                      href="https://mapbox.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      mapbox.com
                    </a>
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Your Location</label>
                <div className="flex gap-2">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Enter city, state, or ZIP code"
                          value={location}
                          onChange={(e) => {
                            setLocation(e.target.value);
                            setOpen(true);
                          }}
                          disabled={!mapboxToken}
                        />
                      </div>
                    </PopoverTrigger>
                    {suggestions.length > 0 && (
                      <PopoverContent className="p-0 w-[400px]" align="start">
                        <Command>
                          <CommandList>
                            <CommandEmpty>No locations found.</CommandEmpty>
                            <CommandGroup>
                              {suggestions.map((suggestion) => (
                                <CommandItem
                                  key={suggestion.id}
                                  value={suggestion.place_name}
                                  onSelect={() => handleSelectLocation(suggestion)}
                                >
                                  <MapPin className="mr-2 h-4 w-4" />
                                  {suggestion.place_name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    )}
                  </Popover>
                  <Button onClick={handleSearch} className="gap-2" disabled={!mapboxToken}>
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
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 mile</span>
                  <span>100 miles</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Map Section */}
      {dispensaries.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <Card className="p-6 max-w-4xl mx-auto">
            <div ref={mapContainer} className="h-[500px] rounded-lg mb-6" />

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
