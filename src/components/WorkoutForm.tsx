import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface WorkoutFormProps {
  onAddWorkout: (workout: {
    id: string;
    name: string;
    reps: string;
    day: string;
    completed: boolean;
  }) => void;
}

const DAYS = [
  { value: "monday", label: "Segunda-feira" },
  { value: "tuesday", label: "Terça-feira" },
  { value: "wednesday", label: "Quarta-feira" },
  { value: "thursday", label: "Quinta-feira" },
  { value: "friday", label: "Sexta-feira" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

const WorkoutForm = ({ onAddWorkout }: WorkoutFormProps) => {
  const [name, setName] = useState("");
  const [reps, setReps] = useState("");
  const [day, setDay] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !reps || !day) {
      toast.error("Preencha todos os campos!");
      return;
    }

    onAddWorkout({
      id: Date.now().toString(),
      name,
      reps,
      day,
      completed: false,
    });

    setName("");
    setReps("");
    setDay("");
    toast.success("Treino adicionado com sucesso!");
  };

  return (
    <Card className="p-6 shadow-soft bg-gradient-card">
      <h2 className="text-2xl font-bold mb-6 text-card-foreground">Adicionar Exercício</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-foreground">Nome do Exercício</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Supino reto"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="reps" className="text-foreground">Repetições/Séries</Label>
          <Input
            id="reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            placeholder="Ex: 4x12"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="day" className="text-foreground">Dia da Semana</Label>
          <Select value={day} onValueChange={setDay}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o dia" />
            </SelectTrigger>
            <SelectContent>
              {DAYS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Treino
        </Button>
      </form>
    </Card>
  );
};

export default WorkoutForm;
