import type {SeedDataset, Widget} from '@/types/widget'
import LineChartWidget from './LineChartWidget'
import BarChartWidget from './BarChartWidget'
import StatCardWidget from './StatCardWidget'

type WidgetBodyProps = {
  widget: Widget
  dataset: SeedDataset
}

export default function WidgetBody({widget, dataset}: WidgetBodyProps) {
  switch (widget.type) {
    case 'line':
      return <LineChartWidget widget={widget} dataset={dataset} />
    case 'bar':
      return <BarChartWidget widget={widget} dataset={dataset} />
    case 'stat':
      return <StatCardWidget widget={widget} dataset={dataset} />
    default: {
      const _exhaustive: never = widget
      return _exhaustive
    }
  }
}
