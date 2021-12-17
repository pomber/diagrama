import React from "react";
import { Diagram, InputNode } from "./lib/diagram";
import { innerSlider as input } from "./data";

function App() {
  const [value, setValue] = React.useState(JSON.stringify(input, null, 2));
  const [data, setData] = React.useState<InputNode | null>(null);
  return (
    <main>
      {data ? (
        <Diagram data={data} />
      ) : (
        <div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ display: "block", width: 400, height: 400 }}
          />
          <button onClick={() => setData(JSON.parse(value))}>Render</button>
        </div>
      )}
    </main>
  );
}

export default App;
