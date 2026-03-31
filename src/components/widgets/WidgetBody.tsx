import type {SeedDataset, Widget} from '@/types/widget'
import LineChartWidget from './LineChartWidget'
import AreaChartWidget from './AreaChartWidget'
import BarChartWidget from './BarChartWidget'
import DonutChartWidget from './DonutChartWidget'
import StatCardWidget from './StatCardWidget'
import SummaryWidget from './SummaryWidget'
import AllocationListWidget from './AllocationListWidget'
import TimelineWidget from './TimelineWidget'
import InsightWidget from './InsightWidget'
import MetricPairWidget from './MetricPairWidget'
import AllocationSpotlightWidget from './AllocationSpotlightWidget'
import HealthBannerWidget from './HealthBannerWidget'

type WidgetBodyProps = {
  widget: Widget
  dataset: SeedDataset
}

export default function WidgetBody({widget, dataset}: WidgetBodyProps) {
  switch (widget.type) {
    case 'line':
      return <LineChartWidget widget={widget} dataset={dataset} />
    case 'area':
      return <AreaChartWidget widget={widget} dataset={dataset} />
    case 'bar':
      return <BarChartWidget widget={widget} dataset={dataset} />
    case 'donut':
      return <DonutChartWidget widget={widget} dataset={dataset} />
    case 'stat':
      return <StatCardWidget widget={widget} dataset={dataset} />
    case 'summary':
      return <SummaryWidget widget={widget} dataset={dataset} />
    case 'allocationList':
      return <AllocationListWidget widget={widget} dataset={dataset} />
    case 'timeline':
      return <TimelineWidget widget={widget} dataset={dataset} />
    case 'insight':
      return <InsightWidget widget={widget} dataset={dataset} />
    case 'metricPair':
      return <MetricPairWidget widget={widget} dataset={dataset} />
    case 'allocationSpotlight':
      return <AllocationSpotlightWidget widget={widget} dataset={dataset} />
    case 'healthBanner':
      return <HealthBannerWidget widget={widget} dataset={dataset} />
    default: {
      const _exhaustive: never = widget
      return _exhaustive
    }
  }
}
