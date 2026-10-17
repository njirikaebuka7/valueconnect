import { Award, Globe2, Landmark, ShieldCheck } from "lucide-react";

const items = [
  { value: "ESVARBON", label: "Registered firm of Estate Surveyors & Valuers", icon: ShieldCheck },
  { value: "NIESV", label: "Member valuers of the Nigerian Institution", icon: Landmark },
  { value: "IVS", label: "Reports aligned to International Valuation Standards", icon: Award },
  { value: "36 + FCT", label: "Instructions taken nationwide", icon: Globe2 },
];

export function TrustBand() {
  return (
    <section className="bg-navy-mesh relative overflow-hidden py-14 sm:py-16">
      <div aria-hidden className="bg-grid-faint absolute inset-0 opacity-50" />
      <div className="container-x relative">
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.map(({ value, label, icon: Icon }, i) => (
            <li
              key={value}
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties}
              className="glass group rounded-3xl p-5 transition hover:bg-white/15 sm:p-6"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-aqua-500/15 text-aqua-300 ring-1 ring-aqua-400/30">
                <Icon className="h-5 w-5" />
              </span>
              <p className="font-brand mt-5 text-2xl font-semibold tracking-wide text-white sm:text-3xl">{value}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-navy-100/75 sm:text-sm">{label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
