import { SafeInputNode } from "./types";

const GAP = 10;
const CONTENT_HEIGHT = 20;
type ID = string;

interface VerticalNode {
  id: ID;
  owner?: ID;
  // children owned by this node
  internal: VerticalNode[];
  // descendants with the same owner as this node
  external: VerticalNode[];
  // TODO remove (only used for debugging)
  disclaimed: any;
}

type Vertical = {
  y: number;
  height: number;
};

export function getVertical2(tree: SafeInputNode): {
  vertical: Record<string, Vertical>;
  totalHeight: number;
} {
  const { node: verticalTree } = toVerticalNode(tree);

  // console.log({ verticalTree });
  return measure(verticalTree);
}

function toVerticalNode(node: SafeInputNode): {
  node: VerticalNode;
  disclaimed: Record<ID, VerticalNode[]>;
} {
  const internal: VerticalNode[] = [];
  const external: VerticalNode[] = [];
  let disclaimed: Record<ID, VerticalNode[]> = {};

  node.children.forEach((child) => {
    const { node: childNode, disclaimed: childDisclaimed } =
      toVerticalNode(child);

    // put child node into internal, external, or disclaimed
    if (childNode.owner === node.id) {
      internal.push(childNode);
    } else if (childNode.owner === node.owner) {
      external.push(childNode);
    } else {
      disclaimed[child.owner] = disclaimed[child.owner] || [];
      disclaimed[child.owner].push(childNode);
    }

    // push disclaimed nodes into external
    const e = childDisclaimed[node.owner] || [];
    external.push(...e);
    delete childDisclaimed[node.owner];
    disclaimed = merge(disclaimed, childDisclaimed);
  });

  return {
    node: {
      id: node.id,
      owner: node.owner,
      internal,
      external,
      disclaimed,
    },
    disclaimed,
  };
}

function measure(tree: VerticalNode): {
  vertical: Record<string, Vertical>;
  totalHeight: number;
} {
  const heights: Record<
    ID,
    { internalHeight: number; externalHeight: number }
  > = {};

  function measureHeights(node: VerticalNode) {
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

  const vertical: Record<ID, Vertical> = {};

  function measureYs(node: VerticalNode, y: number) {
    vertical[node.id] = {
      y,
      height: heights[node.id].internalHeight,
    };

    node.internal.forEach((child) => {
      measureYs(child, y + GAP + CONTENT_HEIGHT);
    });

    node.external.forEach((child) => {
      measureYs(child, y + heights[node.id].internalHeight + GAP);
    });
  }

  measureHeights(tree);
  measureYs(tree, 0);
  // console.log(vertical);
  const totalHeight = heights[tree.id].externalHeight;

  return { vertical, totalHeight };
}

function merge(
  obj1: Record<ID, VerticalNode[]>,
  obj2: Record<ID, VerticalNode[]>
) {
  const result: Record<ID, VerticalNode[]> = {};

  Object.keys(obj1).forEach((key) => {
    result[key] = [...obj1[key], ...(obj2[key] || [])];
  });
  Object.keys(obj2).forEach((key) => {
    if (!result[key]) {
      result[key] = obj2[key];
    }
  });

  return result;
}
