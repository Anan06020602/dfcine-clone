import { create } from 'zustand';
import { Connection, Edge, EdgeChange, Node, NodeChange, addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

type Store = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: any) => void;
};

export const useStore = create<Store>((set, get) => ({
  nodes: [
    {
      id: '1',
      position: { x: 100, y: 100 },
      data: { title: '提示词 1', text: '一只可爱的赛博朋克猫咪' },
      type: 'textNode',
    },
  ],
  edges: [],
  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  onConnect: (connection) => set({ edges: addEdge({ ...connection, animated: true }, get().edges) }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  // 新增：更新节点里的数据
  updateNodeData: (id, newData) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      }),
    });
  },
}));