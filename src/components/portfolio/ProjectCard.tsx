"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FaGithub } from "react-icons/fa6";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string | null;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  index?: number;
}

export default function ProjectCard({
  title,
  description,
  imageUrl,
  techStack,
  githubUrl,
  liveUrl,
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
      className="group rounded-xl border border-border bg-card overflow-hidden flex flex-col hover:border-primary/40 transition-colors"
    >
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized={imageUrl.startsWith("http")}
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3 pt-1">
          {githubUrl && (
            <Link href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <FaGithub className="w-3.5 h-3.5" /> Code
            </Link>
          )}
          {liveUrl && (
            <Link href={liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Live
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
