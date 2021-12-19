import React from "react";
import { InputNode, RenderNode, buildTree } from "./tree";

type DiagramProps = {
  data: InputNode;
};

export type { InputNode };

export function Diagram({ data }: DiagramProps) {
  const { tree, height, width } = React.useMemo(() => buildTree(data), [data]);
  return (
    <svg
      style={{
        fontFamily: "monospace",
        fill: "none",
        height,
        width,
      }}
      stroke="black"
    >
      <Tree node={tree} />
    </svg>
  );
}

function Tree({ node }: { node: RenderNode }) {
  const truncate = 1 + node.width / 10;
  const truncatedName = node.name && node.name.slice(0, truncate);
  const firstChar = node.name ? node.name[0] : "";
  const isHostNode = firstChar === firstChar.toLocaleLowerCase();
  return (
    <g style={{ color: isHostNode ? "#228" : "#000" }}>
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        stroke="currentColor"
      />
      <text x={node.x + 10} y={node.y + 20} stroke="currentColor">
        <title>{node.name}</title>
        {truncatedName}
      </text>
      {node.children.map((child) => (
        <Tree key={child.id} node={child} />
      ))}
    </g>
  );
}
