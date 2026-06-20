import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Factory, Coins, Leaf, Handshake, Sparkles, Heart, Flag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionTag } from "../components/Layout";
import { PageHero } from "../components/PageHero";
import { Section, SectionHead } from "../components/Section";
import { Reveal } from "../components/Effects";
import { resolveSiteStats } from "@/lib/siteCopy";
import { siteSettingsQueryOptions } from "@/lib/queries/options";

export const Route = createFileRoute("/about")({
  loader: ({ context: { queryClient } }) => queryClient.fetchQuery(siteSettingsQueryOptions()),
  head: () => ({
    meta: [
      { title: "About Us — Golden Fresh Biscuits" },
      { name: "description", content: "Baked with pride since 1998. Golden Fresh was born in Lenasia and feeds South African families with quality, affordable biscuits." },
    ],
  }),
  component: About,
});

const VALUES: { icon: LucideIcon; t: string; b: string }[] = [
  { icon: Factory, t: "Made in SA", b: "Baked in Lenasia, Johannesburg. Local jobs, local pride." },
  { icon: Coins, t: "Honest Prices", b: "Quality biscuits within reach of every South African family." },
  { icon: Leaf, t: "Real Ingredients", b: "No shortcuts. Only the finest ingredients, baked with care." },
];

const MILESTONES = [
  { y: "1998", t: "Founded in Lenasia by Yunma Foods." },
  { y: "2002", t: "Glucose Energy becomes SA's go-to lunchbox biscuit." },
  { y: "2008", t: "Joker and All-Star ranges launched." },
  { y: "2015", t: "Expanded to all 9 provinces." },
  { y: "2024", t: "Nine product ranges, millions of families." },
];

const ROW_VALUES: { icon: LucideIcon; t: string; b: string }[] = [
  { icon: Handshake, t: "Community", b: "We bake for our neighbours, our cousins, our country." },
  { icon: Sparkles, t: "Quality", b: "Every biscuit, every box — to the same proud standard." },
  { icon: Heart, t: "Affordability", b: "Lekkerness should never cost too much." },
  { icon: Flag, t: "Proudly SA", b: "Made here. Loved here. Born here." },
];

function About() {
  const { data: settings = {} } = useQuery(siteSettingsQueryOptions());
  const stats = resolveSiteStats(settings);

  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title={<>Baked With <span className="accent">Pride</span> Since <span className="accent">1998</span></>}
        description="Golden Fresh was born in Lenasia, Johannesburg — and has been feeding South African families with quality, affordable biscuits ever since."
      />

      <Section variant="cream">
        <div className="mission-grid">
          <Reveal>
            <SectionTag>Our Mission</SectionTag>
            <p className="mission-quote">&ldquo;Delivering local lekkerness to every South African table since 1998.&rdquo;</p>
          </Reveal>
          <Reveal>
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.t} className="value-card">
                  <div className="value-card-icon"><Icon strokeWidth={1.75} /></div>
                  <div className="value-card-title">{v.t}</div>
                  <p className="value-card-body">{v.b}</p>
                </div>
              );
            })}
          </Reveal>
        </div>
      </Section>

      <Section variant="warm">
        <Reveal>
          <SectionHead
            eyebrow="Our Journey"
            title={<>25 Years of <span className="accent">Lekkerness</span></>}
          />
        </Reveal>
        <div className="timeline">
          {MILESTONES.map((m) => (
            <Reveal key={m.y} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-year">{m.y}</div>
              <p className="timeline-text">{m.t}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section variant="white">
        <Reveal>
          <SectionHead
            eyebrow="What We Stand For"
            title={<>The <span className="accent">Golden</span> Values</>}
          />
        </Reveal>
        <div className="grid-4">
          {ROW_VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.t} className="value-card value-card--center">
                <div className="value-card-icon"><Icon strokeWidth={1.75} /></div>
                <div className="value-card-title">{v.t}</div>
                <p className="value-card-body">{v.b}</p>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <div className="stats-bar">
        <div><div className="stats-bar-num">{stats.years}</div><div className="stats-bar-label">Years</div></div>
        <div><div className="stats-bar-num">{stats.ranges}</div><div className="stats-bar-label">Ranges</div></div>
        <div><div className="stats-bar-num">{stats.provinces}</div><div className="stats-bar-label">Provinces</div></div>
        <div><div className="stats-bar-num">{stats.families}</div><div className="stats-bar-label">Families</div></div>
      </div>
    </>
  );
}
