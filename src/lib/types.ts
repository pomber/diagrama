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

export interface RenderNode {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  children: RenderNode[];
}
