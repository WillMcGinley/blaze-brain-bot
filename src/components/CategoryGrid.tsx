import { Card } from "@/components/ui/card";
import { Tv, Gamepad2, Dumbbell, Users, Moon, Lightbulb, PartyPopper, Coffee, Sparkles } from "lucide-react";

interface Category {
  id: string;
  title: string;
  emoji: string;
  icon: any;
  description: string;
}

const categories: Category[] = [
  {
    id: "personalized",
    title: "Personalized Experience",
    emoji: "🌿",
    icon: Sparkles,
    description: "A friendly, knowledgeable cannabis companion that helps you discover products tailored to your vibe, tolerance, and goals. Ask anything and get warm, conversational guidance."
  },
  {
    id: "watching-tv",
    title: "Watching TV / Movies",
    emoji: "📺",
    icon: Tv,
    description: "Kick back and enjoy your favorite shows"
  },
  {
    id: "gaming",
    title: "Playing Video Games",
    emoji: "🎮",
    icon: Gamepad2,
    description: "Level up your gaming experience"
  },
  {
    id: "exercise",
    title: "Exercising or Being Active",
    emoji: "💪",
    icon: Dumbbell,
    description: "Enhance your workout and recovery"
  },
  {
    id: "relaxing",
    title: "Relaxing with Friends",
    emoji: "🧘‍♂️",
    icon: Users,
    description: "Chill vibes with good company"
  },
  {
    id: "sleeping",
    title: "Sleeping or Unwinding",
    emoji: "😴",
    icon: Moon,
    description: "Wind down and rest easy"
  },
  {
    id: "creative",
    title: "Creative or Focused Work",
    emoji: "🎨",
    icon: Lightbulb,
    description: "Boost creativity and focus"
  },
  {
    id: "social",
    title: "Social / Partying",
    emoji: "🎉",
    icon: PartyPopper,
    description: "Good vibes for social gatherings"
  },
  {
    id: "daily",
    title: "Daily Routine / Microdosing",
    emoji: "☕",
    icon: Coffee,
    description: "Enhance your everyday activities"
  }
];

interface CategoryGridProps {
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid = ({ onSelectCategory }: CategoryGridProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">What's your vibe?</h2>
        <p className="text-muted-foreground text-lg">
          Choose an activity to get personalized recommendations
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isPersonalized = category.id === "personalized";
          return (
            <Card
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`p-6 cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-lg border-2 hover:border-primary/50 ${
                isPersonalized ? "md:col-span-2 bg-gradient-to-br from-primary/5 to-secondary/5" : ""
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="text-4xl">{category.emoji}</div>
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="font-semibold text-lg">{category.title}</h3>
                <p className={`text-sm text-muted-foreground ${isPersonalized ? "max-w-md" : ""}`}>
                  {category.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
