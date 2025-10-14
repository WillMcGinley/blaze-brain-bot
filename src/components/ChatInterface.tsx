import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Leaf, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

interface Product {
  name: string;
  type: string;
  strain?: string;
  thc: string;
  cbd: string;
  effects: string;
  price: string;
  availability: string;
  image?: string;
}

const quickStartPrompts = [
  "Help me find something to relax 🧘‍♂️",
  "I'm new to cannabis 🌱",
  "I want to be creative 🎨",
  "Something for a chill night with friends 👥",
  "I usually get anxious — what won't trigger that? 💭",
  "What's a good edible for first-timers? 🍪",
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! 🌿 I&apos;m your cannabis companion. Whether you&apos;re looking for something to ease anxiety, enhance creativity, or just relax with friends — I&apos;m here to guide you. What brings you here today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parseProducts = (text: string): Product[] => {
    // For now, return sample products - in production, the backend would return structured data
    if (text.toLowerCase().includes("product") || text.toLowerCase().includes("recommend")) {
      return [
        {
          name: "Blue Dream",
          type: "Flower",
          strain: "Hybrid",
          thc: "18-22%",
          cbd: "1-2%",
          effects: "Relaxing, Creative, Uplifting",
          price: "$45",
          availability: "In Stock",
        },
      ];
    }
    return [];
  };

  const handleSend = async (message?: string) => {
    const messageText = message || input;
    if (!messageText.trim()) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("cannabis-recommendations", {
        body: {
          userInput: messageText,
          conversational: true,
        },
      });

      if (error) throw error;

      if (data?.recommendation) {
        const products = parseProducts(data.recommendation);
        const assistantMessage: Message = {
          role: "assistant",
          content: data.recommendation,
          products: products.length > 0 ? products : undefined,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-12rem)] max-w-[95vw] mx-auto">
      {/* Side Banner - Quick Start */}
      <div className="w-64 flex-shrink-0 space-y-4">
        <div className="sticky top-4">
          <div className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/10 mb-4">
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Your Guide 🌿
            </h3>
            <p className="text-xs text-muted-foreground">
              Ask me anything about cannabis — from managing anxiety to finding the perfect strain for any occasion.
            </p>
          </div>

          <div className="p-4 bg-card rounded-lg border">
            <p className="text-sm font-semibold mb-3 text-muted-foreground">Quick Start:</p>
            <div className="space-y-2">
              {quickStartPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSend(prompt)}
                  disabled={isLoading}
                  className="w-full justify-start text-xs h-auto py-2 px-3 whitespace-normal text-left"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Messages */}
        <ScrollArea ref={scrollRef} className="flex-1 pr-4">
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : "order-1"}`}>
                  <div
                    className={`rounded-2xl px-6 py-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-primary">Cannabis Companion</span>
                      </div>
                    )}
                    <p className="text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>

                  {/* Product Cards */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-3">
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        You might like these options based on what you described 🌿
                      </p>
                      <div className="grid gap-3">
                        {message.products.map((product, pIndex) => (
                          <Card key={pIndex} className="hover:shadow-md transition-shadow bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-semibold text-sm">{product.name}</h4>
                                  <p className="text-xs text-muted-foreground">{product.type}</p>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {product.availability}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">THC</p>
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {product.thc}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">CBD</p>
                                  <Badge variant="outline" className="text-xs font-mono">
                                    {product.cbd}
                                  </Badge>
                                </div>
                              </div>

                              <div className="mb-3">
                                <p className="text-xs text-muted-foreground mb-1">Effects</p>
                                <div className="flex flex-wrap gap-1">
                                  {product.effects.split(",").map((effect, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {effect.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t">
                                <span className="text-lg font-bold text-primary">{product.price}</span>
                                <Button size="sm" variant="ghost" className="gap-2 text-xs">
                                  View Details
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="mt-6 flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask me anything about cannabis... 💭"
            className="min-h-[100px] text-base resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={() => handleSend()} 
            disabled={isLoading || !input.trim()} 
            size="icon" 
            className="h-[100px] w-[100px] rounded-xl"
          >
            <Send className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
