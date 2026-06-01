"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  if (projects.length === 0) return null;

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const sorted = [...featured, ...rest];

  return (
    <section id="projects" className="px-6 py-24 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-4">Work</p>
          <h2 className="text-3xl font-bold">Projects</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((project, i) => (
            <ProjectCard key={project.id} {...project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
