import { useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useStore } from "./store";

export default function ImageNode({ data, id }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
  const edges = useStore((state) => state.edges);
  const nodes = useStore((state) => state.nodes);

  const handleRun = async () => {
    setIsLoading(true);
    setImageUrl("");

    try {
      const incomingEdge = edges.find((edge) => edge.target === id);
      let promptToSend = "一只可爱的小狗";

      if (incomingEdge) {
        const sourceNode = nodes.find((node) => node.id === incomingEdge.source);
        if (sourceNode && sourceNode.data && sourceNode.data.text) {
          promptToSend = String(sourceNode.data.text);
        }
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToSend }),
      });
      
      const resData = await response.json();
      
      if (resData.imageUrl) {
        setImageUrl(resData.imageUrl);
      } else {
        alert("生成失败，请看控制台");
        console.error(resData);
      }
    } catch (error: any) {
      console.error("请求报错:", error);
      alert("请求失败：" + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#18181b] rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(59,130,246,0.1)] border border-[#3f3f46] w-72 overflow-hidden transition-all hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
      {/* 头部深色 */}
      <div className="bg-[#27272a] px-3 py-2 border-b border-[#3f3f46] text-sm font-bold text-gray-200 flex justify-between items-center">
        <span>🖼️ {data.title || "图像节点"}</span>
        <button 
          onClick={handleRun} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded cursor-pointer disabled:bg-[#3f3f46] disabled:text-gray-500 transition-colors shadow-sm"
        >
          {isLoading ? "生成中..." : "▶ 执行"}
        </button>
      </div>
      
      {/* 图片展示区变暗 */}
      <div className="p-3 flex flex-col items-center justify-center min-h-[150px] bg-[#09090b]">
        {isLoading ? (
          <span className="text-sm text-blue-400 animate-pulse">云端正在作画...</span>
        ) : imageUrl ? (
          <img src={imageUrl} alt="生成结果" className="w-full rounded-md object-cover border border-[#3f3f46]" />
        ) : (
          <span className="text-sm text-gray-500">等待接收上游数据...</span>
        )}
      </div>

      {/* 左侧连接点：蓝色发光 */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-2 border-[#09090b]" />
      {/* 右侧连接点：绿色发光 */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-green-500 border-2 border-[#09090b]" />
    </div>
  );
}