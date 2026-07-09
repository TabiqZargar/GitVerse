"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReposPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Repositories</h1>
        <p className="text-muted-foreground mt-2">Manage your tracked repositories</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Repositories</CardTitle>
          <CardDescription>Repositories connected to GitVerse</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No repositories connected yet. Add a repository to start tracking contributions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
