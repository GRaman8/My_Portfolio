import { FaGithub, FaLinkedin, } from "react-icons/fa6";
import { TbBrandLeetcode } from "react-icons/tb"
import { Mail } from "lucide-react";

interface FooterProps {
  name: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  leetcodeUrl?: string | null;
  email?: string | null;
}

export default function Footer({ name, githubUrl, linkedinUrl, leetcodeUrl, email }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="px-6 py-12 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {year} {name}. Built with Next.js.
        </p>
        <div className="flex items-center gap-4">
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <FaGithub className="w-4 h-4" />
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <FaLinkedin className="w-4 h-4" />
            </a>
          )}
          {leetcodeUrl && (
            <a href={leetcodeUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <TbBrandLeetcode className="w-4 h-4" />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
