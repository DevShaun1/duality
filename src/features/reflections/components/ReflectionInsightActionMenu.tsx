import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { DeleteReflectionButton } from './DeleteReflectionButton';
import { devComponentAttrs } from '@/lib/devtools';

type ReflectionInsightActionsMenuProps = {
  reflectionId: string;
  onDeleted: () => void;
};

export default function ReflectionInsightActionsMenu({
  reflectionId,
  onDeleted,
}: ReflectionInsightActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCancelDelete = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} {...devComponentAttrs('ReflectionInsightActionsMenu')}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="mt-1 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open reflection actions</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DeleteReflectionButton
          reflectionId={reflectionId}
          hideErrorText
          triggerAsChild
          onDeleted={onDeleted}
          onCancel={handleCancelDelete}
        >
          <DropdownMenuItem
            variant="destructive"
            onSelect={(event) => {
              event.preventDefault();
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete reflection
          </DropdownMenuItem>
        </DeleteReflectionButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
