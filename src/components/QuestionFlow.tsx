import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Sparkles } from "lucide-react";

interface QuestionFlowProps {
  category: string;
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; emoji: string }[];
}

const questions: Question[] = [
  {
    id: "experience",
    question: "What's your experience level with cannabis?",
    options: [
      { value: "beginner", label: "Beginner", emoji: "🌱" },
      { value: "intermediate", label: "Intermediate", emoji: "🌿" },
      { value: "advanced", label: "Advanced", emoji: "🌳" }
    ]
  },
  {
    id: "vibe",
    question: "What kind of vibe are you going for?",
    options: [
      { value: "chill", label: "Chill & Relaxed", emoji: "😌" },
      { value: "energetic", label: "Energetic & Uplifted", emoji: "⚡" },
      { value: "creative", label: "Creative & Focused", emoji: "💡" },
      { value: "social", label: "Social & Talkative", emoji: "🗣️" },
      { value: "sleepy", label: "Sleepy & Calm", emoji: "😴" }
    ]
  },
  {
    id: "consumption",
    question: "How would you prefer to consume?",
    options: [
      { value: "smoking", label: "Smoking (flower)", emoji: "🌿" },
      { value: "vaping", label: "Vaping", emoji: "💨" },
      { value: "edibles", label: "Edibles", emoji: "🍪" },
      { value: "tinctures", label: "Tinctures/Oils", emoji: "💧" }
    ]
  },
  {
    id: "onset",
    question: "How fast do you want the effects to kick in?",
    options: [
      { value: "fast", label: "Fast (5-15 min)", emoji: "⚡" },
      { value: "medium", label: "Medium (15-30 min)", emoji: "⏱️" },
      { value: "slow", label: "Slow & Steady (30-90 min)", emoji: "🐢" }
    ]
  }
];

export const QuestionFlow = ({ category, onComplete, onBack }: QuestionFlowProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete({ ...newAnswers, category });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onBack();
    }
  };

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handlePrevious} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="w-full bg-secondary/30 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">{question.question}</h2>
          
          <div className="grid grid-cols-1 gap-3">
            {question.options.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                onClick={() => handleAnswer(question.id, option.value)}
                className="h-auto p-6 justify-start text-left hover:border-primary hover:bg-primary/5"
              >
                <span className="text-2xl mr-4">{option.emoji}</span>
                <span className="text-lg">{option.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {currentQuestion === questions.length - 1 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>Almost there! One more answer and we'll find your perfect match</span>
        </div>
      )}
    </div>
  );
};
