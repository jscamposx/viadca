const PackageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="h-[60vh] sm:h-[70vh] w-full relative overflow-hidden">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-b from-slate-200/60 via-slate-100/50 to-slate-50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-11/12 sm:w-4/5 lg:w-3/5">
          <div className="space-y-4">
            <div className="h-8 sm:h-10 lg:h-12 w-3/4 mx-auto bg-white/60 rounded-xl animate-pulse"></div>
            <div className="h-4 sm:h-5 w-2/3 mx-auto bg-white/50 rounded-lg animate-pulse"></div>
            <div className="flex justify-center gap-3 pt-4">
              <div className="h-8 w-24 bg-white/70 rounded-full animate-pulse" />
              <div className="h-8 w-28 bg-white/70 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-white/70 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            {[1, 2, 3].map((i) => (
              <section
                key={i}
                className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/20"
              >
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-1/3 bg-slate-200 rounded-md animate-pulse" />
                    <div className="h-4 w-1/2 bg-slate-200 rounded-md animate-pulse" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, j) => (
                    <div
                      key={j}
                      className="h-28 rounded-xl bg-slate-100 animate-pulse"
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
          <aside className="xl:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
                <div className="h-10 w-2/3 bg-slate-200 rounded-md animate-pulse mb-4" />
                <div className="h-6 w-1/2 bg-slate-200 rounded-md animate-pulse mb-2" />
                <div className="h-4 w-1/3 bg-slate-200 rounded-md animate-pulse" />
                <div className="h-12 w-full bg-blue-200/50 rounded-2xl animate-pulse mt-6" />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                  <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
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
