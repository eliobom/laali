interface HeroProps {
  backgroundImageUrl?: string;
}

export default function Hero({ backgroundImageUrl }: HeroProps) {
  return (
    <section className="px-4 md:px-6 pt-6">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
        style={
          backgroundImageUrl
            ? {
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      >
        {!backgroundImageUrl && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900" />
        )}

        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

        <div className="relative z-10 flex min-h-[14rem] md:min-h-[18rem] items-center justify-center px-6 py-10">
          <div className="text-center">
            <div className="text-yellow-400 font-extrabold tracking-[0.22em] text-4xl md:text-6xl drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]">
              LA ALIANZA
            </div>
            <div className="mt-3 text-white/90 tracking-[0.55em] text-sm md:text-base drop-shadow-[0_2px_14px_rgba(0,0,0,0.6)]">
              CARNICERIAS
            </div>
            <div className="mt-4 mx-auto h-1 w-36 rounded-full bg-yellow-400/90" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
      </div>
    </section>
  );
}
