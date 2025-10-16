import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MapPin, Search } from "lucide-react";

interface Product {
  id: string;
  name: string;
  type: string;
  strain: string;
  thc: string;
  cbd: string;
  price: number;
  dispensary: string;
  distance: number;
  inStock: boolean;
}

const RealTimeInventory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample product data - this would come from your backend/API
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Blue Dream",
      type: "Flower",
      strain: "Hybrid",
      thc: "18-24%",
      cbd: "<1%",
      price: 45,
      dispensary: "Green Leaf Dispensary",
      distance: 2.3,
      inStock: true
    },
    {
      id: "2",
      name: "Sour Diesel",
      type: "Flower",
      strain: "Sativa",
      thc: "20-26%",
      cbd: "<1%",
      price: 50,
      dispensary: "Cannabis Corner",
      distance: 3.1,
      inStock: true
    },
    {
      id: "3",
      name: "Northern Lights",
      type: "Flower",
      strain: "Indica",
      thc: "16-21%",
      cbd: "<1%",
      price: 40,
      dispensary: "Green Leaf Dispensary",
      distance: 2.3,
      inStock: true
    },
    {
      id: "4",
      name: "Relaxation Blend",
      type: "Edible",
      strain: "Indica",
      thc: "10mg per piece",
      cbd: "5mg per piece",
      price: 25,
      dispensary: "Online - QuickDelivery",
      distance: 0,
      inStock: true
    },
    {
      id: "5",
      name: "CBD Relief Tincture",
      type: "Tincture",
      strain: "N/A",
      thc: "<1%",
      cbd: "1000mg",
      price: 60,
      dispensary: "Wellness Shop",
      distance: 4.5,
      inStock: true
    }
  ]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.strain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Real-Time Inventory</h1>
          <p className="text-muted-foreground">
            Browse all available products from dispensaries and online retailers in your area
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, strains, or types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{product.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {product.type} • {product.strain}
                    </CardDescription>
                  </div>
                  <Badge variant={product.inStock ? "default" : "secondary"}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">THC:</span>
                    <span className="font-medium">{product.thc}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CBD:</span>
                    <span className="font-medium">{product.cbd}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{product.dispensary}</span>
                    {product.distance > 0 && (
                      <span className="ml-auto">{product.distance} mi</span>
                    )}
                  </div>
                  <div className="pt-3 border-t flex items-center justify-between">
                    <span className="text-2xl font-bold">${product.price}</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RealTimeInventory;
