"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

interface FlowCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  nodeTypes?: NodeTypes;
}

const defaultNodes: Node[] = [
  {
    id: "1",
    type: "default",
    position: { x: 0, y: 0 },
    data: { label: "GitHub" },
  },
];

export function FlowCanvas({
  initialNodes = defaultNodes,
  initialEdges = [],
  nodeTypes,
}: FlowCanvasProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <div className="h-[600px] w-full rounded-xl border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
