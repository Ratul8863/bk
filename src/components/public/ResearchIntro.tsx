import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Section } from '@/components/ui/Section';

const INTRO = [
  'BK School of Research conducts evidence-based research across disciplines, including health and society, business and technology, public policy, and culture and social change.',
  'Our research portfolio spans funded national and international projects, as well as contract research undertaken on behalf of government bodies, NGOs, and development partners.',
  'Our work shapes policy and contributes to stronger, more resilient societies, bridging academic inquiry with public value.',
] as const;

/** Doc intro — eyebrow above; title left, body right, tops aligned. */
export function ResearchIntro() {
  return (
    <Section
      tone="white"
      spaced={false}
      className="border-b border-border py-12 md:py-16"
    >
      <Container>
        <Eyebrow>Overview</Eyebrow>

        <div className="mt-3 grid items-start gap-6 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
          <h2 className="max-w-md font-display text-[1.55rem] leading-[1.12] text-ink sm:text-[1.85rem] md:text-[2.35rem] lg:col-span-4">
            Research at BKSR
          </h2>

          <div className="space-y-5 lg:col-span-8">
            {INTRO.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="max-w-3xl text-[0.975rem] leading-[1.8] text-body sm:text-base sm:leading-[1.85]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
