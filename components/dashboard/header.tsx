import { format } from 'date-fns';

interface DashboardHeaderProps {
  title: string;
  dateRange?: {
    start: string;
    end: string;
  };
  children?: React.ReactNode;
}

export function DashboardHeader({ title, dateRange, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">{title}</h1>
        {dateRange && (
          <p className="mt-2 text-sm text-zinc-600">
            {format(new Date(dateRange.start), 'MMM d, yyyy')} -{' '}
            {format(new Date(dateRange.end), 'MMM d, yyyy')}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
