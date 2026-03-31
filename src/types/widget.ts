export type DashboardId = string
export type WidgetId = string
export type UserId = string

export type WidgetType =
  | 'line'
  | 'area'
  | 'bar'
  | 'donut'
  | 'stat'
  | 'summary'
  | 'allocationList'
  | 'timeline'
  | 'insight'
  | 'metricPair'
  | 'allocationSpotlight'
  | 'healthBanner'

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

export type AssetClass = 'equities' | 'fixed_income' | 'cash' | 'alternatives'

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

export type AreaWidgetConfig = {
  datasetKey: 'portfolioTimeseries'
  xField: 'date'
  yField: 'portfolioValue' | 'netFlows'
}

export type BarWidgetConfig = {
  datasetKey: 'assetAllocation'
  categoryField: 'assetClass'
  valueField: 'marketValue'
}

export type DonutWidgetConfig = {
  datasetKey: 'assetAllocation'
  categoryField: 'assetClass'
  valueField: 'marketValue'
}

export type StatWidgetConfig = {
  datasetKey: 'performanceStats'
  statKey: 'totalValue' | 'dailyChange' | 'ytdReturnPct'
  format: 'currency' | 'percent' | 'number'
}

export type SummaryWidgetConfig = {
  datasetKey: 'performanceStats'
}

export type AllocationListWidgetConfig = {
  datasetKey: 'assetAllocation'
}

export type TimelineWidgetConfig = {
  datasetKey: 'portfolioTimeseries'
}

export type InsightWidgetConfig = {
  datasetKey: 'performanceStats'
}

export type MetricPairWidgetConfig = {
  datasetKey: 'performanceStats'
}

export type AllocationSpotlightWidgetConfig = {
  datasetKey: 'assetAllocation'
}

export type HealthBannerWidgetConfig = {
  datasetKey: 'performanceStats'
}

export type LineWidget = BaseWidget & {
  type: 'line'
  config: LineWidgetConfig
}

export type AreaWidget = BaseWidget & {
  type: 'area'
  config: AreaWidgetConfig
}

export type BarWidget = BaseWidget & {
  type: 'bar'
  config: BarWidgetConfig
}

export type DonutWidget = BaseWidget & {
  type: 'donut'
  config: DonutWidgetConfig
}

export type StatWidget = BaseWidget & {
  type: 'stat'
  config: StatWidgetConfig
}

export type SummaryWidget = BaseWidget & {
  type: 'summary'
  config: SummaryWidgetConfig
}

export type AllocationListWidget = BaseWidget & {
  type: 'allocationList'
  config: AllocationListWidgetConfig
}

export type TimelineWidget = BaseWidget & {
  type: 'timeline'
  config: TimelineWidgetConfig
}

export type InsightWidget = BaseWidget & {
  type: 'insight'
  config: InsightWidgetConfig
}

export type MetricPairWidget = BaseWidget & {
  type: 'metricPair'
  config: MetricPairWidgetConfig
}

export type AllocationSpotlightWidget = BaseWidget & {
  type: 'allocationSpotlight'
  config: AllocationSpotlightWidgetConfig
}

export type HealthBannerWidget = BaseWidget & {
  type: 'healthBanner'
  config: HealthBannerWidgetConfig
}

export type Widget =
  | LineWidget
  | AreaWidget
  | BarWidget
  | DonutWidget
  | StatWidget
  | SummaryWidget
  | AllocationListWidget
  | TimelineWidget
  | InsightWidget
  | MetricPairWidget
  | AllocationSpotlightWidget
  | HealthBannerWidget
