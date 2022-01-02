import { InputNode, NodeId, SafeInputNode, StructureNode } from "./types";

export function buildStructure(data: InputNode): StructureNode {
  const inputTree = sanitize(data);
  return toStructureNode(inputTree).node;
}

function toStructureNode(
  inputNode: SafeInputNode,
  level: number = 1
): {
  node: StructureNode;
  disclaimed: Record<NodeId, StructureNode[]>;
} {
  const internal: StructureNode[] = [];
  const external: StructureNode[] = [];
  const children: StructureNode[] = [];
  let disclaimed: Record<NodeId, StructureNode[]> = {};

  inputNode.children.forEach((child) => {
    const { node: childNode, disclaimed: childDisclaimed } = toStructureNode(
      child,
      level + 1
    );

    children.push(childNode);

    // put child node into internal, external, or disclaimed
    if (childNode.owner === inputNode.id) {
      internal.push(childNode);
    } else if (childNode.owner === inputNode.owner) {
      external.push(childNode);
    } else {
      disclaimed[child.owner] = disclaimed[child.owner] || [];
      disclaimed[child.owner].push(childNode);
    }

    // push disclaimed nodes into external
    const e = childDisclaimed[inputNode.owner] || [];
    external.push(...e);
    delete childDisclaimed[inputNode.owner];
    disclaimed = merge(disclaimed, childDisclaimed);
  });

  return {
    node: {
      id: inputNode.id,
      name: inputNode.name,
      owner: inputNode.owner,
      internal,
      external,
      children,
      level,
    },
    disclaimed,
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

function merge(
  obj1: Record<NodeId, StructureNode[]>,
  obj2: Record<NodeId, StructureNode[]>
) {
  const result: Record<NodeId, StructureNode[]> = {};

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
