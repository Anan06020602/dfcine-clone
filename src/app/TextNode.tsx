import { Handle, Position } from "@xyflow/react";
import { useStore } from "./store";

export default function TextNode({ data, id }: any) {
  const updateNodeData = useStore((state) => state.updateNodeData);

  return (
    <div className="bg-[#18181b] rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(59,130,246,0.1)] border border-[#3f3f46] w-72 overflow-hidden transition-all hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
      {/* 头部深色 */}
      <div className="bg-[#27272a] px-3 py-2 border-b border-[#3f3f46] text-sm font-bold text-gray-200">
        📝 {data.title || "文本节点"}
      </div>
      
      <div className="p-3">
        <textarea 
          className="w-full h-20 p-2 text-sm bg-[#09090b] text-gray-200 border border-[#3f3f46] rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all"
          placeholder="在这里输入提示词..."
          value={data.text || ""}
          // 每次打字，都把内容更新到 store 里
          onChange={(e) => updateNodeData(id, { text: e.target.value })}
        />
      </div>

      {/* 左侧连接点：蓝色发光 */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-[#09090b]" />
      {/* 右侧连接点：绿色发光 */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-[#09090b]" />
    </div>
  );
}