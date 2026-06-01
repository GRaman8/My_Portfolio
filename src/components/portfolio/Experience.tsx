"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { formatDateRange } from "@/lib/utils";

interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  description: string | null;
  bullets: string[];
  logoUrl: string | null;
}

interface ExperienceProps {
  experiences: ExperienceEntry[];
}

export default function Experience({ experiences }: ExperienceProps) {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-4">Career</p>
          <h2 className="text-3xl font-bold">Experience</h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border hidden md:block" />

          <ul className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.li
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="md:pl-16 relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 top-1 w-3 h-3 rounded-full bg-primary border-2 border-background hidden md:block" />

                <div className="flex items-start gap-4">
                  {exp.logoUrl && (
                    <Image
                      src={exp.logoUrl}
                      alt={exp.company}
                      width={40}
                      height={40}
                      unoptimized={exp.logoUrl.startsWith("http")}
                      className="rounded-lg border border-border object-contain bg-card shrink-0 md:hidden"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-foreground">{exp.role}</h3>
                        <p className="text-sm text-primary">{exp.company}</p>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono shrink-0">
                        {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                    )}
                    {exp.bullets.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {exp.bullets.map((bullet, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
