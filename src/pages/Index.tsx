import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategorySelector from "@/components/CategorySelector";
import WorkoutForm from "@/components/WorkoutForm";
import WorkoutCalendar from "@/components/WorkoutCalendar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dumbbell, UserRound, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

interface Workout {
  id: string;
  name: string;
  reps: string;
  day: string;
  completed: boolean;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState<"gym" | "boxing" | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }
      
      setUser(session.user);
      setLoading(false);
    };

    checkAuth();

    // Listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Carregar treinos do banco de dados
  useEffect(() => {
    if (user && category) {
      loadWorkouts();
    }
  }, [user, category]);

  const loadWorkouts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .eq("category", category)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setWorkouts(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar treinos");
      console.error("Erro:", error);
    }
  };

  const handleSelectCategory = (cat: "gym" | "boxing") => {
    setCategory(cat);
  };

  const handleAddWorkout = async (workout: Omit<Workout, "id">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("workouts")
        .insert({
          user_id: user.id,
          category: category!,
          name: workout.name,
          reps: workout.reps,
          day: workout.day,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      setWorkouts([...workouts, data]);
    } catch (error: any) {
      toast.error("Erro ao adicionar treino");
      console.error("Erro:", error);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const workout = workouts.find((w) => w.id === id);
    if (!workout) return;

    try {
      const { error } = await supabase
        .from("workouts")
        .update({ completed: !workout.completed })
        .eq("id", id);

      if (error) throw error;

      setWorkouts(
        workouts.map((w) =>
          w.id === id ? { ...w, completed: !w.completed } : w
        )
      );
    } catch (error: any) {
      toast.error("Erro ao atualizar treino");
      console.error("Erro:", error);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setWorkouts(workouts.filter((w) => w.id !== id));
    } catch (error: any) {
      toast.error("Erro ao deletar treino");
      console.error("Erro:", error);
    }
  };

  const handleBackToCategories = () => {
    setCategory(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

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
            
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
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
