import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  await prisma.profile.deleteMany();
  await prisma.project.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.skill.deleteMany();

  await prisma.profile.create({
    data: {
      name: "Sai Tharun Aditya",
      headline: "Full-Stack Developer",
      bio: "I build scalable web applications with a focus on clean code and great user experience.\n\nPassionate about the full stack — from designing databases to crafting smooth UIs. When I'm not coding, I'm exploring new technologies and contributing to open source.",
      location: "United States",
      githubUrl: "https://github.com",
      linkedinUrl: "https://linkedin.com",
      twitterUrl: "https://twitter.com",
    },
  });

  await prisma.project.createMany({
    data: [
      {
        title: "Portfolio CMS",
        description: "A full-stack portfolio website with a built-in CMS admin panel. Built with Next.js, PostgreSQL, and Prisma.",
        techStack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Tailwind CSS"],
        featured: true,
        order: 0,
      },
      {
        title: "Project Alpha",
        description: "Description of your second project. Replace this with real details.",
        techStack: ["React", "Node.js", "MongoDB"],
        featured: false,
        order: 1,
      },
    ],
  });

  await prisma.experience.create({
    data: {
      company: "Your Company",
      role: "Software Engineer",
      startDate: new Date("2023-01-01"),
      current: true,
      description: "Working on full-stack web applications.",
      bullets: [
        "Built and maintained scalable APIs with Node.js",
        "Led frontend development using React and TypeScript",
        "Improved deployment pipeline reducing build time by 40%",
      ],
      order: 0,
    },
  });

  await prisma.education.create({
    data: {
      institution: "Your University",
      degree: "B.Tech",
      field: "Computer Science",
      startDate: new Date("2019-08-01"),
      endDate: new Date("2023-05-01"),
      order: 0,
    },
  });

  const skills = [
    { name: "TypeScript", category: "Language", order: 0 },
    { name: "JavaScript", category: "Language", order: 1 },
    { name: "Python", category: "Language", order: 2 },
    { name: "Go", category: "Language", order: 3 },
    { name: "React", category: "Frontend", order: 0 },
    { name: "Next.js", category: "Frontend", order: 1 },
    { name: "Tailwind CSS", category: "Frontend", order: 2 },
    { name: "Node.js", category: "Backend", order: 0 },
    { name: "Express", category: "Backend", order: 1 },
    { name: "PostgreSQL", category: "Database", order: 0 },
    { name: "Prisma", category: "Database", order: 1 },
    { name: "MongoDB", category: "Database", order: 2 },
    { name: "Docker", category: "DevOps", order: 0 },
    { name: "AWS", category: "Cloud", order: 0 },
    { name: "Vercel", category: "Cloud", order: 1 },
    { name: "Cloudflare Workers", category: "Cloud", order: 2 },
    { name: "Git", category: "Tools", order: 0 },
  ];

  await prisma.skill.createMany({ data: skills });

  console.log("Seed complete ✓");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
