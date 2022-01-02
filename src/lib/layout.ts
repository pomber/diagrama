import { Layout, NodeId, StructureNode } from "./types";
const GAP = 10;
const CONTENT_HEIGHT = 20;
const CONTENT_WIDTH = 100;

type Vertical = {
  y: number;
  height: number;
};

export function measure(tree: StructureNode, collapsed: Set<NodeId>): Layout {
  const heights: Record<
    NodeId,
    { internalHeight: number; externalHeight: number }
  > = {};
  function measureHeights(node: StructureNode) {
    node.internal.forEach(measureHeights);
    node.external.forEach(measureHeights);

    const maxInternalChildHeight = Math.max(
      0,
      ...node.internal.map((child) => heights[child.id].externalHeight)
    );

    const internalHeight = maxInternalChildHeight + CONTENT_HEIGHT + GAP;

    const maxExternalChildHeight = Math.max(
      0,
      ...node.external.map((child) => heights[child.id].externalHeight)
    );

    const externalHeight = internalHeight + maxExternalChildHeight + GAP;
    heights[node.id] = {
      internalHeight,
      externalHeight,
    };
  }

  const vertical: Record<NodeId, Vertical> = {};
  function measureVertical(node: StructureNode, y: number) {
    vertical[node.id] = {
      y,
      height: heights[node.id].internalHeight,
    };

    node.internal.forEach((child) => {
      measureVertical(child, y + GAP + CONTENT_HEIGHT);
    });

    node.external.forEach((child) => {
      measureVertical(child, y + heights[node.id].internalHeight + GAP);
    });
  }

  const horizontal: Record<string, { x: number; width: number }> = {};
  function measureHorizontal(node: StructureNode, x: number) {
    const anyOwnedChildren = node.children.some(
      (child) => !child.owner || child.owner === node.id
    );
    let cx = anyOwnedChildren ? x + GAP : x;
    node.children.forEach((child) => {
      measureHorizontal(child, cx);
      cx += horizontal[child.id].width + GAP;
    });

    const childrenWidth = node.children.reduce(
      (width, child) => width + horizontal[child.id].width,
      anyOwnedChildren
        ? (node.children.length + 1) * GAP
        : (node.children.length - 1) * GAP
    );
    horizontal[node.id] = { x, width: Math.max(childrenWidth, CONTENT_WIDTH) };
  }

  measureHeights(tree);
  measureVertical(tree, 0);
  measureHorizontal(tree, 0);

  const layoutNodes: Layout["nodes"] = {};
  function saveLayoutNode(node: StructureNode) {
    node.children.forEach((child) => {
      saveLayoutNode(child);
    });
    const { x, width } = horizontal[node.id];
    const { y, height } = vertical[node.id];
    layoutNodes[node.id] = {
      id: node.id,
      name: node.name,
      x,
      y,
      width,
      height,
      collapsed: collapsed.has(node.id),
    };
  }
  saveLayoutNode(tree);

  return {
    nodes: layoutNodes,
    height: heights[tree.id].externalHeight,
    width: horizontal[tree.id].width,
  };
}
