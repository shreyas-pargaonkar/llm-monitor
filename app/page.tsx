import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-zinc-50 to-zinc-200 min-h-screen flex items-center justify-center">
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900">
              Monitor LLM Usage & Costs
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl max-w-4xl mx-auto">
            Track your LLM token consumption in real-time
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-zinc-600 max-w-2xl mx-auto">
            Comprehensive monitoring for GPT-4, Claude, and other LLM models.
            Track token usage, analyze costs, and optimize your AI spending with detailed analytics.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-md bg-zinc-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors"
            >
              View Dashboard
            </Link>
            <a
              href="#"
              className="text-base font-semibold text-zinc-900 hover:text-zinc-700 transition-colors"
            >
              Learn More →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
