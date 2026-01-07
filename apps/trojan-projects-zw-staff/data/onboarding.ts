export interface OnboardingSlide {
  title: string;
  description: string;
  icon: string;
  highlight: string;
}

export const staffOnboardingSlides: OnboardingSlide[] = [
  {
    title: "Welcome to Trojan Projects Staff Hub",
    description: "Your all-in-one platform for managing projects, quotations, and customer communications. Built for field technicians, support staff, and administrators.",
    icon: "Briefcase",
    highlight: "Streamlined Operations",
  },
  {
    title: "Real-Time Project Management",
    description: "Track active installations, update project status, upload photos, and communicate with the team - all from your mobile device in the field.",
    icon: "FolderKanban",
    highlight: "Stay Connected on the Go",
  },
  {
    title: "Quick Quote Generation",
    description: "Create professional quotations instantly. Access service pricing, add line items, and send quotes directly to customers from the app.",
    icon: "FileText",
    highlight: "Faster Response Times",
  },
  {
    title: "AI-Powered Support Chat",
    description: "Get instant answers about products, pricing, and technical specs. Your AI assistant helps you provide better customer service.",
    icon: "MessageSquare",
    highlight: "Expert Knowledge at Your Fingertips",
  },
];

export const roleDescriptions = {
  admin: "Full system access including user management, analytics, and all operational features.",
  staff: "Field technician access for project updates, photo uploads, and customer communications.",
  support: "Customer service access for quote generation, inquiries, and basic project tracking.",
};
