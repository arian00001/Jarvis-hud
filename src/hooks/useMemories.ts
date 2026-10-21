import { useState, useEffect } from 'react';

export interface JarvisMemory {
  id: string;
  category: 'DIRECTIVE' | 'MISSION' | 'TELEMETRY' | 'PREFERENCE';
  title: string;
  content: string;
  timestamp: string;
  importance: 'HIGH' | 'NOMINAL' | 'CRITICAL';
}

const DEFAULT_MEMORIES: JarvisMemory[] = [
  {
    id: 'MEM-001',
    category: 'DIRECTIVE',
    title: 'PRIME PROTOCOL MARK-LXXXV',
    content: 'Prioritize structural integrity of HUD subsystems and maintain continuous quantum neural link.',
    timestamp: '2026-10-21 04:12',
    importance: 'CRITICAL',
  },
  {
    id: 'MEM-002',
    category: 'MISSION',
    title: 'TACTICAL ORBITAL SCAN',
    content: 'Completed high-frequency atmospheric sweep of Sector 7. No anomalous interference detected.',
    timestamp: '2026-10-20 18:45',
    importance: 'HIGH',
  },
  {
    id: 'MEM-003',
    category: 'TELEMETRY',
    title: 'ARC REACTOR CORE EQUILIBRIUM',
    content: 'Optimal harmonic resonance stabilized at 432.8 Hz with 98.4% flux efficiency.',
    timestamp: '2026-10-20 12:30',
    importance: 'NOMINAL',
  },
  {
    id: 'MEM-004',
    category: 'PREFERENCE',
    title: 'USER VOCAL MODULATION',
    content: 'Synthesizer voice output set to natural cadence with concise tactical telemetry reports.',
    timestamp: '2026-10-19 09:15',
    importance: 'NOMINAL',
  },
];

export function useMemories() {
  const [memories, setMemories] = useState<JarvisMemory[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_MEMORIES;
    try {
      const saved = localStorage.getItem('jarvis_memories');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MEMORIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('jarvis_memories', JSON.stringify(memories));
    } catch {}
  }, [memories]);

  const addMemory = (
    title: string,
    content: string,
    category: JarvisMemory['category'] = 'DIRECTIVE',
    importance: JarvisMemory['importance'] = 'NOMINAL'
  ) => {
    const newMem: JarvisMemory = {
      id: `MEM-${Math.floor(100 + Math.random() * 900)}`,
      category,
      title: title.trim().toUpperCase(),
      content: content.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      importance,
    };
    setMemories((prev) => [newMem, ...prev]);
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const clearAllMemories = () => {
    setMemories([]);
  };

  return { memories, addMemory, deleteMemory, clearAllMemories };
}
