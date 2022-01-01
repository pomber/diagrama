import { getVertical, getRows } from "./rows";
import { InputNode, RenderNode, SafeInputNode } from "./types";
import { getVertical2 } from "./vertical";

export type { InputNode, RenderNode };

export function buildTree(
  data: InputNode,
  collapsed: string[]
): {
  tree: RenderNode;
  height: number;
  width: number;
} {
  const safeInput = collapseTree(sanitize(data), collapsed);

  const { totalHeight, vertical } = getVertical2(safeInput);

  // const rows = getRows(safeInput);
  // const { totalHeight, vertical } = getVertical(rows);

  const horizontal = getHorizontal(safeInput);

  return {
    tree: layout(safeInput, vertical, horizontal),
    height: totalHeight,
    width: horizontal[safeInput.id].width,
  };
}

function collapseTree(tree: SafeInputNode, collapsed: string[]): SafeInputNode {
  return {
    ...tree,
    children: tree.children
      .filter((child) => !collapsed.includes(child.id))
      .map((child) => collapseTree(child, collapsed)),
  };
}

function getHorizontal(
  tree: SafeInputNode
): Record<string, { x: number; width: number }> {
  const horizontal: Record<string, { x: number; width: number }> = {};
  getHorizontalNode(tree, horizontal, 0);
  return horizontal;
}

const GAP = 10;
const CONTENT_WIDTH = 100;

function getHorizontalNode(
  node: SafeInputNode,
  horizontal: Record<string, { x: number; width: number }>,
  x: number
): void {
  const anyOwnedChildren = node.children.some(
    (child) => !child.owner || child.owner === node.id
  );

  let cx = anyOwnedChildren ? x + GAP : x;
  node.children.forEach((child) => {
    getHorizontalNode(child, horizontal, cx);
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

function layout(
  tree: SafeInputNode,
  vertical: Record<string, { y: number; height: number }>,
  horizontal: Record<string, { x: number; width: number }>
): RenderNode {
  const { y, height } = vertical[tree.id];
  const { x, width } = horizontal[tree.id];
  const children = tree.children.map((child) =>
    layout(child, vertical, horizontal)
  );
  return {
    id: tree.id,
    name: tree.name,
    x,
    y,
    width,
    height,
    children,
  };
}

function sanitize(tree: InputNode): SafeInputNode {
  let idCounter = 0;
  const ROOT_ID = "rsroot";
  const knownIDs = new Set<string>();

  function sanitizeNode(node: InputNode, parentId: string): SafeInputNode {
    const id = node.id || "rs-" + node.name + idCounter++;
    const owner = node.owner
      ? knownIDs.has(node.owner)
        ? node.owner
        : ROOT_ID
      : parentId;
    knownIDs.add(id);
    return {
      ...node,
      id,
      owner,
      children: (node.children || []).map((child) => sanitizeNode(child, id)),
    };
  }
  return sanitizeNode(tree, ROOT_ID);
}
