"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { ProfileData } from "@/features/profile/types";

interface ProfileHeroProps {
  profile: ProfileData;
}

export function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={profile.avatarUrl}
          alt={`${profile.username}'s avatar`}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full border-2 border-glass-border shadow-glow"
        />
      </motion.div>

      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
        <p className="text-lg text-muted-foreground">@{profile.username}</p>
        {profile.bio && (
          <p className="max-w-md text-sm text-muted-foreground/80">{profile.bio}</p>
        )}
      </motion.div>
    </div>
  );
}
