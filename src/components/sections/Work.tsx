import { ArrowUpRight } from "lucide-react";
import { Section } from "../ui";
import FeaturedProjectCard from "../work/FeaturedProjectCard";
import ProjectList from "../work/ProjectList";
import { featuredProjects, moreProjects } from "../../data/projects";
import { contact } from "../../data/profile";
import type { Dictionary, Locale } from "../../i18n";

export default function Work({ copy, locale }: { copy: Dictionary["work"]; locale: Locale }) {
  const besideCard = featuredProjects.length % 2 === 1;
  const more = (
    <>
      <ProjectList
        projects={moreProjects}
        offset={featuredProjects.length}
        locale={locale}
        title={copy.more}
        compact={besideCard}
      />
      <a
        href={contact.github}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-8 inline-flex min-h-11 items-center gap-2 eyebrow text-ink focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
      >
        {copy.github}
        <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </>
  );

  return (
    <Section
      id="work"
      index="03"
      eyebrow={copy.eyebrow}
      title={{ before: copy.titleBefore, accent: copy.titleAccent, after: copy.titleAfter }}
      intro={copy.intro}
    >
      {/* Staggered two-column rhythm: the right column sits lower, like a spread.
          With an odd number of cards the list takes the free right-hand slot. */}
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-16">
        {featuredProjects.map((project, i) => (
          <FeaturedProjectCard
            key={project.slug}
            project={project}
            index={i}
            locale={locale}
            imageLabel={copy.image}
            className={i % 2 === 1 ? "lg:translate-y-32" : ""}
          />
        ))}
        {besideCard && <div className="mt-18 lg:mt-0 lg:translate-y-32">{more}</div>}
      </div>

      {!besideCard && (
        <div className="mt-24 grid gap-10 lg:mt-56 lg:grid-cols-12">
          <div className="lg:col-span-9 lg:col-start-4">{more}</div>
        </div>
      )}
    </Section>
  );
}
