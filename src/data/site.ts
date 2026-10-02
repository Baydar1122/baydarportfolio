export interface SiteConfig {
  name: string;
  role: string;
  tagline: string;
  valueStatement: string;
  institution: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  gdgTarget: string;
  aboutText: string[];
  education: {
    degree: string;
    institution: string;
    location: string;
  };
  experience: Array<{
    title: string;
    organization: string;
    period: string;
    description: string;
    highlights: string[];
  }>;
  community: Array<{
    title: string;
    organization: string;
    description: string;
  }>;
}

export const siteConfig: SiteConfig = {
  name: "Baydar Ahmed",
  role: "Full-Stack Engineer & Founder",
  tagline: "Computer Science Student at IST Islamabad & Founder of Zyphr Labs.",
  valueStatement: "Building fast, accessible web software and mentoring developer communities through open-source tooling and technical advocacy.",
  institution: "Institute of Space Technology (IST), Islamabad",
  location: "Islamabad, Pakistan",
  email: "bbaidar128@gmail.com",
  github: "https://github.com/Baydar1122",
  linkedin: "https://www.linkedin.com/in/baydar-ahmed-ba0530394",
  gdgTarget: "",
  aboutText: [
    "I am an undergraduate Computer Science student at the Institute of Space Technology (IST), Islamabad, focusing on front-end software engineering, type-safe web systems, and developer community building.",
    "Beyond academic projects, I founded Zyphr Labs—a digital web agency where I architect custom client platforms and share modern web development best practices.",
    "My goal is to bridge complex technical concepts with clear documentation, open-source projects, and collaborative developer workshops."
  ],
  education: {
    degree: "B.S. Computer Science",
    institution: "Institute of Space Technology (IST)",
    location: "Islamabad, Pakistan"
  },
  experience: [
    {
      title: "Founder & Lead Engineer",
      organization: "Zyphr Labs",
      period: "2026 — Present",
      description: "Founded a digital agency delivering client-tailored web applications, user interfaces, and structured software architecture.",
      highlights: [
        "Architected custom web applications using modern TypeScript and React stacks.",
        "Established component guidelines, code review standards, and developer workflows.",
        "Collaborated directly with clients to translate business constraints into production code."
      ]
    }
  ],
  community: []
};
