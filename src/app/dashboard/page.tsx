"use client";

import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  return (
    <div className="p-unit-xxl space-y-gutter">
      <header className="flex justify-between items-center">
        <h1 className="font-headline-lg text-headline-lg text-primary">Command Center</h1>
        <div className="w-12 h-12 rounded-full bg-surface-container-high border border-white/10" />
      </header>
      
      <div className="grid grid-cols-12 gap-gutter">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-8 h-96 glass-panel rounded-xl p-unit-lg"
        >
            <h2 className="font-headline-sm mb-unit-md">System Throughput</h2>
            <Skeleton className="w-full h-full" />
        </motion.div>
        <div className="col-span-4 space-y-gutter">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-44 glass-panel rounded-xl p-unit-md"
            >
                <h3 className="font-label-mono text-primary">Status</h3>
                <Skeleton className="w-20 h-8 mt-4" />
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="h-44 glass-panel rounded-xl p-unit-md"
            >
                <h3 className="font-label-mono text-primary">Sync</h3>
                <Skeleton className="w-32 h-8 mt-4" />
            </motion.div>
        </div>
      </div>
    </div>
  );
}
