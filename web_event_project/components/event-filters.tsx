'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { GOVERNORATES, EVENT_CATEGORIES, type EventCategory } from '@/lib/types'

interface EventFiltersProps {
  search: string
  governorate: string
  category: string
  onSearchChange: (value: string) => void
  onGovernorateChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onClear: () => void
}

export function EventFilters({
  search,
  governorate,
  category,
  onSearchChange,
  onGovernorateChange,
  onCategoryChange,
  onClear
}: EventFiltersProps) {
  const hasFilters = search || governorate || category

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select value={governorate} onValueChange={onGovernorateChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Governorates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Governorates</SelectItem>
            {GOVERNORATES.map((gov) => (
              <SelectItem key={gov} value={gov}>{gov}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {EVENT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
