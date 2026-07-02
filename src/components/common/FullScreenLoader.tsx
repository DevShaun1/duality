import { Loader2 } from 'lucide-react';
import { devComponentAttrs } from '@/lib/devtools';

export default function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6" {...devComponentAttrs('FullScreenLoader')}>
      <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm">Gathering your reflection space...</p>
      </div>
    </div>
  );
}
