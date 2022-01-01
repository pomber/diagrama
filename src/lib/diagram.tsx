import React, { useEffect } from "react";
import { InputNode, RenderNode, buildTree } from "./tree";
import { motion, MotionConfig, useMotionValue } from "framer-motion";
import { atom, RecoilRoot, useRecoilState } from "recoil";
import { useElementSize } from "./use-element-size";

type DiagramProps = {
  data: InputNode;
};

const selectedNodeState = atom<string | null>({
  key: "selectedNode",
  default: null,
});

export type { InputNode };

export function Diagram({ data }: DiagramProps) {
  const [collapsed, setCollapsed] = React.useState<string[]>([]);
  const { tree, height, width } = React.useMemo(() => {
    return buildTree(data, collapsed);
  }, [data, collapsed]);
  const [selectedNode] = useRecoilState(selectedNodeState);

  function collapse(id: string) {
    console.log("collapse", id);
    setCollapsed((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  const [canvasRef, { width: cw, height: ch }] = useElementSize();
  // console.log({ cw, ch });

  const measured = cw > 20 && ch > 20;
  const s = measured ? Math.min((cw - 20) / width, (ch - 20) / height, 1) : 1;

  const tx = (cw - width * s) / 2;
  const ty = (ch - height * s) / 2;

  const x = useMotionValue(tx);
  const y = useMotionValue(ty);
  const scale = useMotionValue(s);

  useEffect(() => {
    x.set(tx);
    y.set(ty);
    scale.set(s);
  }, [tx, ty, s]);

  // console.log({ tx, scale, width, cw });

  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: 176,
        damping: 14,
        mass: 0.2,
      }}
    >
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
        }}
      >
        <div
          style={{
            fontFamily: "monospace",
            flex: 1,
            minWidth: 0,
          }}
          ref={canvasRef as any}
        >
          <motion.svg
            style={{
              position: "relative",
              touchAction: "none",
              userSelect: "none",
              width: "100%",
              height: "100%",
            }}
            onWheel={(e) => {
              e.preventDefault();
              if (e.ctrlKey) {
                scale.set(
                  Math.min(scale.get() * (e.deltaY > 0 ? 1.1 : 0.9), 1)
                );
                return;
              }

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
              animate={{
                width,
                height,
              }}
            >
              <motion.g
                scale={scale}
                animate={{
                  originX: 0,
                  originY: 0,
                }}
              >
                <Tree node={tree} onCollapse={collapse} />
              </motion.g>
            </motion.svg>
          </motion.svg>
        </div>
        <div
          style={{
            background: "#fafafa",
            width: "400px",
            padding: "2em",
            height: "100vh",
            boxShadow:
              "0px 0px 16px -1px rgba(0, 0, 0, 0.05), 0px 0px 16px -8px rgba(0, 0, 0, 0.05), 0px 0px 16px -12px rgba(0, 0, 0, 0.12), 0px 0px 2px 0px rgba(0, 0, 0, 0.08)",
          }}
        >
          <button>Center</button>
          <hr />
          {selectedNode}
          <button
            onClick={() => selectedNode != null && collapse(selectedNode)}
          >
            Collapse
          </button>
        </div>
      </div>
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
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState);

  return (
    <>
      <motion.rect
        fill={selectedNode === node.id ? "#eee" : "#fff"}
        stroke={"#777"}
        animate={{
          x: node.x,
          y: node.y,
          height: node.height,
          width: node.width,
        }}
        initial={false}
        onTap={() => setSelectedNode(node.id)}
        // whileHover={{
        //   // fill: "#aaa8",
        //   stroke: "blue",
        // }}
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
