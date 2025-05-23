import { useEffect, useState } from 'react'
import './App.css'
import { fetchActionBlueprintGraph } from './api/mockApi'
import NodeGraph from './NodeGraph'
import PrefillPanel from './PrefillPanel'
import PrefillDataModal, { type DataSource } from './PrefillDataModal'

// Types for the graph
interface Edge {
  source: string
  target: string
}
interface BlueprintGraph {
  forms: Array<any>
  nodes: Array<any>
  edges: Array<Edge>
}

function App() {
  const [graph, setGraph] = useState<BlueprintGraph | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [modalField, setModalField] = useState<string | null>(null)

  // Map form id to form name for display
  const formMap: Record<string, string> = {}
  graph?.forms.forEach((form) => {
    formMap[form.id] = form.name
  })

  // Dynamically calculate node positions for a layered DAG layout
  // 1. Find root nodes (no incoming edges)
  const incoming: Record<string, number> = {}
  graph?.nodes.forEach(node => { incoming[node.id] = 0 })
  graph?.edges.forEach(edge => { incoming[edge.target] = (incoming[edge.target] || 0) + 1 })
  const roots = graph?.nodes.filter(node => incoming[node.id] === 0) || []

  // 2. BFS to assign layers
  const nodeLayers: Record<string, number> = {}
  let maxLayer = 0
  if (graph) {
    const queue: Array<{ id: string, layer: number }> = roots.map(r => ({ id: r.id, layer: 0 }))
    const visited = new Set<string>()
    while (queue.length) {
      const { id, layer } = queue.shift()!
      if (visited.has(id)) continue
      visited.add(id)
      nodeLayers[id] = layer
      maxLayer = Math.max(maxLayer, layer)
      graph.edges.filter(e => e.source === id).forEach(e => {
        queue.push({ id: e.target, layer: layer + 1 })
      })
    }
  }

  // 3. Group nodes by layer and assign x/y positions
  const layerNodes: Record<number, string[]> = {}
  Object.entries(nodeLayers).forEach(([id, layer]) => {
    if (!layerNodes[layer]) layerNodes[layer] = []
    layerNodes[layer].push(id)
  })
  const nodePositions: Record<string, { x: number; y: number }> = {}
  const width = 650
  const height = 320
  const layerCount = maxLayer + 1
  for (let layer = 0; layer < layerCount; ++layer) {
    const nodes = layerNodes[layer] || []
    const yStep = height / (nodes.length + 1)
    nodes.forEach((id, i) => {
      nodePositions[id] = {
        x: 60 + (width - 120) * (layer / Math.max(1, layerCount - 1)),
        y: yStep * (i + 1) - 40
      }
    })
  }

  // Dynamically build formFields from graph.forms
  const formFields: Record<string, string[]> = {};
  graph?.forms.forEach(form => {
    // Use the field_schema.properties keys as the field names
    const props = form.field_schema?.properties ? Object.keys(form.field_schema.properties) : [];
    formFields[form.id] = props.length > 0 ? props : ['field1', 'field2'];
  });

  // Prefill mapping state for all forms (initialize for all forms in graph)
  const [prefill, setPrefill] = useState<Record<string, Record<string, string | null>>>(() => {
    const initial: Record<string, Record<string, string | null>> = {};
    graph?.forms.forEach(form => {
      initial[form.id] = {};
      (formFields[form.id] || []).forEach(f => { initial[form.id][f] = null; });
    });
    return initial;
  });

  // Update prefill state if forms change (e.g., after API loads)
  useEffect(() => {
    if (!graph) return;
    setPrefill(prev => {
      const updated: Record<string, Record<string, string | null>> = { ...prev };
      graph.forms.forEach(form => {
        if (!updated[form.id]) updated[form.id] = {};
        (formFields[form.id] || []).forEach(f => {
          if (!(f in updated[form.id])) updated[form.id][f] = null;
        });
      });
      return updated;
    });
  }, [graph]);

  // --- Prefill Data Modal logic ---
  // Compute available data sources for the selected node/field
  function getPrefillDataSources(formId: string): DataSource[] {
    // 1. Find direct and transitive dependencies
    const directDeps = new Set<string>()
    const transitiveDeps = new Set<string>()
    // Build reverse edge map
    const incomingMap: Record<string, string[]> = {}
    if (graph) {
      graph.edges.forEach((e: { source: string; target: string }) => {
        if (!incomingMap[e.target]) incomingMap[e.target] = []
        incomingMap[e.target].push(e.source)
      })
    }
    // Direct dependencies
    ((incomingMap[formId] || []) as string[]).forEach((dep: string) => directDeps.add(dep))
    // Transitive dependencies (BFS)
    const queue: string[] = [...(incomingMap[formId] || [])]
    const visited = new Set(queue)
    while (queue.length) {
      const curr = queue.shift() as string
      (incomingMap[curr] || []).forEach((dep: string) => {
        if (!visited.has(dep)) {
          transitiveDeps.add(dep)
          queue.push(dep)
          visited.add(dep)
        }
      })
    }
    // Remove direct from transitive
    directDeps.forEach(d => transitiveDeps.delete(d))
    // 2. Build data sources
    const sources: DataSource[] = []
    // Direct dependencies
    if (directDeps.size) {
      sources.push({
        label: 'Direct dependencies',
        nodes: Array.from(directDeps).map(fid => ({
          label: formMap[fid] || fid,
          value: fid,
          children: (formFields[fid] || []).map(f => ({ label: f, value: `${fid}.${f}` }))
        }))
      })
    }
    // Transitive dependencies
    if (transitiveDeps.size) {
      sources.push({
        label: 'Transitive dependencies',
        nodes: Array.from(transitiveDeps).map(fid => ({
          label: formMap[fid] || fid,
          value: fid,
          children: (formFields[fid] || []).map(f => ({ label: f, value: `${fid}.${f}` }))
        }))
      })
    }
    // Global data (mocked)
    sources.push({
      label: 'Global Data',
      nodes: [
        { label: 'user_id', value: 'global.user_id' },
        { label: 'org_name', value: 'global.org_name' },
      ]
    })
    return sources
  }

  useEffect(() => {
    fetchActionBlueprintGraph().then(setGraph)
  }, [])

  if (!graph || !graph.nodes || graph.nodes.length === 0) {
    return <div style={{ color: 'red', margin: 40 }}>No nodes to display. Check your mockApi data.</div>;
  }

  return (
    <div className="App" style={{ position: 'relative', minHeight: height + 60, background: '#fff' }}>
      <h3 style={{ color: '#111' }}>Journey Builder React Coding Challenge</h3>
      <div
        style={{
          position: 'relative',
          width: width + 60,
          height: height + 40,
          margin: '0 auto',
          overflow: 'auto',
          background: '#f8fafc',
          border: '1.5px solid #bfc7d1',
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
      >
        <NodeGraph
          graph={graph}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          formMap={formMap}
          nodePositions={nodePositions}
        />
      </div>
      {/* Prefill panel for selected node (show for any form with fields) */}
      {selectedNode && formFields[selectedNode] && prefill[selectedNode] && (
        <div style={{ position: 'absolute', left: width / 2 - 200, top: 20, zIndex: 10, width: 400 }}>
          {/* Overlay for click-away */}
          <div
            onClick={() => setSelectedNode(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9,
              background: 'transparent',
            }}
          />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <PrefillPanel
              formId={selectedNode}
              fields={formFields[selectedNode]}
              prefill={prefill[selectedNode]}
              onEdit={(field) => setModalField(field)}
              onClear={(field) => {
                setPrefill(p => ({
                  ...p,
                  [selectedNode]: { ...p[selectedNode], [field]: null }
                }))
              }}
            />
          </div>
        </div>
      )}
      {/* Prefill Data Modal */}
      {selectedNode && modalField && (
        <PrefillDataModal
          open={true}
          sources={getPrefillDataSources(selectedNode)}
          onSelect={value => {
            setPrefill(p => ({
              ...p,
              [selectedNode]: { ...p[selectedNode], [modalField]: value }
            }))
            setModalField(null)
          }}
          onCancel={() => setModalField(null)}
        />
      )}
    </div>
  )
}

export default App
