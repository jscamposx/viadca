const PackageSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero placeholder (match real heights) */}
      <div className="relative min-h-[70svh] sm:min-h-[80svh] md:min-h-[100svh] h-[100dvh] overflow-hidden">
        {/* Image area shimmer */}
        <div className="absolute inset-0 bg-slate-200/70 animate-pulse" />
        {/* Subtle overlay, no heavy gradient */}
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />

        {/* Centered title/subtitle/CTA placeholders */}
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="w-full max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
            <div className="h-8 sm:h-10 md:h-12 w-3/4 mx-auto bg-white/70 rounded-xl" />
            <div className="h-4 sm:h-5 w-2/3 mx-auto bg-white/60 rounded-lg" />
            <div className="pt-4 md:pt-6">
              <div className="h-12 sm:h-14 w-44 sm:w-56 mx-auto bg-white/80 rounded-2xl shadow" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content placeholder aligned to real grid */}
      <div className="container mx-auto px-4 py-10 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8">
          {/* Left content (xl: 3 cols) */}
          <div className="xl:col-span-3 space-y-6 sm:space-y-8">
            {/* Info cards block */}
            <section className="bg-white rounded-2xl shadow border border-slate-100 p-5 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-slate-200 rounded-md" />
                      <div className="h-3 w-16 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary / sections */}
            <section className="bg-white rounded-2xl shadow border border-slate-100 p-5 sm:p-6 lg:p-8">
              <div className="h-6 w-40 bg-slate-200 rounded-md mb-5" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="grid grid-cols-[auto,1fr] gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-200 mt-1" />
                    <div className="space-y-2">
                      <div className="h-4 w-1/2 bg-slate-200 rounded" />
                      <div className="h-3 w-3/4 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Text blocks (incluye / no incluye) */}
            <section className="bg-white rounded-2xl shadow border border-slate-100 p-5 sm:p-6 lg:p-8">
              <div className="h-6 w-36 bg-slate-200 rounded-md mb-4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-3 w-full bg-slate-100 rounded" />
                ))}
                <div className="h-3 w-2/3 bg-slate-100 rounded" />
              </div>
            </section>
          </div>

          {/* Right aside (price/contact card) */}
          <aside className="xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <div className="h-8 w-40 bg-slate-200 rounded-md mb-3" />
                <div className="h-6 w-28 bg-slate-200 rounded mb-1.5" />
                <div className="h-4 w-20 bg-slate-100 rounded" />
                <div className="h-12 w-full bg-blue-200/50 rounded-xl mt-6" />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="h-10 bg-slate-100 rounded-lg" />
                  <div className="h-10 bg-slate-100 rounded-lg" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PackageSkeleton;
