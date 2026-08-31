export interface Project {
  name: string;
  description: string;
  /** Omit for internal work that has no public URL. */
  href?: string;
  /** The domain it used to live at, for work whose site is gone. */
  formerDomain?: string;
  /** True when the work sits under Cloo GmbH rather than being a solo project. */
  cloo?: boolean;
  status: 'live' | 'internal' | 'archived';
}

/**
 * Hand-curated and rendered in this order: live work first, then internal
 * client work, then things that have been put down. The home page shows the
 * first three.
 */
export const PROJECTS: Project[] = [
  {
    name: 'Gorilla Gainz',
    description:
      'A calisthenics tracker built for the bar. Reps, added weight and hold times, progress from assisted to weighted, and live group sessions a crew joins by QR code. Works offline, because parks rarely have signal. On iOS, Android in progress.',
    href: 'https://gorillagainz.app',
    status: 'live',
  },
  {
    name: 'Diese Automaten',
    description:
      'A map of German farm and snack vending machines (eggs, milk, meat, potatoes, ice cream) with listings operators can register and maintain themselves. Started as a side project of mine and now runs under Cloo.',
    href: 'https://diese-automaten.de',
    cloo: true,
    status: 'live',
  },
  {
    name: 'Elterngeld Zentrum',
    description:
      'One-on-one advice on German parental allowance: working out the best income strategy, preparing the whole application, and staying on it until the money arrives.',
    href: 'https://elterngeld-zentrum.de',
    cloo: true,
    status: 'live',
  },
  {
    name: 'SLINA',
    description:
      'A research project with Sana. Clinical staff ask questions about patient records in plain language and get answers grounded in the records themselves.',
    cloo: true,
    status: 'internal',
  },
  {
    name: 'Zuweiser CRM',
    description:
      'An internal CRM for Sana that keeps track of referring physicians and the relationships the clinics maintain with them.',
    cloo: true,
    status: 'internal',
  },
  {
    name: 'elterngeld.app',
    description:
      'Elterngeld advice delivered entirely through an app: clients handled everything from their phone and asked follow-up questions in chat, while the case work ran on a CRM built for it.',
    href: 'https://elterngeld.app',
    cloo: true,
    status: 'archived',
  },
  {
    name: 'ColorpaletteAI',
    description:
      'Describe a vibe, get colour palettes back, exportable straight to CSS, Tailwind or Figma.',
    formerDomain: 'colorpaletteai.com',
    status: 'archived',
  },
  {
    name: 'Askible',
    description:
      'A B2B Discord bot. Companies loaded in their own FAQ, and their users could ask about it in plain language instead of digging through channels for an answer.',
    formerDomain: 'askiblebot.com',
    status: 'archived',
  },
];
