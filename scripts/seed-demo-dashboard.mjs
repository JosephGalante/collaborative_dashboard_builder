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
  const lineValueId = id()
  const lineFlowsId = id()
  const areaTrendId = id()
  const barId = id()
  const donutId = id()
  const summaryId = id()
  const totalValueId = id()
  const dailyChangeId = id()
  const ytdReturnId = id()

  const create = await request('/api/dashboards', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({name: 'Recruiter Demo Dashboard'}),
  })

  const dashboardId = create?.dashboard?.id
  if (!dashboardId) {
    throw new Error('Missing dashboard id in create response')
  }

  await request(`/api/dashboards/${dashboardId}`, {
    method: 'PUT',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      name: 'Recruiter Demo Dashboard',
      widgets: [
        {
          id: lineValueId,
          type: 'line',
          title: 'Portfolio Value',
          config: {
            datasetKey: 'portfolioTimeseries',
            xField: 'date',
            yField: 'portfolioValue',
          },
        },
        {
          id: lineFlowsId,
          type: 'line',
          title: 'Net Flows',
          config: {
            datasetKey: 'portfolioTimeseries',
            xField: 'date',
            yField: 'netFlows',
          },
        },
        {
          id: areaTrendId,
          type: 'area',
          title: 'Value Trend',
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
          id: donutId,
          type: 'donut',
          title: 'Allocation Breakdown',
          config: {
            datasetKey: 'assetAllocation',
            categoryField: 'assetClass',
            valueField: 'marketValue',
          },
        },
        {
          id: summaryId,
          type: 'summary',
          title: 'Performance Summary',
          config: {
            datasetKey: 'performanceStats',
          },
        },
        {
          id: totalValueId,
          type: 'stat',
          title: 'Total Value',
          config: {
            datasetKey: 'performanceStats',
            statKey: 'totalValue',
            format: 'currency',
          },
        },
        {
          id: dailyChangeId,
          type: 'stat',
          title: 'Daily Change',
          config: {
            datasetKey: 'performanceStats',
            statKey: 'dailyChange',
            format: 'currency',
          },
        },
        {
          id: ytdReturnId,
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
        {i: lineValueId, x: 0, y: 0, w: 6, h: 7, minW: 3, minH: 5},
        {i: lineFlowsId, x: 6, y: 0, w: 6, h: 7, minW: 3, minH: 5},
        {i: areaTrendId, x: 0, y: 7, w: 6, h: 7, minW: 3, minH: 5},
        {i: barId, x: 6, y: 7, w: 6, h: 7, minW: 3, minH: 5},
        {i: donutId, x: 0, y: 14, w: 4, h: 6, minW: 3, minH: 5},
        {i: summaryId, x: 4, y: 14, w: 8, h: 6, minW: 4, minH: 5},
        {i: totalValueId, x: 0, y: 20, w: 4, h: 5, minW: 3, minH: 5},
        {i: dailyChangeId, x: 4, y: 20, w: 4, h: 5, minW: 3, minH: 5},
        {i: ytdReturnId, x: 8, y: 20, w: 4, h: 5, minW: 3, minH: 5},
      ],
      globalFilters: {
        dateRange: {from: null, to: null},
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
