
import React, { useState } from 'react';
import { ICONS, TAG_TYPES } from '../constants';
import { DreamTag, Perspective } from '../types';

interface DreamRecorderProps {
  onSave: (content: string, tags: DreamTag[], perspectives: Perspective[]) => void;
}

const DreamRecorder: React.FC<DreamRecorderProps> = ({ onSave }) => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<DreamTag[]>([]);
  const [selectedPerspectives, setSelectedPerspectives] = useState<Perspective[]>([Perspective.Psychological]);
  const [newTag, setNewTag] = useState('');
  const [activeTagType, setActiveTagType] = useState<string>('object');

  const addTag = () => {
    if (!newTag.trim()) return;
    setTags([...tags, { id: Date.now().toString(), label: newTag, type: activeTagType as any }]);
    setNewTag('');
  };

  const removeTag = (id: string) => setTags(tags.filter(t => t.id !== id));

  const togglePerspective = (p: Perspective) => {
    if (selectedPerspectives.includes(p)) {
      if (selectedPerspectives.length > 1) {
        setSelectedPerspectives(selectedPerspectives.filter(x => x !== p));
      }
    } else {
      setSelectedPerspectives([...selectedPerspectives, p]);
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn font-soft">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-dreamy text-indigo-100 tracking-wider">昨晚，你抵达了哪个维度？</h2>
        <p className="text-indigo-300/60 text-sm max-w-md mx-auto">记录梦境是与深层自我的对话。请开启这场深度剥离之旅。</p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-indigo-300/80 text-sm mb-2 ml-2">
          <span className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
          <span className="font-bold">倾诉梦境情节</span>
        </div>
        <div className="relative group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="我梦见自己走进了一座开满时钟的花园，指针在逆流..."
            className="w-full h-64 bg-white/5 border-2 border-white/10 rounded-[2.5rem] p-8 text-xl focus:outline-none focus:border-indigo-400/50 focus:ring-8 focus:ring-indigo-500/5 transition-all resize-none placeholder:text-slate-600 placeholder:italic leading-relaxed shadow-inner"
          />
          <div className="absolute bottom-6 right-6 flex gap-3">
            <button className="p-4 bg-indigo-500/10 rounded-full hover:bg-indigo-500/30 transition-all text-indigo-200 border border-white/5" title="语音倾诉 (即将上线)">
              <ICONS.Mic />
            </button>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-10">
        <section className="space-y-4">
          <div className="flex flex-col gap-1 mb-2 ml-2">
            <div className="flex items-center gap-2 text-indigo-300/80 text-sm">
              <span className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
              <span className="font-bold">捕获梦的碎片</span>
            </div>
            <p className="text-[11px] text-slate-500 ml-8">关键符号能让解析更加精准定位</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TAG_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveTagType(type.id)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                  activeTagType === type.id ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 hover:bg-white/10 text-slate-400'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              placeholder={`输入${TAG_TYPES.find(t => t.id === activeTagType)?.label}...`}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 focus:outline-none focus:border-indigo-400/30 text-sm"
            />
            <button onClick={addTag} className="px-5 bg-indigo-500/80 rounded-2xl hover:bg-indigo-500 transition-all active:scale-95">
              <ICONS.Plus />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[48px]">
            {tags.map(tag => (
              <span key={tag.id} className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 rounded-full text-xs border border-indigo-500/20 text-indigo-200 animate-fadeIn">
                <span className="opacity-40">#</span> {tag.label}
                <button onClick={() => removeTag(tag.id)} className="text-white/30 hover:text-white transition-colors ml-1">&times;</button>
              </span>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-1 mb-2 ml-2">
            <div className="flex items-center gap-2 text-indigo-300/80 text-sm">
              <span className="w-6 h-6 bg-indigo-500/20 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
              <span className="font-bold">开启探索视角</span>
            </div>
            <p className="text-[11px] text-slate-500 ml-8">支持多选，我们将一次性为您生成跨维度的深度报告</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {Object.values(Perspective).map(p => (
              <button
                key={p}
                onClick={() => togglePerspective(p)}
                className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all group ${
                  selectedPerspectives.includes(p)
                    ? 'bg-indigo-500/20 border-indigo-400 text-white shadow-inner'
                    : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                }`}
              >
                <div className={`p-3 rounded-2xl transition-colors ${selectedPerspectives.includes(p) ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5'}`}>
                  {p === Perspective.Psychological && <ICONS.Psych />}
                  {p === Perspective.Cultural && <ICONS.Culture />}
                  {p === Perspective.Creative && <ICONS.Creative />}
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm tracking-wide">{p}</div>
                  <div className="text-[10px] opacity-40 mt-1 leading-tight">
                    {p === Perspective.Psychological && "深挖自我状态与潜意识补偿"}
                    {p === Perspective.Cultural && "链接集体潜意识与符号文明"}
                    {p === Perspective.Creative && "捕捉叙事灵感与视觉艺术隐喻"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="pt-8">
        <button
          onClick={() => onSave(content, tags, selectedPerspectives)}
          disabled={!content.trim()}
          className="w-full py-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-[length:200%_auto] hover:bg-right transition-all duration-700 disabled:opacity-30 disabled:grayscale rounded-[2.5rem] font-bold text-xl shadow-[0_20px_50px_rgba(99,102,241,0.4)] hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-4 group"
        >
          <span className="text-3xl group-hover:rotate-12 transition-transform duration-300">📜</span> 
          <span>生成深度梦境启示报告</span>
        </button>
      </div>
    </div>
  );
};

export default DreamRecorder;
