import { measure } from "./layout";
import { StructureNode } from "./types";

const MIN_SCALE = 0.6;

export function pickCollapsed(structure: StructureNode, canvasWidth: number) {
  // we need to find the max collapsing level where layout.width is less than maxWidth
  const maxWidth = canvasWidth / MIN_SCALE;
  if (measure(structure, new Set()).width < maxWidth) {
    // we don't need to collapse, scale will be greater than MIN_SCALE
    return [];
  }

  const nodeIdsByLevel = getNodeIdsByLevel(structure);

  // binary search
  let min = 1;
  let max = nodeIdsByLevel.length - 1;
  while (min < max) {
    const mid = Math.floor((min + max) / 2);
    const { width } = measure(structure, new Set(nodeIdsByLevel[mid]));
    if (width < maxWidth) {
      min = mid + 1;
    } else {
      max = mid;
    }
  }

  const level = Math.max(1, max - 1);

  return nodeIdsByLevel[level];
}

function getNodeIdsByLevel(tree: StructureNode) {
  const nodeIdsByLevel: string[][] = [];

  function pushDescendants(node: StructureNode) {
    if (!node.children) {
      return;
    }
    nodeIdsByLevel[node.level] = nodeIdsByLevel[node.level] || [];
    nodeIdsByLevel[node.level].push(node.id);
    node.children.forEach(pushDescendants);
  }

  pushDescendants(tree);

  return nodeIdsByLevel;
}
