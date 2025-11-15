import { useState, useEffect } from "react";
import CategorySelector from "@/components/CategorySelector";
import WorkoutForm from "@/components/WorkoutForm";
import WorkoutCalendar from "@/components/WorkoutCalendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, UserRound } from "lucide-react";

interface Workout {
  id: string;
  name: string;
  reps: string;
  day: string;
  completed: boolean;
}

const Index = () => {
  const [category, setCategory] = useState<"gym" | "boxing" | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Load workouts from localStorage
  useEffect(() => {
    if (category) {
      const saved = localStorage.getItem(`workouts-${category}`);
      if (saved) {
        setWorkouts(JSON.parse(saved));
      } else {
        setWorkouts([]);
      }
    }
  }, [category]);

  // Save workouts to localStorage
  useEffect(() => {
    if (category) {
      localStorage.setItem(`workouts-${category}`, JSON.stringify(workouts));
    }
  }, [workouts, category]);

  const handleSelectCategory = (cat: "gym" | "boxing") => {
    setCategory(cat);
  };

  const handleAddWorkout = (workout: Workout) => {
    setWorkouts([...workouts, workout]);
  };

  const handleToggleComplete = (id: string) => {
    setWorkouts(
      workouts.map((w) =>
        w.id === id ? { ...w, completed: !w.completed } : w
      )
    );
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
  };

  const handleBackToCategories = () => {
    setCategory(null);
  };

  if (!category) {
    return <CategorySelector onSelectCategory={handleSelectCategory} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero text-primary-foreground py-6 shadow-strong">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToCategories}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <div className="flex items-center gap-3">
              {category === "gym" ? (
                <Dumbbell className="w-8 h-8" />
              ) : (
                <UserRound className="w-8 h-8" />
              )}
              <h1 className="text-2xl md:text-3xl font-bold">
                {category === "gym" ? "Academia" : "Boxe"}
              </h1>
            </div>
            
            <div className="w-24" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <WorkoutForm onAddWorkout={handleAddWorkout} />
          </div>
          
          <div className="lg:col-span-2">
            <WorkoutCalendar
              workouts={workouts}
              onToggleComplete={handleToggleComplete}
              onDeleteWorkout={handleDeleteWorkout}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
