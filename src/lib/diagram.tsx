import React, { useEffect } from "react";
import { motion, MotionConfig, useMotionValue } from "framer-motion";
import { atom, useRecoilState } from "recoil";
import { useElementSize } from "./use-element-size";
import { InputNode, Layout, LayoutNode, StructureNode } from "./types";
import { buildStructure } from "./structure";
import { measure } from "./layout";

type DiagramProps = {
  data: InputNode;
};

const selectedNodeState = atom<string | null>({
  key: "selectedNode",
  default: null,
});

export type { InputNode };

export function Diagram({ data }: DiagramProps) {
  const structure = buildStructure(data);
  return <Screen structure={structure} />;
}

function Screen({ structure }: { structure: StructureNode }) {
  const [collapsed, setCollapsed] = React.useState<string[]>([]);
  const layout = React.useMemo(() => {
    // console.log("measuring");
    return measure(structure, new Set(collapsed));
  }, [structure, collapsed]);

  const [selectedNode] = useRecoilState(selectedNodeState);

  function toggleCollapse(id: string) {
    console.log("toggling", id);
    if (collapsed.includes(id)) {
      setCollapsed(collapsed.filter((c) => c !== id));
    } else {
      setCollapsed([...collapsed, id]);
    }
  }

  const [canvasRef, { width: cw, height: ch }] = useElementSize();

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
          <DrawLayout
            layout={layout}
            canvasHeight={ch}
            canvasWidth={cw}
            onCollapse={toggleCollapse}
          />
        </div>
        <div
          style={{
            background: "#fafafa",
            width: "320px",
            padding: "2em",
            height: "100vh",
            boxShadow:
              "0px 0px 16px -1px rgba(0, 0, 0, 0.05), 0px 0px 16px -8px rgba(0, 0, 0, 0.05), 0px 0px 16px -12px rgba(0, 0, 0, 0.12), 0px 0px 2px 0px rgba(0, 0, 0, 0.08)",
          }}
        >
          <button>Center</button>
          <hr />
          <pre>
            {selectedNode &&
              JSON.stringify(layout.nodes[selectedNode], null, 2)}
          </pre>
          <button
            onClick={() => selectedNode != null && toggleCollapse(selectedNode)}
          >
            {selectedNode && collapsed.includes(selectedNode)
              ? "Unfold"
              : "Fold"}
          </button>
        </div>
      </div>
    </MotionConfig>
  );
}

function DrawLayout({
  layout,
  canvasWidth,
  canvasHeight,
  onCollapse,
}: {
  layout: Layout;
  canvasWidth: number;
  canvasHeight: number;
  onCollapse: (id: string) => void;
}) {
  const measured = canvasWidth > 20 && canvasHeight > 20;
  const s = measured
    ? Math.min(
        (canvasWidth - 20) / layout.width,
        (canvasHeight - 20) / layout.height,
        1
      )
    : 1;

  const tx = (canvasWidth - layout.width * s) / 2;
  const ty = (canvasHeight - layout.height * s) / 2;

  const [camera, setCamera] = React.useState({ x: tx, y: ty, scale: s });

  useEffect(() => {
    setCamera({ x: tx, y: ty, scale: s });
  }, [tx, ty, s]);

  const layoutElements = React.useMemo(
    () =>
      Object.values(layout.nodes).map((node) => (
        <DrawNode key={node.id} node={node} onDoubleClick={onCollapse} />
      )),
    [layout.nodes]
  );

  return (
    <motion.svg
      style={{
        position: "relative",
        touchAction: "none",
        userSelect: "none",
        width: "100%",
        height: "100%",
      }}
      onWheel={(e) => {
        // e.preventDefault();
        if (e.ctrlKey) {
          setCamera((c) => ({
            ...c,
            scale: Math.min(c.scale * (e.deltaY > 0 ? 1.1 : 0.9), 1),
          }));
          return;
        }

        const deltaX = e.shiftKey ? e.deltaY : e.deltaX;
        const deltaY = e.shiftKey ? e.deltaX : e.deltaY;

        setCamera((c) => ({
          ...c,
          x: c.x - deltaX,
          y: c.y - deltaY,
        }));
      }}
      onPan={(e, pointInfo) => {
        const deltaX = pointInfo.delta.x;
        const deltaY = pointInfo.delta.y;
        setCamera((c) => ({
          ...c,
          x: c.x + deltaX,
          y: c.y + deltaY,
        }));
      }}
    >
      <motion.g
        animate={{
          x: camera.x,
          y: camera.y,
          width: layout.width,
          height: layout.height,
        }}
      >
        <motion.g
          animate={{
            originX: 0,
            originY: 0,
            scale: camera.scale,
          }}
        >
          {layoutElements}
        </motion.g>
      </motion.g>
    </motion.svg>
  );
}

function DrawNode({
  node,
  onDoubleClick,
}: {
  node: LayoutNode;
  onDoubleClick: (nodeId: string) => void;
}) {
  if (node.hidden) {
    return null;
  }

  const truncate = 1 + node.width / 10;
  const truncatedName = node.name && node.name.slice(0, truncate);
  const firstChar = node.name ? node.name[0] : "";
  const isHostNode = firstChar === firstChar.toLocaleLowerCase();
  const [selectedNode, setSelectedNode] = useRecoilState(selectedNodeState);

  return (
    <>
      <motion.rect
        fill={selectedNode === node.id ? "#b0e7ff" : "#fff"}
        stroke={"#777"}
        animate={{
          x: node.x,
          y: node.y,
          height: node.height,
          width: node.width,
        }}
        initial={false}
        onTap={() => setSelectedNode(node.id)}
        onDoubleClick={() => onDoubleClick(node.id)}
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
        style={{ pointerEvents: "none" }}
      >
        {truncatedName}
      </motion.text>
      {node.collapsed && (
        <motion.text
          animate={{
            x: node.x + 10,
            y: node.y + 35,
          }}
          fill="#222"
          initial={false}
          style={{ fontSize: "0.8em", pointerEvents: "none" }}
        >
          [Folded]
        </motion.text>
      )}
    </>
  );
}
