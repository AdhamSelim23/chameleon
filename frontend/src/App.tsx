import { useState } from "react";
import Compress from "./components/Compress.tsx";
import Download from "./components/Download.tsx";
import Merge from "./components/Merge.tsx";
import Navbar, { type Tool } from "./components/Navbar.tsx";

function App() {
  const [activeTool, setActiveTool] = useState<Tool>("compress");

  return (
    <div className="app-frame">
      <div className="page-frame">
        <header className="top-bar">
          <div className="brand-title">
            <div>
              <h1>Chameleon</h1>
            </div>
          </div>
        </header>

        <main className="app-body">
          <Navbar activeTool={activeTool} onToolChange={setActiveTool} />
          <section className="tool-panel">
            {activeTool === "compress" && <Compress />}
            {activeTool === "download" && <Download />}
            {activeTool === "merge" && <Merge />}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
