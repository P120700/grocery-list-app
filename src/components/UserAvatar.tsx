import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { forwardRef } from 'react';

export const UserAvatar = forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<'button'>
>((props, ref) => {
  return (
    <button ref={ref} {...props} className="cursor-pointer">
      <Avatar className="w-10 h-10">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </button>
  );
});
