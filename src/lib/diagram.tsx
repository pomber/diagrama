import React from "react";
import { InputNode, RenderNode, buildTree } from "./tree";
import { motion, MotionConfig, useMotionValue } from "framer-motion";

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
  const x = useMotionValue(10);
  const y = useMotionValue(10);

  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: 176,
        damping: 14,
        mass: 0.2,
      }}
    >
      <motion.svg
        style={{
          fontFamily: "monospace",
          height: "100vh",
          width: "100vw",
          position: "relative",
          touchAction: "none",
          userSelect: "none",
        }}
        onWheel={(e) => {
          const deltaX = e.shiftKey ? e.deltaY : e.deltaX;
          const deltaY = e.shiftKey ? e.deltaX : e.deltaY;
          x.set(x.get() - deltaX);
          y.set(y.get() - deltaY);
        }}
        onPan={(e, pointInfo) => {
          x.set(x.get() + pointInfo.delta.x);
          y.set(y.get() + pointInfo.delta.y);
        }}
      >
        <motion.svg
          x={x}
          y={y}
          style={{ position: "relative" }}
          animate={{ width, height }}
        >
          <Tree node={tree} onCollapse={collapse} />
        </motion.svg>
      </motion.svg>
      <div
        style={{
          background: "#fafafa",
          position: "fixed",
          width: "400px",
          right: 0,
          top: 0,
          height: "100vh",
          boxShadow:
            "0px 0px 16px -1px rgba(0, 0, 0, 0.05), 0px 0px 16px -8px rgba(0, 0, 0, 0.05), 0px 0px 16px -12px rgba(0, 0, 0, 0.12), 0px 0px 2px 0px rgba(0, 0, 0, 0.08)",
        }}
      ></div>
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

  return (
    <>
      <motion.rect
        fill={"#fff"}
        stroke={"#777"}
        animate={{
          x: node.x,
          y: node.y,
          height: node.height,
          width: node.width,
        }}
        initial={false}
        onClick={() => onCollapse(node.id)}
        whileHover={{
          // fill: "#aaa8",
          stroke: "blue",
        }}
        rx="2"
      />

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
