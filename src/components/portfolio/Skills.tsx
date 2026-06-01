"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  category: string;
  iconUrl: string | null;
}

export default function Skills({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] = acc[skill.category] ?? []).push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-4">Toolbox</p>
          <h2 className="text-3xl font-bold">Skills</h2>
        </motion.div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items], catIdx) => (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                {category}
              </p>
              <div className="flex flex-wrap gap-3">
                {items.map((skill, i) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (catIdx * 0.05) + (i * 0.04) }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors"
                  >
                    {skill.iconUrl && (
                      <Image
                        src={skill.iconUrl}
                        alt={skill.name}
                        width={18}
                        height={18}
                        unoptimized
                        className="w-4.5 h-4.5"
                      />
                    )}
                    <span className="text-sm text-foreground">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
