export type HudStyleId = 'MARK_85' | 'VERONICA' | 'CHRONOS';

export interface HudStyleConfig {
  id: HudStyleId;
  name: string;
  codename: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  bgTint: string;
  topLabel: string;
  subLabel: string;
  telemetryLabel: string;
  architectureSpec: string;
  description: string;
}

export const HUD_STYLES: Record<HudStyleId, HudStyleConfig> = {
  MARK_85: {
    id: 'MARK_85',
    name: 'MARK-85 ARC QUANTUM',
    codename: 'NANOTECH PRIME',
    tagline: 'Classic Stark Arc Reactor & Sapphire Glass Optics',
    primaryColor: '#00f0ff',
    accentColor: '#38bdf8',
    borderColor: 'rgba(0, 240, 255, 0.45)',
    glowColor: 'rgba(0, 240, 255, 0.65)',
    bgTint: '#020713',
    topLabel: 'ARC CORE UNIT · MARK-LXXXV',
    subLabel: 'ADVANCED INTERFACE',
    telemetryLabel: 'QUANTUM FIELD STABILIZED · TACHYON FLUX 14.8 THz',
    architectureSpec: '12-BLADE TITANIUM IRIS · DUAL GLASS WINGS',
    description: 'Iconic Stark Mark-LXXXV circular arc core with dual curved glass wings, vernier degree calibrations, and sapphire lens flare.',
  },
  VERONICA: {
    id: 'VERONICA',
    name: 'VERONICA ORBITAL PROTOCOL',
    codename: 'HEAVY ARMOR SATELLITE',
    tagline: 'Octagonal Blast Shields & Solar Gold Flux Rings',
    primaryColor: '#fbbf24',
    accentColor: '#f59e0b',
    borderColor: 'rgba(251, 191, 36, 0.45)',
    glowColor: 'rgba(251, 191, 36, 0.7)',
    bgTint: '#0a0702',
    topLabel: 'ORBITAL ARMOR UNIT · VERONICA PROTOCOL',
    subLabel: 'HEAVY ASSAULT MATRIX',
    telemetryLabel: 'SOLAR FUSION YIELD 98.4% · HEAVY DISPERSION STABLE',
    architectureSpec: '8 OCTAGONAL BLAST PLATES · DUAL SOLAR GEARS',
    description: 'Veronica Hulkbuster orbital defense system featuring 8 heavy interlocking armor blast plates and dual counter-rotating solar flux rings.',
  },
  CHRONOS: {
    id: 'CHRONOS',
    name: 'CHRONOS QUANTUM NEXUS',
    codename: 'TEMPORAL TESSERACT',
    tagline: 'Tri-Radial Prism Wings & Emerald Hex Matrix',
    primaryColor: '#00ff88',
    accentColor: '#10b981',
    borderColor: 'rgba(0, 255, 136, 0.45)',
    glowColor: 'rgba(0, 255, 136, 0.7)',
    bgTint: '#021209',
    topLabel: 'QUANTUM NEXUS · CHRONOS TEMPORAL CORE',
    subLabel: 'TEMPORAL SUPERPOSITION',
    telemetryLabel: 'SUPERPOSITION MATRIX ACTIVE · COHERENCE 99.98%',
    architectureSpec: 'TRI-RADIAL PRISM WINGS · HEXAGONAL MATRIX MESH',
    description: 'Quantum temporal matrix featuring 120-degree tri-radial crystalline prism wings, nested cybernetic hex grid, and emerald singularity.',
  },
};
