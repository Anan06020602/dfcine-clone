"use client";

import { useCallback, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useStore } from "./store";
import TextNode from "./TextNode";
import ImageNode from "./ImageNode";

// 注册节点类型
const nodeTypes = {
  textNode: TextNode,
  imageNode: ImageNode,
};

let id = 2; // 给新节点生成ID
const getId = () => `node_${id++}`;

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode } = useStore();
  const { screenToFlowPosition } = useReactFlow();

  // 拖拽放置结束后的逻辑
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      // 获取鼠标在画布上的位置
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // 根据拖拽的类型创建新节点
      const newNode = {
        id: getId(),
        type,
        position,
        data: { title: type === "textNode" ? "新文本" : "新图像" },
      };

      addNode(newNode);
    },
    [screenToFlowPosition, addNode]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // 拖拽开始的逻辑
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    // 背景改为极暗色
    <div className="flex h-screen w-screen bg-[#09090b]">
      {/* 左侧工具栏改为暗黑玻璃质感 */}
      <aside className="w-64 bg-[#18181b] border-r border-[#3f3f46] p-4 shadow-xl z-10 flex flex-col gap-4">
        <h2 className="text-lg font-bold text-white mb-2 drop-shadow-md">🧰 节点工具箱</h2>
        
        <div
          className="p-3 bg-[#27272a] rounded-lg border border-[#3f3f46] cursor-grab hover:bg-[#3f3f46] transition-all text-center text-sm font-medium text-gray-200 shadow-sm hover:shadow-blue-500/20"
          onDragStart={(event) => onDragStart(event, "textNode")}
          draggable
        >
          📝 文本节点
        </div>
        
        <div
          className="p-3 bg-[#27272a] rounded-lg border border-[#3f3f46] cursor-grab hover:bg-[#3f3f46] transition-all text-center text-sm font-medium text-gray-200 shadow-sm hover:shadow-blue-500/20"
          onDragStart={(event) => onDragStart(event, "imageNode")}
          draggable
        >
          🖼️ 图像节点
        </div>
      </aside>

      {/* 右侧主画布 */}
      <div className="flex-1 h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          colorMode="dark" // 强制暗色模式
        >
          {/* 画布网格改为深灰色，点调小 */}
          <Background color="#3f3f46" gap={20} size={1.5} />
          <Controls className="bg-[#18181b] border-[#3f3f46] fill-white" />
          <MiniMap 
            style={{ backgroundColor: '#18181b' }} 
            nodeColor="#3b82f6" 
            maskColor="rgba(0, 0, 0, 0.7)" 
          />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}