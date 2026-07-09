"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
}

export function UserAvatar({ className }: UserAvatarProps) {
  const { data: session } = useSession();

  if (!session?.user?.image) {
    return (
      <div
        className={cn(
          "bg-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
          className
        )}
      >
        {session?.user?.name?.charAt(0) ?? "?"}
      </div>
    );
  }

  return (
    <Image
      src={session.user.image}
      alt={session.user.name ?? "User avatar"}
      width={32}
      height={32}
      className={cn("h-8 w-8 rounded-full", className)}
    />
  );
}
