-- Criar tabela de treinos vinculada aos usuários
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('gym', 'boxing')),
  name TEXT NOT NULL,
  reps TEXT NOT NULL,
  day TEXT NOT NULL CHECK (day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: usuários só podem ver seus próprios treinos
CREATE POLICY "Usuários podem ver seus próprios treinos"
ON public.workouts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Políticas RLS: usuários só podem criar seus próprios treinos
CREATE POLICY "Usuários podem criar seus próprios treinos"
ON public.workouts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Políticas RLS: usuários só podem atualizar seus próprios treinos
CREATE POLICY "Usuários podem atualizar seus próprios treinos"
ON public.workouts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Políticas RLS: usuários só podem deletar seus próprios treinos
CREATE POLICY "Usuários podem deletar seus próprios treinos"
ON public.workouts
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workouts_updated_at
BEFORE UPDATE ON public.workouts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_category ON public.workouts(category);
CREATE INDEX idx_workouts_day ON public.workouts(day);