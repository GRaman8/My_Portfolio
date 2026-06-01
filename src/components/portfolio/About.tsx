"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Mail, MapPin } from "lucide-react";

interface AboutProps {
  bio: string;
  location?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  email?: string | null;
}

export default function About({ bio, location, githubUrl, linkedinUrl, twitterUrl, email }: AboutProps) {
  return (
    <section id="about" className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-4">About Me</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-4">
              {bio.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed">{paragraph}</p>
              ))}
            </div>
            <div className="space-y-4">
              {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  {location}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <FaGithub className="w-4 h-4" /> GitHub
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <FaLinkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {twitterUrl && (
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <FaXTwitter className="w-4 h-4" /> Twitter
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
