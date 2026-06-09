"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, ExternalLink, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CertificationEntry {
  id: string;
  title: string;
  provider: string;
  issuedDate: Date | null;
  expiresDate: Date | null;
  credentialId: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
}

export default function Certifications({ certifications }: { certifications: CertificationEntry[] }) {
  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-4">Credentials</p>
          <h2 className="text-3xl font-bold">Certifications</h2>
        </motion.div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((cert, i) => (
            <motion.li
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-5 rounded-xl border border-border bg-card flex flex-col gap-4"
            >
              <div className="flex items-start gap-3">
                {cert.imageUrl ? (
                  <Image
                    src={cert.imageUrl}
                    alt={cert.title}
                    width={44}
                    height={44}
                    unoptimized={cert.imageUrl.startsWith("http")}
                    className="rounded-md object-contain shrink-0 border border-border bg-background"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm leading-snug text-foreground">{cert.title}</h3>
                  <p className="text-xs text-primary mt-0.5">{cert.provider}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground mt-auto">
                {cert.issuedDate && (
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Issued {formatDate(cert.issuedDate)}
                      {cert.expiresDate ? ` · Expires ${formatDate(cert.expiresDate)}` : " · No expiry"}
                    </span>
                  </div>
                )}
                {cert.credentialId && (
                  <p className="font-mono text-[11px]">ID: {cert.credentialId}</p>
                )}
              </div>

              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Credential
                </a>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
