export type Tool = "compress" | "download" | "merge";

type NavbarProps = {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
};

function Navbar({ activeTool, onToolChange }: NavbarProps) {
  const tools: Array<{ id: Tool; label: string }> = [
    { id: "compress", label: "Compress video" },
    { id: "download", label: "Download from URL" },
    { id: "merge", label: "Merge PDFs" },
  ];

  return (
    <nav aria-label="Tools" className="navbar navbar-expand">
      <div className="navbar-nav">
        {tools.map((tool) => (
          <button
            key={tool.id}
            type="button"
            className={`nav-link ${activeTool === tool.id ? "active" : ""}`}
            onClick={() => onToolChange(tool.id)}
            aria-current={activeTool === tool.id ? "page" : undefined}
          >
            {tool.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
