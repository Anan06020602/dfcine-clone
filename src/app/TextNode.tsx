import { Handle, Position } from "@xyflow/react";
import { useStore } from "./store";

export default function TextNode({ data, id }: any) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-72 overflow-hidden">
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-200 text-sm font-bold text-gray-700">
        📝 {data.title || "文本节点"}
      </div>
      
      <div className="p-3">
        <textarea 
          className="w-full h-20 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="在这里输入提示词..."
          value={data.text || ""}
          // 每次打字，都把内容更新到 store 里
          onChange={(e) => updateNodeData(id, { text: e.target.value })}
        />
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500" />
    </div>
  );
}