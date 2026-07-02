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
import { useState } from 'react';

type ReflectionActionsMenuProps = {
  reflectionId: string;
  isEditable: boolean;
  showEditAction?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDeleted?: () => void;
};

export default function ReflectionActionsMenu({
  reflectionId,
  isEditable,
  showEditAction = true,
  isOpen,
  onOpenChange,
  onDeleted,
}: ReflectionActionsMenuProps) {
  const navigate = useNavigate();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = typeof isOpen === 'boolean';
  const open = isControlled ? isOpen : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={handleOpenChange}
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

        {isEditable && showEditAction ? (
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
          onDeleted={() => {
            handleOpenChange(false);
            onDeleted?.();
          }}
          onCancel={() => {
            handleOpenChange(false);
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
