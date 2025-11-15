import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Workout {
  id: string;
  name: string;
  reps: string;
  day: string;
  completed: boolean;
}

interface WorkoutCalendarProps {
  workouts: Workout[];
  onToggleComplete: (id: string) => void;
  onDeleteWorkout: (id: string) => void;
}

const DAYS = [
  { value: "monday", label: "SEG" },
  { value: "tuesday", label: "TER" },
  { value: "wednesday", label: "QUA" },
  { value: "thursday", label: "QUI" },
  { value: "friday", label: "SEX" },
  { value: "saturday", label: "SÁB" },
  { value: "sunday", label: "DOM" },
];

const WorkoutCalendar = ({ workouts, onToggleComplete, onDeleteWorkout }: WorkoutCalendarProps) => {
  const handleToggleComplete = (id: string, currentStatus: boolean) => {
    onToggleComplete(id);
    toast.success(currentStatus ? "Treino desmarcado" : "Treino concluído! 💪");
  };

  const handleDelete = (id: string) => {
    onDeleteWorkout(id);
    toast.success("Treino removido");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground mb-6">Calendário Semanal</h2>
      
      {DAYS.map((day) => {
        const dayWorkouts = workouts.filter((w) => w.day === day.value);
        
        return (
          <Card key={day.value} className="p-4 shadow-soft bg-gradient-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-card-foreground">{day.label}</h3>
              <span className="text-sm text-muted-foreground">
                {dayWorkouts.length} {dayWorkouts.length === 1 ? "exercício" : "exercícios"}
              </span>
            </div>
            
            {dayWorkouts.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">Nenhum treino agendado</p>
            ) : (
              <div className="space-y-2">
                {dayWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      workout.completed
                        ? "bg-accent/10 border-accent"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex-1">
                      <p className={`font-medium ${workout.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {workout.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{workout.reps}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={workout.completed ? "default" : "outline"}
                        onClick={() => handleToggleComplete(workout.id, workout.completed)}
                        className={workout.completed ? "bg-accent hover:bg-accent/90" : ""}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(workout.id)}
                        className="hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default WorkoutCalendar;
