import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  Activity,
  ArrowRight,
  Calendar,
  Compass,
  Dumbbell,
  Moon,
  Smile,
  Sparkles,
  Zap,
} from 'lucide-react';
import ReflectionActionsMenu from './ReflectionActionsMenu';

type ReflectionCardProps = {
  reflection: {
    id: string;
    created_at: string;
    journal_text: string | null;
    sleep_hours: number | null;
    energy: number | null;
    mood: number | null;
    stress: number | null;
    exercised: boolean | null;
    hasInsight: boolean;
  };
  editableReflectionId: string | null;
  openActionsReflectionId: string | null;
  setOpenActionsReflectionId: (id: string | null) => void;
  setCurrentPage: (updater: (page: number) => number) => void;
};

export default function ReflectionCard({
  reflection,
  editableReflectionId,
  openActionsReflectionId,
  setOpenActionsReflectionId,
  setCurrentPage,
}: ReflectionCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      key={reflection.id}
      className="rounded-lg border bg-card py-0 text-card-foreground shadow-sm"
    >
      <CardHeader className="pt-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(reflection.created_at).toLocaleDateString('en-ZA', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <ReflectionActionsMenu
            reflectionId={reflection.id}
            isEditable={reflection.id === editableReflectionId}
            isOpen={openActionsReflectionId === reflection.id}
            onOpenChange={(open) => {
              setOpenActionsReflectionId(open ? reflection.id : null);
            }}
            onDeleted={() => {
              setOpenActionsReflectionId(null);
              setCurrentPage((page) => Math.max(1, page));
            }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <p className="mt-1 whitespace-pre-wrap leading-8">
          {reflection.journal_text || 'No reflection text saved.'}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Moon className="h-3.5 w-3.5 text-violet-400" />
            Sleep {reflection.sleep_hours ?? '—'}
          </span>
          <span className="text-border">|</span>
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            Energy {reflection.energy ?? '—'}
          </span>
          <span className="text-border">|</span>
          <span className="inline-flex items-center gap-1.5">
            <Smile className="h-3.5 w-3.5 text-amber-300" />
            Mood {reflection.mood ?? '—'}
          </span>
          <span className="text-border">|</span>
          <span className="inline-flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            Stress {reflection.stress ?? '—'}
          </span>
          <span className="text-border">|</span>
          <span className="inline-flex items-center gap-1.5">
            <Dumbbell className="h-3.5 w-3.5 text-cyan-400" />
            Exercise {reflection.exercised ? 'Yes' : 'No'}
          </span>
        </div>

        <div className="mt-5 mb-4 border-t pt-4">
          {reflection.hasInsight ? (
            <Link
              to={`/reflections/${reflection.id}`}
              className="group inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              <Compass className="h-4 w-4 transition-transform group-hover:rotate-6" />
              <span className="font-medium">Read Another Perspective</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Button
              type="button"
              className="group h-auto justify-start px-0 py-0 font-medium text-primary hover:bg-transparent hover:text-primary/80"
              onClick={() =>
                navigate(`/reflections/${reflection.id}`, {
                  state: {
                    autoGenerateInsight: true,
                  },
                })
              }
            >
              <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span className="font-medium">Generate AI Insight</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
