export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMins: number;
  body: string[];
};

export const posts: BlogPost[] = [
  {
    slug: "why-clinics-need-a-medical-grade-website",
    title: "Why clinics need a medical-grade website",
    excerpt:
      "A practice site should do more than look presentable — it should support booking, trust and day-to-day care.",
    category: "MGW",
    date: "2026-03-12",
    readMins: 5,
    body: [
      "Many clinics still treat their website as a brochure: hours, an address and a phone number. Patients expect more. They want to understand services, meet the doctor, and book without friction.",
      "A medical-grade website ties those moments together on a domain the practice owns. Booking, follow-up and professional presence sit in one place — not rented listings beside competitors.",
      "When the front desk and the public site share the same system, handoffs stay cleaner. That is the standard MGW is built around: healthcare workflows first, marketing second.",
    ],
  },
  {
    slug: "what-patients-notice-before-they-call",
    title: "What patients notice before they call",
    excerpt:
      "Clarity, credibility and easy next steps decide whether a visitor becomes a patient — often in under a minute.",
    category: "Practice",
    date: "2026-02-18",
    readMins: 4,
    body: [
      "Before a patient dials, they scan for signals: Is this practice real? Are services clear? Can I take the next step without hunting?",
      "Weak copy, outdated photos and buried contact details cost appointments. Strong structure — services, doctor profile, booking — lowers hesitation.",
      "Treat the first viewport like a front desk: calm, specific and ready to help. That is how online presence supports care, not just branding.",
    ],
  },
  {
    slug: "labs-run-better-when-orders-and-reports-connect",
    title: "Labs run better when orders and reports connect",
    excerpt:
      "Disconnected tools create handoff gaps. One record for orders, stock, billing and reports keeps the lab moving as one workflow.",
    category: "LARIS",
    date: "2026-01-28",
    readMins: 6,
    body: [
      "Laboratory work depends on reliable handoffs. When registration, samples, results and billing live in separate places, gaps show up as delays and unclear accounts.",
      "Connecting those steps on one record reduces rework. Staff see where a sample is, what was billed, and what the report status is — without chasing notebooks or chats.",
      "LARIS is designed for that continuity: lab ERP that treats the day as one workflow, not a pile of tools.",
    ],
  },
  {
    slug: "keeping-judgment-with-the-physician",
    title: "Keeping judgment with the physician",
    excerpt:
      "Clinical AI should reduce documentation load without taking decisions away from the doctor.",
    category: "IntelliSist",
    date: "2025-12-09",
    readMins: 5,
    body: [
      "Documentation pulls attention away from the patient. Assistive tools help when they structure notes and surface concerns — and stay out of the way when judgment is required.",
      "The right stance is clear: the physician decides. Technology supports listening and recording so more of the visit stays a real conversation.",
      "That is the design intent behind IntelliSist — an AI clinical assistant built for everyday care, with clinical authority left where it belongs.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
