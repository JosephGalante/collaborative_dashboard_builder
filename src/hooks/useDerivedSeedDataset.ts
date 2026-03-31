import { useMemo } from 'react'
import { deriveFilteredDataset } from '@/lib/filters/deriveFilteredDataset'
import { seedDataset } from '@/data/seedData'
import type { GlobalFilters } from '@/types/widget'

export function useDerivedSeedDataset(globalFilters: GlobalFilters) {
  return useMemo(() => deriveFilteredDataset(seedDataset, globalFilters), [globalFilters])
}
