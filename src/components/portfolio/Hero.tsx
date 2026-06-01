"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Mail } from "lucide-react";

interface HeroProps {
  name: string;
  headline: string;
  bio: string;
  avatarUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  email?: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Hero({
  name,
  headline,
  bio,
  avatarUrl,
  githubUrl,
  linkedinUrl,
  twitterUrl,
  email,
}: HeroProps) {
  return (
    <section id="hero" className="min-h-screen flex items-center pt-16 px-6">
      <div className="max-w-5xl mx-auto w-full py-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col md:flex-row items-center md:items-start gap-12"
        >
          {avatarUrl && (
            <motion.div variants={fadeUp} className="shrink-0">
              <Image
                src={avatarUrl}
                alt={name}
                width={160}
                height={160}
                priority
                unoptimized={avatarUrl.startsWith("http")}
                className="rounded-full border-2 border-border object-cover w-36 h-36 md:w-40 md:h-40"
              />
            </motion.div>
          )}

          <div className="text-center md:text-left space-y-4">
            <motion.p variants={fadeUp} className="text-sm font-mono text-primary tracking-widest uppercase">
              Hi, I&apos;m
            </motion.p>

            <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {name}
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-muted-foreground font-light">
              {headline}
            </motion.p>

            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl leading-relaxed">
              {bio.slice(0, 200)}{bio.length > 200 ? "…" : ""}
            </motion.p>

            <motion.div variants={fadeUp} className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
              <a href="#projects" className={cn(buttonVariants())}>View Projects</a>
              <a href="#contact" className={cn(buttonVariants({ variant: "outline" }))}>Contact Me</a>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-4 justify-center md:justify-start">
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <FaGithub className="w-5 h-5" />
                </a>
              )}
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <FaXTwitter className="w-5 h-5" />
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
