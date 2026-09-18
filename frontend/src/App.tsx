import { useState } from 'react'
import Compress from './components/Compress.tsx'
import Download from './components/Download.tsx'
import Merge from './components/Merge.tsx'
import Navbar, { type Tool } from './components/Navbar.tsx'

function App() {
  const [activeTool, setActiveTool] = useState<Tool>('compress')

  return (
    <main>
      <Navbar activeTool={activeTool} onToolChange={setActiveTool} />
      {activeTool === 'compress' && <Compress />}
      {activeTool === 'download' && <Download />}
      {activeTool === 'merge' && <Merge />}
    </main>
  )
}

export default App
