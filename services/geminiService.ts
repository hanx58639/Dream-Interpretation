
import { GoogleGenAI, Type } from "@google/genai";
import { Perspective, GeminiAnalysisResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeDream = async (
  dreamContent: string, 
  perspectives: Perspective[], 
  tags: string[]
): Promise<GeminiAnalysisResponse> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    你是一位顶级的梦境解析专家，融合了荣格心理学、社会人类学与职业生涯咨询经验。
    请为用户生成一份【多维综合梦境报告】。不要进行分支对话，必须一次性给出完整深度解析。

    报告必须包含以下模块：
    1. 核心综述：梦境的整体意境与底层动机。
    2. 多维透视：根据用户选择的视角（${perspectives.join('、')}），提供深度分析。
    3. 现实指引：针对现实生活、职场、人际关系的具体启发与建议。
    4. 自我调适：针对梦中情绪提供的心理调节方案或行动建议（如冥想、书写、沟通等）。
    
    语气要求：专业、睿智、充满人文关怀。
    如果是噩梦：请在报告中加入一个“治愈转化”模块，解释恐惧背后的力量，并给出温和的心理安抚。
    
    输出格式：必须严格返回 JSON 对象。
  `;

  const prompt = `
    【用户梦境】： "${dreamContent}"
    【关键元素】： ${tags.join(', ')}
    【选定视角】： ${perspectives.join(', ')}
    
    请以此生成深度报告。注意：生活工作建议要具体，调适建议要具有可操作性。
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mainAnalysis: { type: Type.STRING, description: "核心深度综述。" },
          sections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "章节标题（如：潜意识的投射）。" },
                content: { type: Type.STRING, description: "具体的维度解析内容。" }
              },
              required: ["title", "content"]
            }
          },
          lifeWorkAdvice: { type: Type.STRING, description: "针对生活与工作的具体建议。" },
          adjustmentTips: { type: Type.STRING, description: "自我调适与心理健康建议。" },
          isNightmare: { type: Type.BOOLEAN, description: "是否判定为压力型或噩梦。" },
          healingMessage: { type: Type.STRING, description: "如果是噩梦，提供的转化与治愈文字。" }
        },
        required: ["mainAnalysis", "sections", "lifeWorkAdvice", "adjustmentTips", "isNightmare"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("深度报告解析失败", e);
    throw new Error("梦境深度过高，星图解析暂无回应。请稍后重试。");
  }
};
