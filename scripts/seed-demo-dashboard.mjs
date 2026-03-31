const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3333'

function id() {
  return crypto.randomUUID()
}

async function request(path, init) {
  const res = await fetch(`${API_BASE}${path}`, init)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${text}`)
  }
  return res.json()
}

async function main() {
  const lineId = id()
  const barId = id()
  const statId = id()

  const create = await request('/api/dashboards', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'Recruiter Demo Dashboard' }),
  })

  const dashboardId = create?.dashboard?.id
  if (!dashboardId) {
    throw new Error('Missing dashboard id in create response')
  }

  await request(`/api/dashboards/${dashboardId}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: 'Recruiter Demo Dashboard',
      widgets: [
        {
          id: lineId,
          type: 'line',
          title: 'Portfolio Value Trend',
          config: {
            datasetKey: 'portfolioTimeseries',
            xField: 'date',
            yField: 'portfolioValue',
          },
        },
        {
          id: barId,
          type: 'bar',
          title: 'Asset Allocation',
          config: {
            datasetKey: 'assetAllocation',
            categoryField: 'assetClass',
            valueField: 'marketValue',
          },
        },
        {
          id: statId,
          type: 'stat',
          title: 'YTD Return',
          config: {
            datasetKey: 'performanceStats',
            statKey: 'ytdReturnPct',
            format: 'percent',
          },
        },
      ],
      layouts: [
        { i: lineId, x: 0, y: 0, w: 8, h: 6, minW: 3, minH: 3 },
        { i: barId, x: 8, y: 0, w: 4, h: 6, minW: 3, minH: 3 },
        { i: statId, x: 0, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
      ],
      globalFilters: {
        dateRange: { from: null, to: null },
        assetClasses: [],
      },
    }),
  })

  console.log(`Created demo dashboard: http://localhost:5173/dashboards/${dashboardId}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
