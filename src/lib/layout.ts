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

    const isCollapsed = collapsed.has(node.id);
    const innerHeight = isCollapsed ? 14 : maxInternalChildHeight;
    const internalHeight = innerHeight + CONTENT_HEIGHT + GAP;

    const maxExternalChildHeight = Math.max(
      0,
      ...node.external.map((child) => heights[child.id].externalHeight)
    );

    const outerHeight = isCollapsed ? 0 : maxExternalChildHeight;

    const externalHeight = internalHeight + outerHeight + GAP;
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

    const isCollapsed = collapsed.has(node.id);
    const innerWidth = isCollapsed ? 0 : childrenWidth;
    horizontal[node.id] = { x, width: Math.max(innerWidth, CONTENT_WIDTH) };
  }

  measureHeights(tree);
  measureVertical(tree, 0);
  measureHorizontal(tree, 0);

  const layoutNodes: Layout["nodes"] = {};
  function saveLayoutNode(node: StructureNode, hidden: boolean) {
    node.children.forEach((child) => {
      saveLayoutNode(child, collapsed.has(node.id) || hidden);
    });
    // node.external.forEach((child) => {
    //   saveLayoutNode(child,  hidden);
    // });

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
      hidden,
    };
  }
  saveLayoutNode(tree, false);

  return {
    nodes: layoutNodes,
    height: heights[tree.id].externalHeight,
    width: horizontal[tree.id].width,
  };
}
