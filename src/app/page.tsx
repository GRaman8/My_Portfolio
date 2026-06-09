import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Navbar from "@/components/portfolio/Navbar";
import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Projects from "@/components/portfolio/Projects";
import Experience from "@/components/portfolio/Experience";
import Education from "@/components/portfolio/Education";
import Skills from "@/components/portfolio/Skills";
import Certifications from "@/components/portfolio/Certifications";
import Contact from "@/components/portfolio/Contact";
import Footer from "@/components/portfolio/Footer";

export default async function PortfolioPage() {
  const [profile, projects, experiences, educations, skills, certifications] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
    prisma.certification.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Portfolio not set up yet.</p>
          <a href="/admin" className="text-primary text-sm underline">
            Go to admin panel to get started →
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar resumeUrl={profile.resumeUrl} />
      <main>
        <Hero
          name={profile.name}
          headline={profile.headline}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
          githubUrl={profile.githubUrl}
          linkedinUrl={profile.linkedinUrl}
          leetcodeUrl={profile.leetcodeUrl}
          email={profile.email}
        />
        <About
          bio={profile.bio}
          location={profile.location}
          githubUrl={profile.githubUrl}
          linkedinUrl={profile.linkedinUrl}
          leetcodeUrl={profile.leetcodeUrl}
          email={profile.email}
        />
        <Skills skills={skills} />
        <Education educations={educations} />
        <Certifications certifications={certifications} />
        <Experience experiences={experiences} />
        <Projects projects={projects} />
        <Contact />
      </main>
      <Footer
        name={profile.name}
        githubUrl={profile.githubUrl}
        linkedinUrl={profile.linkedinUrl}
        leetcodeUrl={profile.leetcodeUrl}
        email={profile.email}
      />
    </>
  );
}
