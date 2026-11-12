import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-[#EFEDE6] rounded-[10px]', className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#F7F6F1] border border-[#E4E3DC] rounded-[14px] overflow-hidden flex flex-col">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4.5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4.5 w-full" />
          <Skeleton className="h-4.5 w-3/4" />
        </div>
        <div className="pt-2 space-y-2.5">
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('animate-spin rounded-full border-2 border-[#E4E3DC] border-t-[#19231F]', sizes[size])} />
    </div>
  );
}

