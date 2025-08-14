import React from "react";

const testimonialsData = [
	{
		name: "Yadis González Mercado",
		location: "Hace 3 días",
		avatar:
			"https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/UdPdAgF7PJ.png",
		quote: "La asesoría y el trato es excelente!! Lo súper recomiendo",
		accentFrom: "from-emerald-500",
		accentTo: "to-teal-500",
	},
	{
		name: "Araceli Gurrola Lopez",
		location: "Hace 1 semana",
		avatar:
			"https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/UdPdAgF7PJ.png",
		quote: "El servicio me parece excelente y profesional 👌",
		accentFrom: "from-indigo-500",
		accentTo: "to-violet-500",
	},
	{
		name: "Techy Ruiz Piña",
		location: "Hace 5 días",
		avatar:
			"https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/UdPdAgF7PJ.png",
		quote:
			"EXCELENTE SERVICIO MUY PROFESIONAL Y EFICIENTE. TODO PUNTUAL Y DE GRAN CALIDAD LO RECOMIENDO AMPLIAMENTE. TANTO PARA VIAJES NACIONALES COMO INTERNACIONALES.",
		accentFrom: "from-orange-500",
		accentTo: "to-amber-500",
	},
	{
		name: "Nat Ruiz",
		location: "Hace 2 semanas",
		avatar:
			"https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-12/UdPdAgF7PJ.png",
		quote: "Excelente organización, destinos increíbles! 100% recomendado",
		accentFrom: "from-pink-500",
		accentTo: "to-rose-500",
	},
];

const mod = (n, m) => ((n % m) + m) % m;

const SlideCard = ({ t, state }) => {
	// state: -1 (prev), 0 (active), 1 (next), others hidden
	const base =
		"absolute left-1/2 top-1/2 w-[96%] sm:w-[85%] lg:w-[520px] -translate-x-1/2 -translate-y-1/2 origin-center transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] transform-gpu";

	const stateMap = {
		[-1]: "-translate-x-[58%] rotate-y-[12deg] scale-[.92] opacity-70 z-0 blur-[0.5px]",
		[0]: "translate-x-[-50%] rotate-y-0 scale-100 opacity-100 z-10 blur-0",
		[1]: "-translate-x-[42%] rotate-y-[-12deg] scale-[.92] opacity-70 z-0 blur-[0.5px]",
	};

	const cls = `${base} ${stateMap[state] || "opacity-0 pointer-events-none"}`;

	return (
		<article
			className={`${cls} select-none`}
			aria-hidden={state !== 0}
			role={state === 0 ? "article" : undefined}
		>
			<div className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur shadow-2xl ring-1 ring-slate-900/5 p-5 sm:p-8">
				<div
					className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${t.accentFrom} ${t.accentTo}`}
					aria-hidden="true"
				/>
				<div className="flex items-center gap-4 mb-5">
					<img
						src={t.avatar}
						alt={t.name}
						width={64}
						height={64}
						className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm"
						loading="lazy"
						decoding="async"
					/>
					<div className="min-w-0">
						<h4 className="text-slate-900 font-semibold leading-tight truncate">
							{t.name}
						</h4>
						<p className="text-slate-500 text-xs sm:text-sm truncate">
							{t.location}
						</p>
					</div>
				</div>
				<p className="text-slate-700 leading-relaxed text-[15px] sm:text-base">
					“{t.quote}”
				</p>
			</div>
			<div
				className={`pointer-events-none absolute -inset-6 -z-10 rounded-[28px] bg-gradient-to-br ${t.accentFrom} ${t.accentTo} opacity-20 blur-2xl`}
				aria-hidden="true"
			/>
		</article>
	);
};

const Testimonials = () => {
	const [index, setIndex] = React.useState(0);
	const [paused, setPaused] = React.useState(false);
	const len = testimonialsData.length;

	const next = React.useCallback(() => setIndex((i) => mod(i + 1, len)), [len]);
	const prev = React.useCallback(() => setIndex((i) => mod(i - 1, len)), [len]);
	const goTo = React.useCallback((i) => setIndex(mod(i, len)), [len]);

	// autoplay robusto a 5s con pausa en hover y cuando la pestaña no está visible
	const intervalRef = React.useRef(null);

	const start = React.useCallback(() => {
		if (intervalRef.current) return;
		intervalRef.current = setInterval(() => {
			if (!document.hidden) next();
		}, 5000);
	}, [next]);

	const stop = React.useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	React.useEffect(() => {
		if (!paused) start();
		return () => stop();
	}, [paused, start, stop]);

	React.useEffect(() => {
		const onVis = () => {
			if (document.hidden) stop();
			else if (!paused) start();
		};
		document.addEventListener("visibilitychange", onVis);
		return () => document.removeEventListener("visibilitychange", onVis);
	}, [paused, start, stop]);

	// teclado (izquierda/derecha)
	React.useEffect(() => {
		const onKey = (e) => {
			if (e.key === "ArrowRight") next();
			else if (e.key === "ArrowLeft") prev();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [next, prev]);

	return (
		<section
			id="testimonios"
			className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-32"
			aria-labelledby="testimonios-heading"
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
		>
			<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
				{/* Left content */}
				<div className="space-y-8">
					<p className="text-text-gray font-semibold text-lg uppercase tracking-wide">
						Testimonios
					</p>
					<h2
						id="testimonios-heading"
						className="font-volkhov font-bold text-4xl sm:text-5xl text-secondary leading-tight"
					>
						Lo que dicen nuestros
						<br />viajeros satisfechos
					</h2>
					<div
						className="flex items-center gap-3"
						aria-hidden="true"
					>
						<span className="inline-block w-12 h-1 rounded bg-secondary" />
						<span className="inline-block w-6 h-1 rounded bg-slate-300" />
						<span className="inline-block w-6 h-1 rounded bg-slate-200" />
					</div>
				</div>

				{/* Right: carrusel dinámico */}
				<div
					className="relative h-[340px] sm:h-[420px] md:h-[440px] transform-gpu"
					role="region"
					aria-label="Carrusel de testimonios"
				>
					{/* Deck de tarjetas */}
					<div
						className="relative h-full w-full"
						style={{ perspective: 1200 }}
					>
						{testimonialsData.map((t, i) => {
							const rel =
								i === index
									? 0
									: i === mod(index - 1, len)
									? -1
									: i === mod(index + 1, len)
									? 1
									: 2;
							return <SlideCard key={i} t={t} state={rel} />;
						})}
					</div>

					{/* Controles */}
					<div className="absolute inset-x-0 -bottom-2 sm:-bottom-3 flex items-center justify-between px-2 sm:px-4">
						<button
							type="button"
							onClick={prev}
							className="group inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur ring-1 ring-slate-900/5 shadow-md hover:shadow-lg hover:bg-white text-slate-700 transition-all"
							aria-label="Testimonio anterior"
						>
							<svg
								className="w-5 h-5 transition-transform group-hover:-translate-x-0.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>

						{/* Dots */}
						<div className="flex items-center gap-2">
							{testimonialsData.map((_, i) => (
								<button
									key={i}
									onClick={() => goTo(i)}
									className={`rounded-full transition-all ${
										i === index
											? "h-2 w-5 sm:h-2.5 sm:w-6 bg-secondary"
											: "h-2 w-2 sm:h-2.5 sm:w-2.5 bg-slate-300 hover:bg-slate-400"
										}`}
									aria-label={`Ir al testimonio ${i + 1}`}
									aria-current={i === index}
								/>
							))}
						</div>

						<button
							type="button"
							onClick={next}
							className="group inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur ring-1 ring-slate-900/5 shadow-md hover:shadow-lg hover:bg-white text-slate-700 transition-all"
							aria-label="Siguiente testimonio"
						>
							<svg
								className="w-5 h-5 transition-transform group-hover:translate-x-0.5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
