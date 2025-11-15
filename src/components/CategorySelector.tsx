import { Dumbbell, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategorySelectorProps {
  onSelectCategory: (category: "gym" | "boxing") => void;
}

const CategorySelector = ({ onSelectCategory }: CategorySelectorProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Seu Personal Trainer
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          Escolha sua categoria de treino e comece sua jornada
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <button
            onClick={() => onSelectCategory("gym")}
            className="group relative overflow-hidden bg-card rounded-2xl p-8 shadow-strong hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Dumbbell className="w-20 h-20 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold text-card-foreground mb-2">Academia</h2>
            <p className="text-muted-foreground">Musculação, força e hipertrofia</p>
          </button>

          <button
            onClick={() => onSelectCategory("boxing")}
            className="group relative overflow-hidden bg-card rounded-2xl p-8 shadow-strong hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <UserRound className="w-20 h-20 mx-auto mb-4 text-secondary group-hover:scale-110 transition-transform" />
            <h2 className="text-3xl font-bold text-card-foreground mb-2">Boxe</h2>
            <p className="text-muted-foreground">Técnica, resistência e agilidade</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;
