import { Search, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type MatchTypeFilter = 'all' | 'singles' | 'doubles';
export type SortOrder = 'newest' | 'oldest';

interface MatchFilterBarProps {
  filterType: MatchTypeFilter;
  onFilterTypeChange: (type: MatchTypeFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
}

export function MatchFilterBar({
  filterType,
  onFilterTypeChange,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortOrderChange,
}: MatchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-1">
      {/* View Segment Tabs */}
      <Tabs
        value={filterType}
        onValueChange={(value) => onFilterTypeChange(value as MatchTypeFilter)}
        className="w-full sm:w-auto"
      >
        <TabsList className="grid w-full sm:w-auto grid-cols-3 h-10 p-1 bg-muted rounded-full">
          <TabsTrigger
            value="all"
            className="rounded-full text-sm font-medium transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            All Matches
          </TabsTrigger>
          <TabsTrigger
            value="singles"
            className="rounded-full text-sm font-medium transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Singles
          </TabsTrigger>
          <TabsTrigger
            value="doubles"
            className="rounded-full text-sm font-medium transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Doubles
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Action Utilities Area */}
      <div className="flex items-center gap-3 flex-1 sm:flex-initial min-w-0">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-64 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by player name..."
            className="pl-10 h-10 rounded-full bg-card border-border text-sm placeholder:text-muted-foreground focus-visible:ring-primary shadow-xs"
          />
        </div>

        {/* Sort Select */}
        <Select
          value={sortOrder}
          onValueChange={(value) => onSortOrderChange(value as SortOrder)}
        >
          <SelectTrigger className="w-[140px] h-10 rounded-full bg-card border-border text-sm font-medium text-foreground focus:ring-primary shadow-xs [&>svg]:hidden">
            <div className="flex items-center gap-2 truncate">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Sort order" />
            </div>
          </SelectTrigger>
          <SelectContent align="end" className="rounded-2xl border-border bg-popover shadow-lg">
            <SelectItem value="newest" className="rounded-xl text-sm font-medium cursor-pointer">
              Newest First
            </SelectItem>
            <SelectItem value="oldest" className="rounded-xl text-sm font-medium cursor-pointer">
              Oldest First
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}