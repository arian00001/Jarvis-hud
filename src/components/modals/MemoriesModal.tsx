import React, { useState } from 'react';
import { X, Database, Plus, Search, Trash2, Shield, Calendar, Tag } from 'lucide-react';
import { useMemories, JarvisMemory } from '../../hooks/useMemories';
import { hudAudio } from '../../utils/soundEffects';

interface MemoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemoriesModal: React.FC<MemoriesModalProps> = ({ isOpen, onClose }) => {
  const { memories, addMemory, deleteMemory } = useMemories();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isAdding, setIsAdding] = useState(false);

  // New memory form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<JarvisMemory['category']>('DIRECTIVE');
  const [newImportance, setNewImportance] = useState<JarvisMemory['importance']>('NOMINAL');

  if (!isOpen) return null;

  const filtered = memories.filter((m) => {
    const matchesCat = categoryFilter === 'ALL' || m.category === categoryFilter;
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    hudAudio.playClick();
    addMemory(newTitle, newContent, newCategory, newImportance);
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none font-mono">
      <div className="relative w-full max-w-xl h-[85vh] max-h-[680px] bg-[#020713] border border-cyan-400/40 rounded-lg shadow-[0_0_35px_rgba(0,240,255,0.3)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/25 bg-[#051329]/90 shrink-0">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold tracking-widest text-cyan-200 uppercase font-sans">
              J.A.R.V.I.S. NEURAL MEMORY REPOSITORY
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-950/60 transition-colors cursor-pointer"
            aria-label="Close Memories"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 border-b border-cyan-500/20 bg-[#030d21] space-y-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/60" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search neural directives and mission logs..."
              className="w-full bg-[#051329] border border-cyan-500/30 rounded pl-8 pr-3 py-1.5 text-xs text-cyan-100 placeholder:text-cyan-600/60 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none text-[10px]">
            <div className="flex items-center gap-1 shrink-0">
              {['ALL', 'DIRECTIVE', 'MISSION', 'TELEMETRY', 'PREFERENCE'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-cyan-950/40 text-cyan-400/70 hover:text-white border border-cyan-500/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsAdding((prev) => !prev)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-cyan-950/70 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-900/60 cursor-pointer shrink-0"
            >
              <Plus className="w-3 h-3" />
              <span>{isAdding ? 'CANCEL' : 'NEW'}</span>
            </button>
          </div>
        </div>

        {/* Create Memory Form (if active) */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-3 bg-[#051838] border-b border-cyan-500/30 space-y-2.5 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Directive or Memory Title"
                className="flex-1 bg-[#020713] border border-cyan-500/30 rounded px-2.5 py-1 text-xs text-cyan-100 placeholder:text-cyan-600/50"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="bg-[#020713] border border-cyan-500/30 rounded px-2 text-xs text-cyan-300"
              >
                <option value="DIRECTIVE">DIRECTIVE</option>
                <option value="MISSION">MISSION</option>
                <option value="TELEMETRY">TELEMETRY</option>
                <option value="PREFERENCE">PREFERENCE</option>
              </select>
            </div>
            <textarea
              required
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Memory contents and contextual data..."
              className="w-full bg-[#020713] border border-cyan-500/30 rounded p-2 text-xs text-cyan-100 placeholder:text-cyan-600/50 resize-none"
            />
            <button
              type="submit"
              className="w-full py-1.5 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs uppercase tracking-wider"
            >
              COMMIT TO PERSISTENT MEMORY
            </button>
          </form>
        )}

        {/* Memory Items List */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-cyan-400/50 text-xs">
              No neural memory records matching current query parameters.
            </div>
          ) : (
            filtered.map((mem) => (
              <div
                key={mem.id}
                className="p-3 rounded bg-[#051329]/80 border border-cyan-500/25 hover:border-cyan-400/40 transition-colors flex flex-col gap-1.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-cyan-400/70 border border-cyan-500/30 px-1 py-0.2 rounded-2xs">
                      {mem.id}
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide">
                      {mem.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-xs font-semibold ${
                        mem.importance === 'CRITICAL'
                          ? 'bg-rose-950/70 text-rose-300 border border-rose-500/30'
                          : mem.importance === 'HIGH'
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {mem.importance}
                    </span>
                    <button
                      onClick={() => deleteMemory(mem.id)}
                      className="text-cyan-500/40 hover:text-rose-400 transition-colors p-1"
                      title="Purge Memory Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-cyan-200/90 leading-relaxed font-sans">
                  {mem.content}
                </p>

                <div className="flex items-center justify-between text-[9px] text-cyan-400/50 pt-1 border-t border-cyan-500/10">
                  <span>TAG: {mem.category}</span>
                  <span>LOGGED: {mem.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-cyan-500/25 bg-[#051329]/90 shrink-0 flex items-center justify-between text-[10px] text-cyan-400/60">
          <span>ENCRYPTED LOCAL STORAGE BUFFER</span>
          <span>{memories.length} RECORDS LOGGED</span>
        </div>
      </div>
    </div>
  );
};
