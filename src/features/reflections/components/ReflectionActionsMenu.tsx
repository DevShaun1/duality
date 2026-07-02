import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Sparkles, Trash2 } from 'lucide-react';
import { DeleteReflectionButton } from './DeleteReflectionButton';
import { useNavigate } from 'react-router-dom';
import { devComponentAttrs } from '@/lib/devtools';

type ReflectionActionsMenuProps = {
  reflectionId: string;
  isEditable: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export default function ReflectionActionsMenu({
  reflectionId,
  isEditable,
  isOpen,
  onOpenChange,
  onDeleted,
}: ReflectionActionsMenuProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={onOpenChange}
      {...devComponentAttrs('ReflectionActionsMenu')}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="-mt-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          onSelect={() => {
            navigate(`/reflections/${reflectionId}`);
          }}
        >
          <Eye className="h-4 w-4" />
          View insight
        </DropdownMenuItem>

        {isEditable ? (
          <DropdownMenuItem
            onSelect={() => {
              navigate('/reflect');
            }}
          >
            <Sparkles className="h-4 w-4" />
            Edit reflection
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator />

        <DeleteReflectionButton
          reflectionId={reflectionId}
          hideErrorText
          triggerAsChild
          onDeleted={onDeleted}
          onCancel={() => {
            onOpenChange(false);
          }}
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
