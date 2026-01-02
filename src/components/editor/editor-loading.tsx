import { Skeleton } from '@/components/ui/skeleton'

export default function EditorLoading() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="bg-background border-b p-4">
        <div className="flex flex-wrap items-center gap-2">
          {[2, 5, 3, 3, 3].map((count, groupIndex) => (
            <div key={groupIndex} className="flex items-center gap-2">
              {Array.from({ length: count }).map((_, index) => (
                <Skeleton
                  key={`icon-${groupIndex}-${index}`}
                  className="h-7 w-7"
                />
              ))}
              {groupIndex < 4 ? (
                <Skeleton className="bg-border h-6 w-px opacity-70" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="bg-background w-1/2 border-r">
          <div className="space-y-5 p-6">
            <Skeleton className="h-9 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-9/12" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-8/12" />
              <Skeleton className="h-4 w-9/12" />
            </div>
          </div>
        </div>
        <div className="w-1/2 bg-white text-slate-900">
          <div className="space-y-6 p-8">
            <div className="space-y-3">
              <Skeleton className="h-10 w-7/12 rounded-md bg-slate-200" />
              <Skeleton className="h-4 w-5/12 rounded bg-slate-200" />
            </div>
            <Skeleton className="h-20 w-full rounded-md bg-slate-200" />
            <Skeleton className="h-5 w-4/12 rounded bg-slate-200" />
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-md bg-slate-200" />
              <Skeleton className="h-16 w-full rounded-md bg-slate-200" />
              <Skeleton className="h-16 w-full rounded-md bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-background border-t p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-14" />
        </div>
      </div>
    </div>
  )
}
