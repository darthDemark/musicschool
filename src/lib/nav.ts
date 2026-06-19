import {
  LayoutDashboard,
  GraduationCap,
  Ear,
  Headphones,
  FlaskConical,
  Dna,
  Anchor,
  PenLine,
  BookMarked,
  Music4,
  Library,
  BookOpenText,
  Bot,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group: "Learn" | "Analyze" | "Create" | "Library" | "System";
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, group: "Learn" },
  { label: "Theory Academy", href: "/theory", icon: GraduationCap, group: "Learn" },
  { label: "Ear Training", href: "/ear-training", icon: Ear, group: "Learn" },
  { label: "Listening Curriculum", href: "/listening", icon: Headphones, group: "Learn" },
  { label: "Hit Lab", href: "/hit-lab", icon: FlaskConical, group: "Analyze" },
  { label: "Song Genome", href: "/song-genome", icon: Dna, group: "Analyze" },
  { label: "Hook Lab", href: "/hook-lab", icon: Anchor, group: "Create" },
  { label: "Writer's Room", href: "/writers-room", icon: PenLine, group: "Create" },
  { label: "Rhyme Vault", href: "/rhyme-vault", icon: BookMarked, group: "Create" },
  { label: "Composition Lab", href: "/composition-lab", icon: Music4, group: "Create" },
  { label: "Song Vault", href: "/song-vault", icon: Library, group: "Library" },
  { label: "Composer's Library", href: "/composers", icon: BookOpenText, group: "Library" },
  { label: "AI Tutor", href: "/ai-tutor", icon: Bot, group: "System" },
  { label: "Settings", href: "/settings", icon: Settings, group: "System" },
];
