export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" aria-hidden="true">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton mt-3 h-3 w-full" />
      <div className="skeleton mt-2 h-3 w-5/6" />
      <div className="mt-4 flex gap-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-5 w-14" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="skeleton h-7 w-7 rounded-full" />
        <div className="skeleton h-3 w-24" />
      </div>
    </div>
  )
}
