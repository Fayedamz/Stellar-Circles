import Link from "next/link";
import { CircleType } from "@stellar-circles/shared";

const verticals = [
  {
    type: CircleType.LEARNING,
    icon: "🎓",
    label: "Learning",
    desc: "Study groups, knowledge sharing, skill progression",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    type: CircleType.BUSINESS,
    icon: "💼",
    label: "Business",
    desc: "Startup accountability, idea validation, founder circles",
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  {
    type: CircleType.FITNESS,
    icon: "💪",
    label: "Fitness",
    desc: "Workout tracking, group challenges, health habits",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    type: CircleType.FARMING,
    icon: "🌾",
    label: "Farming",
    desc: "Agricultural cooperation, seasonal planning, shared knowledge",
    color: "bg-lime-50 border-lime-200 text-lime-700",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 to-brand-700 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 text-sm mb-6">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Built on Stellar
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Influence is earned,<br />not bought.
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-10">
            Stellar Circles lets you form micro-societies around shared interests.
            Your voice grows with your participation — no tokens, no speculation.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/circles"
              className="bg-white text-brand-700 font-semibold px-8 py-3 rounded-lg hover:bg-brand-50 transition-colors"
            >
              Explore Circles
            </Link>
            <Link
              href="/register"
              className="border border-white/40 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Create a Circle
            </Link>
          </div>
        </div>
      </section>

      {/* Verticals */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Four verticals. One model.
          </h2>
          <p className="text-center text-slate-500 mb-12">
            Every circle type has its own activity templates, but influence works the same way everywhere.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {verticals.map((v) => (
              <Link
                key={v.type}
                href={`/circles?type=${v.type}`}
                className={`border rounded-xl p-6 hover:shadow-md transition-shadow ${v.color}`}
              >
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-lg mb-2">{v.label}</h3>
                <p className="text-sm opacity-80">{v.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How influence works */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            How influence works
          </h2>
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Log your participation",
                body: "Attend sessions, complete tasks, share resources, and contribute to your circle.",
              },
              {
                step: "02",
                title: "Build your streak",
                body: "Consistency multiplies your influence. Show up weekly and your weight grows over time.",
              },
              {
                step: "03",
                title: "Earn influence — don't buy it",
                body: "Influence is a social signal, not an asset. It can't be transferred or sold.",
              },
              {
                step: "04",
                title: "Shape decisions",
                body: "When your circle votes, your influence weight reflects your real contribution history.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <span className="text-4xl font-black text-brand-200 leading-none">{item.step}</span>
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg mb-1">{item.title}</h3>
                  <p className="text-slate-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-8 text-sm">
        <p>Stellar Circles — A social coordination layer built on Stellar.</p>
        <p className="mt-1">Influence is not owned — it is earned.</p>
      </footer>
    </main>
  );
}
