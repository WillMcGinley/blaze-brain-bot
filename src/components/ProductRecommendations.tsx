import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Leaf, Zap, ShoppingCart } from "lucide-react";

interface Product {
  name: string;
  type: string;
  strain?: string;
  thc: string;
  cbd: string;
  effects: string;
  dosage?: string;
  price: string;
  availability: string;
}

interface ProductRecommendationsProps {
  recommendation: string;
  onStartOver: () => void;
}

export const ProductRecommendations = ({ recommendation, onStartOver }: ProductRecommendationsProps) => {
  // Parse the recommendation text to extract product information
  // This is a simplified version - in production, the backend would return structured data
  const parseRecommendation = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const products: Product[] = [];
    
    // This is a mock implementation - in production, the AI would return structured JSON
    // For now, we'll create sample products based on the recommendation
    products.push({
      name: "Sample Product 1",
      type: "Flower",
      strain: "Hybrid",
      thc: "18-22%",
      cbd: "1-2%",
      effects: "Balanced, Relaxing, Uplifting",
      price: "$45-60",
      availability: "In Stock"
    });

    return products;
  };

  const products = parseRecommendation(recommendation);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Your Personalized Recommendations</h2>
        </div>
        <Button variant="outline" onClick={onStartOver}>
          Start Over
        </Button>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{recommendation}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Recommended Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.type}</CardDescription>
                  </div>
                  <Badge variant="secondary">{product.availability}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.strain && (
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{product.strain}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">THC Level</div>
                    <Badge variant="outline" className="font-mono">{product.thc}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">CBD Level</div>
                    <Badge variant="outline" className="font-mono">{product.cbd}</Badge>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-2">Effects</div>
                  <div className="flex flex-wrap gap-1">
                    {product.effects.split(',').map((effect, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {effect.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>

                {product.dosage && (
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Recommended Dosage</div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-primary" />
                      <span className="text-sm">{product.dosage}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-lg font-bold text-primary">{product.price}</span>
                  <Button size="sm" className="gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Pro Tip:</strong> Start with a lower dose if you're new to this product type. 
            You can always take more, but you can't take less once consumed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
