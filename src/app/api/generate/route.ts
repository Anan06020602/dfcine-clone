import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.ZHIPU_API_KEY;
  const { prompt } = await req.json();

  if (!apiKey) {
    return Response.json({ error: "未找到 ZHIPU_API_KEY，请检查 .env.local 文件" }, { status: 500 });
  }

  const res = await fetch("https://open.bigmodel.cn/api/paas/v4/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "cogview-3-flash",
      prompt: prompt,
    }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    console.log("智谱 API 报错:", data);
    return Response.json({ error: data.error || "未知错误" }, { status: res.status });
  }

  return Response.json({ imageUrl: data?.data?.[0]?.url });
}