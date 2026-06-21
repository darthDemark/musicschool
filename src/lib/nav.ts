import {
  Home,
  Compass,
  GraduationCap,
  Ear,
  Headphones,
  Anchor,
  PenLine,
  BookMarked,
  Lightbulb,
  Music4,
  Music2,
  Pencil,
  SlidersHorizontal,
  SlidersVertical,
  LayoutGrid,
  Layers,
  Waves,
  Mic,
  FlaskConical,
  Dna,
  Library,
  BookOpenText,
  Briefcase,
  Bot,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavGroup =
  | "Today"
  | "Learn"
  | "Create"
  | "Produce"
  | "Analyze"
  | "Library"
  | "System";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group: NavGroup;
}

export const groupOrder: NavGroup[] = [
  "Today",
  "Learn",
  "Create",
  "Produce",
  "Analyze",
  "Library",
  "System",
];

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home, group: "Today" },
  { label: "My Path", href: "/my-path", icon: Compass, group: "Today" },

  { label: "Music Theory", href: "/theory", icon: GraduationCap, group: "Learn" },
  { label: "Ear Training", href: "/ear-training", icon: Ear, group: "Learn" },
  { label: "Guided Listening", href: "/listening", icon: Headphones, group: "Learn" },

  { label: "Hook Lab", href: "/hook-lab", icon: Anchor, group: "Create" },
  { label: "Writer's Room", href: "/writers-room", icon: PenLine, group: "Create" },
  { label: "Rhyme Vault", href: "/rhyme-vault", icon: BookMarked, group: "Create" },
  { label: "Creativity", href: "/creativity", icon: Lightbulb, group: "Create" },
  { label: "Lyrics & Melody", href: "/lyrics-melody", icon: Music4, group: "Create" },
  { label: "Composition Lab", href: "/composition-lab", icon: Music2, group: "Create" },
  { label: "Sketchpad", href: "/sketchpad", icon: Pencil, group: "Create" },

  { label: "Production", href: "/production", icon: SlidersHorizontal, group: "Produce" },
  { label: "Beatmaking", href: "/beatmaking", icon: LayoutGrid, group: "Produce" },
  { label: "Arrangement", href: "/arrangement", icon: Layers, group: "Produce" },
  { label: "Sound Design", href: "/sound-design", icon: Waves, group: "Produce" },
  { label: "Recording", href: "/recording", icon: Mic, group: "Produce" },
  { label: "Mixing", href: "/mixing", icon: SlidersVertical, group: "Produce" },

  { label: "Hit Lab", href: "/hit-lab", icon: FlaskConical, group: "Analyze" },
  { label: "Song Genome", href: "/song-genome", icon: Dna, group: "Analyze" },

  { label: "Song Vault", href: "/song-vault", icon: Library, group: "Library" },
  { label: "The Masters", href: "/composers", icon: BookOpenText, group: "Library" },
  { label: "Music Business", href: "/music-business", icon: Briefcase, group: "Library" },

  { label: "AI Mentor", href: "/ai-tutor", icon: Bot, group: "System" },
  { label: "Settings", href: "/settings", icon: Settings, group: "System" },
];
