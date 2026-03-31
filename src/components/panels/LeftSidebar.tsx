const widgetButtons = [
  { label: 'Add Line Chart' },
  { label: 'Add Bar Chart' },
  { label: 'Add Stat Card' },
]

export default function LeftSidebar() {
  return (
    <aside className="border-r border-zinc-800 bg-zinc-900/50 p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Widget Library
      </h2>
      <div className="mt-4 space-y-2">
        {widgetButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-200 transition hover:border-zinc-500"
          >
            {button.label}
          </button>
        ))}
      </div>
    </aside>
  )
}
