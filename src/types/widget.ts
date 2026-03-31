export type DashboardId = string
export type WidgetId = string
export type UserId = string

export type WidgetType = 'line' | 'bar' | 'stat'

export type WidgetLayout = {
  i: WidgetId
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

export type DateRangeFilter = {
  from: string | null
  to: string | null
}

export type AssetClass =
  | 'equities'
  | 'fixed_income'
  | 'cash'
  | 'alternatives'

export type GlobalFilters = {
  dateRange: DateRangeFilter
  assetClasses: AssetClass[]
}

export type PortfolioTimeseriesPoint = {
  date: string
  portfolioValue: number
  netFlows: number
}

export type AssetAllocationPoint = {
  assetClass: AssetClass
  marketValue: number
}

export type PerformanceStatBlock = {
  totalValue: number
  dailyChange: number
  ytdReturnPct: number
}

export type SeedDataset = {
  portfolioTimeseries: PortfolioTimeseriesPoint[]
  assetAllocation: AssetAllocationPoint[]
  performanceStats: PerformanceStatBlock
}

export type BaseWidget = {
  id: WidgetId
  title: string
  type: WidgetType
}

export type LineWidgetConfig = {
  datasetKey: 'portfolioTimeseries'
  xField: 'date'
  yField: 'portfolioValue' | 'netFlows'
}

export type BarWidgetConfig = {
  datasetKey: 'assetAllocation'
  categoryField: 'assetClass'
  valueField: 'marketValue'
}

export type StatWidgetConfig = {
  datasetKey: 'performanceStats'
  statKey: 'totalValue' | 'dailyChange' | 'ytdReturnPct'
  format: 'currency' | 'percent' | 'number'
}

export type LineWidget = BaseWidget & {
  type: 'line'
  config: LineWidgetConfig
}

export type BarWidget = BaseWidget & {
  type: 'bar'
  config: BarWidgetConfig
}

export type StatWidget = BaseWidget & {
  type: 'stat'
  config: StatWidgetConfig
}

export type Widget = LineWidget | BarWidget | StatWidget
