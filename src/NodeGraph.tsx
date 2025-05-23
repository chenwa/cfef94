import React from 'react';

interface Edge {
  source: string;
  target: string;
}

interface BlueprintGraph {
  forms: Array<any>;
  nodes: Array<any>;
  edges: Array<Edge>;
}

interface NodeGraphProps {
  graph: BlueprintGraph;
  selectedNode: string | null;
  setSelectedNode: (id: string | null) => void;
  formMap: Record<string, string>;
  nodePositions: Record<string, { x: number; y: number }>;
}

const NODE_WIDTH = 72;
const NODE_HEIGHT = 48;

const NodeGraph: React.FC<NodeGraphProps> = ({ graph, selectedNode, setSelectedNode, formMap, nodePositions }) => {
  return (
    <div style={{ position: 'relative', width: 650, height: 320, background: '#f8f8ff', borderRadius: 12, margin: '40px auto' }}>
      {/* SVG edges as curves */}
      <svg width={650} height={320} style={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }}>
        {graph.edges.map((edge, i) => {
          const from = nodePositions[edge.source];
          const to = nodePositions[edge.target];
          if (!from || !to) return null;
          // Draw a cubic Bezier curve
          const dx = to.x - from.x;
          const path = `M${from.x+NODE_WIDTH},${from.y+NODE_HEIGHT} C${from.x+NODE_WIDTH+dx/3},${from.y+NODE_HEIGHT} ${to.x-dx/3},${to.y+NODE_HEIGHT} ${to.x},${to.y+NODE_HEIGHT}`;
          return (
            <path
              key={i}
              d={path}
              stroke="#bbb"
              strokeWidth={2}
              fill="none"
              markerEnd="url(#arrowhead)"
            />
          );
        })}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
            <polygon points="0 0, 10 5, 0 10" fill="#bbb" />
          </marker>
        </defs>
      </svg>
      {/* Render nodes */}
      {graph.nodes.map((node) => {
        const pos = nodePositions[node.id] || { x: 0, y: 0 };
        const formName = formMap[node.data.component_id] || node.data.name || node.id;
        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: NODE_WIDTH,
              height: NODE_HEIGHT,
              background: '#fff',
              border: '2px solid #6c63ff',
              borderRadius: 12,
              boxShadow: '0 2px 8px #0001',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              cursor: 'pointer',
              outline: selectedNode === node.id ? '3px solid #2196f3' : undefined
            }}
            onClick={() => setSelectedNode(node.id)}
          >
            <div style={{ fontWeight: 600, fontSize: 14, color: '#222', textAlign: 'center', lineHeight: 1.2 }}>{formName}</div>
            <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{node.id}</div>
          </div>
        );
      })}
    </div>
  );
};

export default NodeGraph;
