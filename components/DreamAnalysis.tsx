
import React, { useState, useEffect, useRef } from 'react';
import { analyzeDream } from '../services/geminiService';
import { Perspective, GeminiAnalysisResponse, DreamTag, ChatMessage } from '../types';
import { ICONS } from '../constants';
import { GoogleGenAI, Chat } from "@google/genai";

interface DreamAnalysisProps {
  dreamContent: string;
  tags: DreamTag[];
  perspectives: Perspective[];
  onReset: () => void;
}

const DreamAnalysis: React.FC<DreamAnalysisProps> = ({ dreamContent, tags, perspectives, onReset }) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<GeminiAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 聊天相关状态
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatInstanceRef = useRef<Chat | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const tagLabels = tags.map(t => t.label);
        const res = await analyzeDream(dreamContent, perspectives, tagLabels);
        setReport(res);
        
        // 初始化聊天实例
        const ai = new GoogleGenAI({ apiKey: (process as any).env.API_KEY || '' });
        const systemInstruction = `
          你是一位温和、洞悉人心与人性的梦境解析专家。
          用户刚刚记录了一个梦境并收到了一份深度解析报告。
          
          梦境内容：${dreamContent}
          关键意象：${tagLabels.join(', ')}
          报告核心：${res.mainAnalysis}
          
          你的职责是：
          1. 以朋友般温暖且睿智的语气，回答用户关于这个梦境的追问。
          2. 引导用户观察自己的内心感受，而不是简单地给出结论。
          3. 保持同理心，特别是当用户表达不安或困惑时。
          4. 你的回答应富有启发性，帮助用户完成自我的心理整合。
        `;
        
        chatInstanceRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction,
          },
        });

      } catch (err) {
        setError("梦境的丝线在传递中迷失了，请让我们再次尝试。");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [dreamContent, perspectives, tags]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || !chatInstanceRef.current || isTyping) return;

    const userText = userInput.trim();
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const response = await chatInstanceRef.current.sendMessage({ message: userText });
      const modelText = response.text || "我似乎在梦境的深处迷了路，能请你再说一次吗？";
      setChatMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages(prev => [...prev, { role: 'model', text: "对不起，在那一瞬间，我与梦境的连接中断了。" }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-8 font-soft">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-[6px] border-indigo-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-[6px] border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🌌</div>
        </div>
        <div className="text-center">
          <p className="text-indigo-200 font-dreamy text-2xl tracking-widest animate-pulse">正在编织深度梦境报告...</p>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.3em]">深度剥离 · 多维透视 · 现实指引</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dreamy-glass p-12 text-center space-y-6 font-soft">
        <div className="text-5xl">🌫️</div>
        <p className="text-red-300 text-lg">{error}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/10">重新尝试</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn font-soft pb-32">
      {/* 报告头部 */}
      <div className="flex items-center justify-between sticky top-0 bg-slate-900/60 backdrop-blur-2xl py-6 z-20 border-b border-white/5 px-6 rounded-b-[2rem] mx-[-1rem]">
        <div>
          <h2 className="text-2xl font-dreamy text-indigo-100">深度梦境启示录</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest">Multi-Dimensional Analysis Report</p>
        </div>
        <button onClick={onReset} className="text-slate-400 hover:text-white transition-all text-xs font-bold bg-white/5 px-5 py-2.5 rounded-full border border-white/5">
          记录新梦境
        </button>
      </div>

      {/* 综述模块 */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 ml-2">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-300">✧</div>
          <h3 className="text-indigo-200 font-bold">核心综述</h3>
        </div>
        <div className="dreamy-glass p-10 md:p-14 text-xl leading-relaxed text-slate-100 border-l-[12px] border-indigo-500/30 shadow-2xl">
          {report?.mainAnalysis}
        </div>
      </section>

      {/* 多维透视展示 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {report?.sections.map((section, idx) => (
          <section key={idx} className="space-y-4">
            <div className="flex items-center gap-3 ml-2">
               <span className="text-xs font-bold text-indigo-400/60">SECTION 0{idx + 1}</span>
               <h3 className="text-indigo-200 font-bold">{section.title}</h3>
            </div>
            <div className="dreamy-glass p-8 text-base text-slate-300 leading-relaxed min-h-[200px] border-t border-white/5 hover:border-white/10 transition-all">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      {/* 重点指引与调适 */}
      <div className="grid grid-cols-1 gap-8">
        <section className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full"></div>
          <div className="dreamy-glass p-10 border-emerald-500/20 bg-emerald-500/5 transition-all hover:bg-emerald-500/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl">🌱</div>
              <div>
                <h3 className="text-emerald-200 font-bold text-xl">生活与工作启示</h3>
                <p className="text-[10px] text-emerald-500/60 uppercase tracking-widest">Reality Guidance</p>
              </div>
            </div>
            <div className="text-slate-300 leading-relaxed italic text-lg border-l-2 border-emerald-500/30 pl-6">
              {report?.lifeWorkAdvice}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full"></div>
          <div className="dreamy-glass p-10 border-purple-500/20 bg-purple-500/5 transition-all hover:bg-purple-500/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-2xl">🧘</div>
              <div>
                <h3 className="text-purple-200 font-bold text-xl">心灵调适处方</h3>
                <p className="text-[10px] text-purple-500/60 uppercase tracking-widest">Self-Adjustment Tips</p>
              </div>
            </div>
            <div className="text-slate-300 leading-relaxed text-lg pl-6 relative">
              <span className="absolute left-0 top-0 text-4xl opacity-10 font-serif">“</span>
              {report?.adjustmentTips}
            </div>
          </div>
        </section>
      </div>

      {/* 噩梦转化建议 */}
      {report?.isNightmare && (
        <section className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-amber-500/20 p-12 rounded-[3.5rem] space-y-6 border-dashed">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-500/20 rounded-3xl flex items-center justify-center text-3xl shadow-inner">🛡️</div>
            <div>
              <h3 className="text-2xl font-dreamy text-amber-200">阴影中的光亮</h3>
              <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold">Healing Transformation</p>
            </div>
          </div>
          <p className="text-xl text-amber-100/80 italic leading-relaxed font-light pl-6 border-l-4 border-amber-500/30">
            {report?.healingMessage}
          </p>
        </section>
      )}

      {/* 动态对话窗口 */}
      <section className="mt-20 space-y-6 animate-slideUp">
        <div className="flex items-center gap-3 ml-2">
          <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-300">💬</div>
          <div>
            <h3 className="text-indigo-200 font-bold">深度私聊</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Conversing with the Expert</p>
          </div>
        </div>
        
        <div className="dreamy-glass flex flex-col h-[500px] overflow-hidden border-indigo-500/20">
          {/* 消息历史 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {chatMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4 opacity-60">
                <div className="text-4xl">🕯️</div>
                <p className="text-sm italic">“关于这个梦，你还有什么想倾诉或追问的吗？”</p>
              </div>
            )}
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600/40 text-indigo-50 border border-indigo-500/30 rounded-tr-none' 
                    : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/10 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* 输入框 */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/5 flex gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="向梦境专家提问..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 focus:outline-none focus:border-indigo-400/30 text-sm placeholder:text-slate-600"
            />
            <button 
              type="submit"
              disabled={!userInput.trim() || isTyping}
              className="p-3 bg-indigo-500/80 rounded-2xl hover:bg-indigo-500 transition-all disabled:opacity-30 active:scale-95 flex items-center justify-center text-white"
            >
              <ICONS.ArrowRight />
            </button>
          </form>
        </div>
      </section>

      {/* 结语 */}
      <div className="text-center py-10 opacity-40">
        <div className="h-[1px] w-32 bg-indigo-500/30 mx-auto mb-4"></div>
        <p className="italic text-sm">解析仅供参考，最懂梦的人永远是你自己</p>
      </div>
    </div>
  );
};

export default DreamAnalysis;
