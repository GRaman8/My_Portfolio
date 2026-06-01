"use client";

import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate: Date | null;
  gpa: string | null;
}

export default function Education({ educations }: { educations: EducationEntry[] }) {
  if (educations.length === 0) return null;

  return (
    <section id="education" className="px-6 py-24 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-4">Background</p>
          <h2 className="text-3xl font-bold">Education</h2>
        </motion.div>

        <ul className="grid sm:grid-cols-2 gap-6">
          {educations.map((edu, i) => (
            <motion.li
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{edu.institution}</h3>
                  <p className="text-sm text-primary">
                    {edu.degree} in {edu.field}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono">
                  {formatDate(edu.startDate)} — {edu.endDate ? formatDate(edu.endDate) : "Present"}
                </span>
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
