"use client";

import { DateRangeOption } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateRangeSelectorProps {
  value: DateRangeOption;
  onChange: (value: DateRangeOption) => void;
}

const DATE_RANGE_OPTIONS = [
  { value: '7d' as DateRangeOption, label: 'Last 7 days' },
  { value: '30d' as DateRangeOption, label: 'Last 30 days' },
  { value: '90d' as DateRangeOption, label: 'Last 90 days' },
  { value: 'all' as DateRangeOption, label: 'All time' },
];

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>
      <SelectContent>
        {DATE_RANGE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
