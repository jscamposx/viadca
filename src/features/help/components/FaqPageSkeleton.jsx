import React from "react";

export default function FaqPageSkeleton() {
  return (
    <main className="min-h-screen bg-white pt-24 sm:pt-28 lg:pt-28 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8" aria-busy="true">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-10">
        {/* Sidebar skeleton */}
        <aside className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-28 space-y-4">
            <div className="h-4 w-32 bg-gray-200 rounded skeleton-shimmer" />
            <ul className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <div className="h-8 bg-gray-200 rounded-md skeleton-shimmer" />
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content skeleton */}
        <div className="lg:col-span-3 space-y-12">
          <header className="space-y-4 max-w-3xl lg:mt-8">
            <div className="h-4 w-28 bg-blue-100 rounded skeleton-shimmer" />
            <div className="h-10 w-3/4 bg-gray-200 rounded skeleton-shimmer" />
            <div className="h-4 w-full max-w-xl bg-gray-200 rounded skeleton-shimmer" />
            <div className="h-4 w-4/5 bg-gray-200 rounded skeleton-shimmer" />
          </header>

          {Array.from({ length: 3 }).map((_, sectionIdx) => (
            <section key={sectionIdx} className="space-y-4">
              <div className="h-8 w-2/3 bg-gray-200 rounded skeleton-shimmer" />
              <div className="h-4 w-3/4 bg-gray-200 rounded skeleton-shimmer" />
              <div className="space-y-3 mt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="h-5 w-11/12 bg-gray-200 rounded skeleton-shimmer" />
                    <div className="mt-3 space-y-2">
                      <div className="h-4 w-full bg-gray-100 rounded skeleton-shimmer" />
                      <div className="h-4 w-5/6 bg-gray-100 rounded skeleton-shimmer" />
                      <div className="h-4 w-2/3 bg-gray-100 rounded skeleton-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
