export interface InputNode {
  name: string;
  id?: string;
  owner?: string;
  children?: InputNode[];
}

export interface SafeInputNode extends InputNode {
  id: string;
  owner: string;
  children: SafeInputNode[];
}

export type NodeId = string;

// this is the parsed input element tree
// in a useful format, without any state
export interface StructureNode {
  id: NodeId;
  name: string;
  owner: NodeId;
  level: number;
  children: StructureNode[];
  // children owned by this node
  internal: StructureNode[];
  // descendant trees with the same owner as this node
  external: StructureNode[];
}

// this is the result of mixing the structure tree
// with the state
export interface LayoutNode {
  id: NodeId;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  collapsed: boolean;
}

export interface Layout {
  height: number;
  width: number;
  nodes: Record<NodeId, LayoutNode>;
}
