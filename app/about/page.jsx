import Link from "next/link";

export default function AboutPage() {
  const pillars = [
    {
      icon: "📢",
      title: "Advocacy Aggregation",
      text: "Centralise campaigns, reports and statements from NGOs and CSOs in one structured, searchable space. No more scattered emails and lost PDFs.",
    },
    {
      icon: "📋",
      title: "Case Documentation",
      text: "Raise and monitor human rights cases with timestamped, attributed posts that serve as verifiable public records for legal teams and international bodies.",
    },
    {
      icon: "🤝",
      title: "Coalition Building",
      text: "Connect civil society actors across geographies. Build thematic coalitions, coordinate responses to emerging rights crises and amplify each other's work.",
    },
    {
      icon: "🔬",
      title: "Research & Evidence",
      text: "Academics and researchers share findings and engage directly with practitioners, closing the gap between evidence and action on the ground.",
    },
    {
      icon: "🌍",
      title: "Global Reach, Local Voice",
      text: "From community organisations in rural areas to international networks, Tweetr amplifies every voice equally, removing barriers to participation.",
    },
    {
      icon: "🛡️",
      title: "Safe & Focused Environment",
      text: "No engagement-driven algorithms. No advertising. No distraction. A curated, thematic space built for purposeful, rights-focused advocacy.",
    },
  ];

  const whoFor = [
    {
      icon: "🏢",
      title: "NGOs & INGOs",
      text: "Share reports, statements and campaign materials. Coordinate with partner organisations across borders and time zones.",
    },
    {
      icon: "🏘️",
      title: "CSOs & CBOs",
      text: "Document local cases and connect with national and international allies who can amplify your work and provide support.",
    },
    {
      icon: "✊",
      title: "Activists & Advocates",
      text: "Raise cases, build solidarity networks, and access expertise from established organisations and fellow defenders.",
    },
    {
      icon: "🧑‍🎓",
      title: "Researchers & Academics",
      text: "Share peer-reviewed findings and evidence-based analysis directly with practitioners and policymakers who need it.",
    },
    {
      icon: "👥",
      title: "Citizen Groups",
      text: "Neighbourhood groups, religious communities and informal coalitions can participate fully without institutional gatekeeping.",
    },
    {
      icon: "🏫",
      title: "Students & Youth",
      text: "The next generation of rights defenders can learn, contribute and connect with experienced advocates and organisations.",
    },
  ];

  const methodology = [
    {
      step: "01",
      title: "Post & Attribute",
      text: "Every post is attributed to its author or organisation, creating a transparent, credible and timestamped public record.",
    },
    {
      step: "02",
      title: "Tag & Categorise",
      text: "Thematic tags align posts with internationally recognised rights categories and frameworks, making content findable and contextual.",
    },
    {
      step: "03",
      title: "Aggregate & Amplify",
      text: "Related posts surface together, enabling users and organisations to follow evolving cases and campaigns over time.",
    },
    {
      step: "04",
      title: "Engage & Collaborate",
      text: "Comment, share and build on each other's work, turning individual posts into coordinated, collective advocacy.",
    },
  ];

  const principles = [
    "Commitment to accuracy, rigour and evidence-based advocacy",
    "Respect for the dignity, privacy and safety of victims and survivors",
    "Non-partisan, inclusive participation across all rights issues and regions",
    "Transparency of authorship, organisational affiliation and funding",
    "Zero tolerance for hate speech, harassment, disinformation or bad-faith engagement",
    "Alignment with the UN Declaration of Human Rights and international humanitarian law",
  ];

  const frameworks = [
    {
      title: "Universal Declaration of Human Rights",
      year: "1948",
      icon: "⚖️",
    },
    {
      title: "International Covenant on Civil & Political Rights",
      year: "1966",
      icon: "🗳️",
    },
    {
      title: "International Covenant on Economic, Social & Cultural Rights",
      year: "1966",
      icon: "🏛️",
    },
    {
      title: "UN Convention on the Rights of the Child",
      year: "1989",
      icon: "🧒",
    },
    {
      title: "Convention on the Elimination of Discrimination Against Women",
      year: "1979",
      icon: "♀️",
    },
    { title: "Convention Against Torture", year: "1984", icon: "🛡️" },
  ];

  return (
    <div className="animate-fade-in p-6">
      <div className="gold-gradient rounded-2xl p-8 md:p-12 text-center mb-8">
        <span className="inline-block bg-black/10 text-black text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
          About the Platform
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-3 leading-tight">
          A Dedicated Space for Rights Defenders
        </h1>
        <p className="text-black/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Tweetr is a thematic, purpose-built platform for the human rights
          sector. We enable organisations, activists, researchers and
          communities to aggregate ideas, share advocacy materials and document
          rights cases with professional rigour and global reach, free from the
          noise of general social media.
        </p>
      </div>

      <div className="dark-card rounded-2xl p-6 md:p-8 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          The Problem We Solve
        </h2>
        <div className="w-12 h-1 bg-gold-500 rounded mb-5" />
        <div className="grid md:grid-cols-2 gap-6 text-zinc-400 text-sm leading-relaxed">
          <p>
            General social media was not designed for human rights work.
            Engagement-driven algorithms reward outrage over nuance and
            prioritise viral content over verified evidence. Advocates face
            harassment, surveillance and disinformation. Critical cases are
            buried beneath entertainment, and advocacy materials compete with
            advertising for attention.
          </p>
          <p>
            The human rights sector needs dedicated infrastructure, one that
            understands the weight of this work. Tweetr provides a focused,
            professional environment where NGOs, CSOs, community groups,
            researchers, journalists and citizens can document, share and
            collaborate, without distraction and without compromise.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Platform Pillars</h2>
        <div className="w-12 h-1 bg-gold-500 rounded mb-5" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="dark-card rounded-2xl p-5 flex flex-col gap-2"
            >
              <span className="text-2xl">{p.icon}</span>
              <h3 className="text-white font-bold text-sm">{p.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          Who Is Tweetr For?
        </h2>
        <div className="w-12 h-1 bg-gold-500 rounded mb-5" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {whoFor.map((w) => (
            <div key={w.title} className="dark-card rounded-2xl p-5 flex gap-4">
              <span className="text-2xl flex-shrink-0">{w.icon}</span>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">
                  {w.title}
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  {w.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dark-card rounded-2xl p-6 md:p-8 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          How It Works, Methodology
        </h2>
        <div className="w-12 h-1 bg-gold-500 rounded mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {methodology.map((m) => (
            <div key={m.step}>
              <p className="text-gold-500 font-extrabold text-3xl mb-2 opacity-30">
                {m.step}
              </p>
              <h3 className="text-white font-bold text-sm mb-2">{m.title}</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="dark-card rounded-2xl p-6 md:p-8 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          International Frameworks We Align With
        </h2>
        <div className="w-12 h-1 bg-gold-500 rounded mb-5" />
        <p className="text-zinc-400 text-sm mb-5 leading-relaxed">
          Tweetr&apos;s categories, standards and content policies are grounded
          in the core instruments of international human rights law. All content
          on the platform is contextualised within these frameworks.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {frameworks.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-3 bg-zinc-900/50 rounded-xl px-4 py-3 border border-zinc-800"
            >
              <span className="text-lg flex-shrink-0">{f.icon}</span>
              <div>
                <p className="text-white text-xs font-semibold leading-snug">
                  {f.title}
                </p>
                <p className="text-zinc-600 text-xs mt-0.5">{f.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dark-card rounded-2xl p-6 md:p-8 mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          Community Standards & Principles
        </h2>
        <div className="w-12 h-1 bg-gold-500 rounded mb-4" />
        <p className="text-zinc-400 text-sm leading-relaxed mb-5">
          Participation on Tweetr is governed by a shared commitment to the
          values that underpin international human rights law. All users,
          individuals and organisations alike, are expected to uphold the
          following principles:
        </p>
        <ul className="space-y-3">
          {principles.map((p) => (
            <li
              key={p}
              className="flex items-start gap-3 text-zinc-300 text-sm"
            >
              <span className="w-5 h-5 rounded-full gold-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-3 h-3 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              {p}
            </li>
          ))}
        </ul>
      </div>

      <div className="dark-card rounded-2xl p-6 md:p-8 border border-gold-500/20 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="flex-1">
            <h2 className="text-white font-bold text-xl mb-2">
              Ready to Join the Network?
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Whether you represent an international NGO, a grassroots community
              group, or are an individual advocate, researcher or student, your
              voice belongs here.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/register"
              className="gold-gradient text-black font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
            >
              Create Account
            </Link>
            <Link
              href="/contact"
              className="bg-zinc-800 text-zinc-300 font-semibold px-6 py-3 rounded-xl hover:bg-zinc-700 transition-colors text-sm whitespace-nowrap"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      <div className="dark-card rounded-2xl p-5 border-l-2 border-gold-500">
        <p className="text-zinc-300 text-sm leading-relaxed italic">
          &ldquo;All human beings are born free and equal in dignity and rights.
          They are endowed with reason and conscience and should act towards one
          another in a spirit of brotherhood.&rdquo;
        </p>
        <p className="text-zinc-500 text-xs mt-2">
          , Universal Declaration of Human Rights, Article 1 (1948)
        </p>
      </div>
    </div>
  );
}
