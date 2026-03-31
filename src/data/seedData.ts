import type {SeedDataset} from '@/types/widget'

export const seedDataset: SeedDataset = {
  portfolioTimeseries: [
    {date: '2026-01-01', portfolioValue: 1_200_000, netFlows: 20_000},
    {date: '2026-01-08', portfolioValue: 1_235_000, netFlows: 8_000},
    {date: '2026-01-15', portfolioValue: 1_255_000, netFlows: -5_000},
    {date: '2026-01-22', portfolioValue: 1_278_000, netFlows: 12_000},
    {date: '2026-01-29', portfolioValue: 1_301_000, netFlows: 15_000},
  ],
  assetAllocation: [
    {assetClass: 'equities', marketValue: 740_000},
    {assetClass: 'fixed_income', marketValue: 290_000},
    {assetClass: 'cash', marketValue: 120_000},
    {assetClass: 'alternatives', marketValue: 151_000},
  ],
  performanceStats: {
    totalValue: 1_301_000,
    dailyChange: 12_300,
    ytdReturnPct: 7.8,
  },
}
