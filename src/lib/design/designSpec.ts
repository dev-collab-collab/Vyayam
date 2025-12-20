// src/lib/design/designSpec.ts

export type ColorRef = string; // e.g. "colors.bg" or raw "#FFFFFF"

export type NodeBase = {
  id: string;
  type: string;
  name?: string;
  size?: { w: number; h: number };
  fill?: { type: "SOLID"; colorRef?: string; color?: string } | null;
  stroke?: any;
  radius?: { all: number } | null;
  shadow?: any;
  style?: any;
  text?: string;
  layout?: any;
  constraints?: any;
  notes?: string;
  children?: DesignNode[];
};

export type DesignNode = NodeBase;

export type DesignSpec = {
  meta: {
    name: string;
    frame: { width: number; height: number };
    platform?: string;
    notes?: string;
  };
  styles: {
    colors: Record<string, string>;
    typography: Record<string, any>;
    radii: Record<string, number>;
    shadows: Record<string, any>;
    strokes: Record<string, any>;
  };
  nodes: DesignNode[];
};

