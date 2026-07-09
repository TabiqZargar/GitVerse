"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThreeScene } from "@/features/visualization/components/three-scene";
import { FlowCanvas } from "@/features/visualization/components/flow-canvas";

export default function VisualizationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Visualization</h1>
        <p className="text-muted-foreground mt-2">Explore your contributions in 3D and interactive flows</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>3D Contribution Universe</CardTitle>
          <CardDescription>
            Interactive 3D visualization of your GitHub activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ThreeScene />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Repository Flow Map</CardTitle>
          <CardDescription>Visualize connections between your repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <FlowCanvas />
        </CardContent>
      </Card>
    </div>
  );
}
