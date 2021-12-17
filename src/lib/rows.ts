import { SafeInputNode } from "./types";

const GAP = 10;
const CONTENT_HEIGHT = 20;

interface RowNode {
  id: string;
  rows: RowNode[][];
}

interface External {
  id: string;
  owner: string;
  level: number;
  node: RowNode;
}

export function getRows(tree: SafeInputNode): RowNode[][] {
  const result = getRowNode(tree, 0);
  return [[result.node], ...externalsToRows(result.externals)];
}

function getRowNode(
  node: SafeInputNode,
  level: number
): {
  node: RowNode;
  externals: External[];
} {
  const firstRow: RowNode[] = [];
  const nodeExternals: External[] = [];
  const childrenExternals: External[] = [];

  node.children.forEach((child) => {
    const result = getRowNode(child, level + 1);
    if (child.owner && child.owner !== node.id) {
      nodeExternals.push({
        id: child.id,
        owner: child.owner,
        level: level + 1,
        node: result.node,
      });
    } else {
      firstRow.push(result.node);
    }
    childrenExternals.push(...result.externals);
  });

  nodeExternals.push(
    ...childrenExternals.filter((external) => external.owner !== node.id)
  );

  const grandchildren = childrenExternals.filter(
    (external) => external.owner === node.id
  );
  const externalRows = externalsToRows(grandchildren);
  const rows = firstRow.length ? [firstRow, ...externalRows] : externalRows;

  return {
    node: { id: node.id, rows },
    externals: nodeExternals,
  };
}

function externalsToRows(externals: External[]): RowNode[][] {
  const externalsByLevel = {} as { [key: number]: External[] };
  externals.forEach((external) => {
    externalsByLevel[external.level] = externalsByLevel[external.level] || [];
    externalsByLevel[external.level].push(external);
  });

  const levels = Object.keys(externalsByLevel).map((key) => parseInt(key, 10));
  levels.sort((a, b) => a - b);
  return levels.map((level) => {
    return externalsByLevel[level].map((external) => external.node);
  });
}

export function getVertical(rows: RowNode[][]): {
  vertical: Record<string, { y: number; height: number }>;
  totalHeight: number;
} {
  const vertical: Record<string, { y: number; height: number }> = {};

  function getNodeVertical(node: RowNode, y: number): number {
    let sum = CONTENT_HEIGHT + 2 * GAP;
    node.rows.forEach((row) => {
      let cy = y + sum;
      sum += getRowVertical(row, cy) + GAP;
    });

    vertical[node.id] = { height: sum, y };
    return sum;
  }

  function getRowVertical(row: RowNode[], y: number): number {
    return Math.max(...row.map((r) => getNodeVertical(r, y)));
  }

  let sum = GAP;
  rows.forEach((row) => {
    let y = sum;
    sum += getRowVertical(row, y) + GAP;
  });

  return { vertical, totalHeight: sum };
}
