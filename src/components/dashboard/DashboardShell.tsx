import DashboardCanvas from './DashboardCanvas'
import LeftSidebar from '@/components/panels/LeftSidebar'
import RightConfigPanel from '@/components/panels/RightConfigPanel'

export default function DashboardShell() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="flex h-14 items-center justify-between border-b border-zinc-800 px-4">
        <div className="font-medium">Collaborative Dashboard Builder</div>
        <div className="text-sm text-zinc-400">Saved just now</div>
      </header>

      <main className="grid h-[calc(100vh-56px)] grid-cols-[240px_1fr_320px]">
        <LeftSidebar />
        <DashboardCanvas />
        <RightConfigPanel />
      </main>
    </div>
  )
}
