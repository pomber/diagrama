import React from "react";
import { Diagram, InputNode } from "./lib/diagram";
import { disney as input } from "./data";
import LZString from "lz-string";
import { RecoilRoot } from "recoil";

function App() {
  const [value, setValue] = React.useState(JSON.stringify(input, null, 2));
  const [_, setData] = React.useState<string | null>(null);

  const hash = document.location.hash.slice(1);
  const data = hash ? decode(hash) : null;
  return (
    <main>
      {data ? (
        <RecoilRoot>
          <Diagram data={data} />
        </RecoilRoot>
      ) : (
        <div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ display: "block", width: 400, height: 400 }}
          />
          <button
            onClick={() => {
              window.location.hash = "#" + encode(value);
              setData(value);
            }}
          >
            Render
          </button>
        </div>
      )}
    </main>
  );
}

function encode(data: string) {
  return LZString.compressToEncodedURIComponent(data);
}

function decode(hash: string) {
  return JSON.parse(LZString.decompressFromEncodedURIComponent(hash)!);
}

export default App;
