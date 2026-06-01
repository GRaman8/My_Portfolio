"use client";

import { motion } from "framer-motion";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section id="contact" className="px-6 py-24 bg-card/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary tracking-widest uppercase mb-4">Get In Touch</p>
          <h2 className="text-3xl font-bold">Contact</h2>
          <p className="text-muted-foreground mt-3 max-w-lg">
            Have a project in mind or want to chat? I&apos;d love to hear from you. Send me a message and I&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
