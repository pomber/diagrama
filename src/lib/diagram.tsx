import React from "react";
import { InputNode, RenderNode, buildTree } from "./tree";
import { motion, MotionConfig } from "framer-motion";

type DiagramProps = {
  data: InputNode;
};

export type { InputNode };

export function Diagram({ data }: DiagramProps) {
  const [collapsed, setCollapsed] = React.useState<string[]>([]);
  const { tree, height, width } = React.useMemo(() => {
    return buildTree(data, collapsed);
  }, [data, collapsed]);

  function collapse(id: string) {
    console.log("collapse", id);
    setCollapsed((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: 176,
        damping: 14,
        mass: 0.2,
      }}
    >
      <svg
        style={{
          fontFamily: "monospace",
          height: "100vh",
          width: "100vw",
          position: "relative",
        }}
      >
        <Tree node={tree} onCollapse={collapse} />
      </svg>
    </MotionConfig>
  );
}

function Tree({
  node,
  onCollapse,
}: {
  node: RenderNode;
  onCollapse: (id: string) => void;
}) {
  const truncate = 1 + node.width / 10;
  const truncatedName = node.name && node.name.slice(0, truncate);
  const firstChar = node.name ? node.name[0] : "";
  const isHostNode = firstChar === firstChar.toLocaleLowerCase();

  const [hover, setHover] = React.useState(false);

  return (
    <>
      <motion.rect
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          // position: "absolute",
          color: isHostNode ? "#228" : "#000",
          // outline: "1px solid currentColor",
          borderRadius: "2px",
        }}
        fill={"transparent"}
        stroke={isHostNode ? "#228" : "#000"}
        animate={{
          x: node.x,
          y: node.y,
          height: node.height,
          width: node.width,
          // backgroundColor: hover ? "#222" : "#fafafa",
          color: hover ? "#fafafa" : "#228",
        }}
        initial={false}
        onClick={() => onCollapse(node.id)}
      ></motion.rect>

      <motion.text
        animate={{
          x: node.x + 10,
          y: node.y + 20,
        }}
        fill="#222"
        initial={false}
      >
        {truncatedName}
      </motion.text>
      {node.children.map((child) => (
        <Tree key={child.id} node={child} onCollapse={onCollapse} />
      ))}
    </>
  );
}
