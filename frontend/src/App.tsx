import { useState } from 'react'
import ImportBtn from './components/ImportBtn.tsx'
import CompressBtn from './components/CompressBtn.tsx'
import DownloadBtn from './components/DownloadBtn.tsx'
import MergeBtn from './components/MergeBtn.tsx'
import Navbar, { type Tool } from './components/Navbar.tsx'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [activeTool, setActiveTool] = useState<Tool>('compress')

  return (
    <main>
      <Navbar activeTool={activeTool} onToolChange={setActiveTool} />
      {activeTool === 'compress' && (
        <>
          <ImportBtn selectedFile={selectedFile} onFileSelected={setSelectedFile} />
          <CompressBtn file={selectedFile} />
        </>
      )}
      {activeTool === 'download' && <DownloadBtn />}
      {activeTool === 'merge' && <MergeBtn />}
    </main>
  )
}

export default App
