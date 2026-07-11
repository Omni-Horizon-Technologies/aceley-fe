import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Deck, StudyCard } from "@/app/lib/data";

type IconName =
  | "arrowLeft"
  | "arrowUp"
  | "dashboard"
  | "create"
  | "profile"
  | "home"
  | "spaces"
  | "progress"
  | "mail"
  | "google"
  | "apple"
  | "lock"
  | "check"
  | "x"
  | "notes"
  | "upload"
  | "scan"
  | "camera"
  | "image"
  | "study"
  | "play"
  | "pause"
  | "reset"
  | "edit"
  | "delete"
  | "file"
  | "paperclip"
  | "chat"
  | "pencil"
  | "target"
  | "warning"
  | "bolt"
  | "chevronRight"
  | "calendar"
  | "flame"
  | "bookmark"
  | "medal"
  | "search"
  | "school"
  | "book"
  | "clock"
  | "brain"
  | "music"
  | "spark";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),
    arrowUp: (
      <>
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </>
    ),
    dashboard: (
      <>
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3Z" />
        <path d="M14 4h4a2 2 0 0 1 2 2v2" />
        <path d="M14 10h6" />
        <path d="M4 15h16" />
        <path d="M4 20h11" />
      </>
    ),
    create: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    profile: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    home: (
      <>
        <path d="m4 11 8-7 8 7" />
        <path d="M6 10v10h12V10" />
        <path d="M10 20v-6h4v6" />
      </>
    ),
    spaces: (
      <>
        <path d="M4 7h7v7H4V7Z" />
        <path d="M13 5h7v7h-7V5Z" />
        <path d="M9 16h7v5H9v-5Z" />
      </>
    ),
    progress: (
      <>
        <path d="M5 19V9" />
        <path d="M12 19V5" />
        <path d="M19 19v-7" />
      </>
    ),
    mail: (
      <>
        <path d="M4 6h16v12H4V6Z" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    google: (
      <>
        <path d="M20.5 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h4.8a4.1 4.1 0 0 1-1.8 2.7v2.2h3a8.8 8.8 0 0 0 2.5-6.6Z" />
        <path d="M12 21c2.4 0 4.5-.8 6-2.2l-3-2.2c-.8.5-1.8.9-3 .9a5.2 5.2 0 0 1-4.9-3.6H4v2.3A9 9 0 0 0 12 21Z" />
        <path d="M7.1 13.9a5.4 5.4 0 0 1 0-3.8V7.8H4a9 9 0 0 0 0 8.4l3.1-2.3Z" />
        <path d="M12 6.5c1.3 0 2.5.5 3.5 1.4L18.1 5A8.8 8.8 0 0 0 12 3a9 9 0 0 0-8 4.8l3.1 2.3A5.2 5.2 0 0 1 12 6.5Z" />
      </>
    ),
    apple: (
      <>
        <path d="M16 3c-.9.1-1.8.7-2.3 1.4-.5.6-.8 1.5-.7 2.3.9 0 1.8-.5 2.4-1.2.6-.7.8-1.5.6-2.5Z" />
        <path d="M19 15.7c-.4 1-1.8 3.7-3.3 3.8-.8 0-1.1-.5-2.1-.5s-1.4.5-2.2.5c-1.5-.1-2.7-2.4-3.3-3.7-1.2-2.6-1.3-5.6.6-7.2.9-.8 2.1-1.1 3.2-1.1.9 0 1.8.6 2.1.6.3 0 1.4-.7 2.5-.6.5 0 2 .2 2.9 1.6-2.5 1.4-2.1 5 .6 6.6Z" />
      </>
    ),
    lock: (
      <>
        <path d="M7 11V8a5 5 0 0 1 10 0v3" />
        <path d="M6 11h12v9H6v-9Z" />
      </>
    ),
    check: (
      <>
        <path d="M20 6 9 17l-5-5" />
      </>
    ),
    x: (
      <>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </>
    ),
    notes: (
      <>
        <path d="M7 4h8l4 4v12H7V4Z" />
        <path d="M15 4v4h4" />
        <path d="M10 12h6" />
        <path d="M10 16h5" />
      </>
    ),
    upload: (
      <>
        <path d="M12 15V4" />
        <path d="m8 8 4-4 4 4" />
        <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3" />
      </>
    ),
    scan: (
      <>
        <path d="M5 8V5h3" />
        <path d="M16 5h3v3" />
        <path d="M19 16v3h-3" />
        <path d="M8 19H5v-3" />
        <path d="M8 12h8" />
      </>
    ),
    camera: (
      <>
        <path d="M5 7h3l1.5-2h5L16 7h3v12H5V7Z" />
        <path d="M12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      </>
    ),
    image: (
      <>
        <path d="M5 5h14v14H5V5Z" />
        <path d="m5 16 4-4 3 3 2-2 5 5" />
        <path d="M15 9h.01" />
      </>
    ),
    study: (
      <>
        <path d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v15H7.5A2.5 2.5 0 0 0 5 20.5v-15Z" />
        <path d="M5 5.5A2.5 2.5 0 0 1 2.5 3H4a1 1 0 0 1 1 1v16.5" />
      </>
    ),
    play: <path d="M8 5v14l11-7-11-7Z" />,
    pause: (
      <>
        <path d="M8 5v14" />
        <path d="M16 5v14" />
      </>
    ),
    reset: (
      <>
        <path d="M4 12a8 8 0 1 0 2.3-5.7" />
        <path d="M4 5v5h5" />
      </>
    ),
    edit: (
      <>
        <path d="M5 19h4l10-10-4-4L5 15v4Z" />
        <path d="m14 6 4 4" />
      </>
    ),
    delete: (
      <>
        <path d="M5 7h14" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M7 7l1 13h8l1-13" />
        <path d="M9 7V4h6v3" />
      </>
    ),
    file: (
      <>
        <path d="M7 4h7l5 5v11H7V4Z" />
        <path d="M14 4v5h5" />
      </>
    ),
    paperclip: (
      <>
        <path d="m21 11-8.5 8.5a5 5 0 0 1-7-7L14 4a3.3 3.3 0 0 1 4.7 4.7l-8.4 8.4a1.7 1.7 0 0 1-2.4-2.4L16 6.6" />
      </>
    ),
    chat: (
      <>
        <path d="M5 6h14v9H8l-3 3V6Z" />
        <path d="M8 10h8" />
        <path d="M8 13h5" />
      </>
    ),
    pencil: (
      <>
        <path d="M5 19h4l10-10-4-4L5 15v4Z" />
        <path d="m14 6 4 4" />
      </>
    ),
    target: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
        <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </>
    ),
    warning: (
      <>
        <path d="M12 4 3 20h18L12 4Z" />
        <path d="M12 9v5" />
        <path d="M12 17h.01" />
      </>
    ),
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    calendar: (
      <>
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4 8h16" />
        <path d="M5 5h14v16H5V5Z" />
      </>
    ),
    flame: (
      <>
        <path d="M12 21c4 0 7-2.7 7-6.7 0-2.8-1.5-4.9-3.6-6.6.1 1.6-.5 2.7-1.6 3.5.2-3.1-1.4-5.6-4-7.2.1 3.2-1.9 4.6-3.3 6.4A6.2 6.2 0 0 0 5 14.3C5 18.3 8 21 12 21Z" />
      </>
    ),
    bookmark: (
      <>
        <path d="M7 4h10v17l-5-3-5 3V4Z" />
      </>
    ),
    medal: (
      <>
        <path d="m8 3 4 6 4-6" />
        <path d="M12 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
        <path d="M12 15v2" />
      </>
    ),
    search: (
      <>
        <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
        <path d="m16 16 4 4" />
      </>
    ),
    school: (
      <>
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 12v4c2.5 2 7.5 2 10 0v-4" />
      </>
    ),
    book: (
      <>
        <path d="M5 4h10a4 4 0 0 1 4 4v12H8a3 3 0 0 0-3 3V4Z" />
        <path d="M5 4v16" />
      </>
    ),
    clock: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    brain: (
      <>
        <path d="M9 5a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 5 2.2V5.8A3 3 0 0 0 9 5Z" />
        <path d="M15 5a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-5 2.2V5.8A3 3 0 0 1 15 5Z" />
      </>
    ),
    music: (
      <>
        <path d="M9 18V6l10-2v12" />
        <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M16 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        <path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

const brandLogoSrc = "/icons/icon-192.png";

export function BrandMark({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 text-lg font-bold tracking-tight",
        tone === "dark" ? "text-white" : "text-[#1E1B4B]",
      )}
    >
      <Image
        alt=""
        className="h-10 w-10 rounded-lg object-cover shadow-sm"
        height={40}
        priority
        src={brandLogoSrc}
        width={40}
      />
      <span>Aceley</span>
    </Link>
  );
}

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  href?: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export function PrimaryButton({
  children,
  disabled,
  href,
  className,
  onClick,
  type = "button",
}: ButtonProps) {
  const styles = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#FACC15] px-5 py-3 text-sm font-semibold text-[#1E1B4B] shadow-sm transition hover:bg-[#312E81] hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]/25",
    disabled && "cursor-not-allowed opacity-60 hover:bg-[#FACC15] hover:text-[#1E1B4B]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  disabled,
  href,
  className,
  onClick,
  type = "button",
}: ButtonProps) {
  const styles = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-5 py-3 text-sm font-semibold text-[#1E1B4B] shadow-sm transition hover:border-[#FACC15]/60 hover:text-[#CA8A04] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FACC15]/20",
    disabled && "cursor-not-allowed opacity-60 hover:border-[#E2E8F0] hover:text-[#1E1B4B]",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <button className={styles} disabled={disabled} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export function ProgressBar({
  value,
  label = "Progress",
}: {
  value: number;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div aria-label={`${label}: ${clamped}%`} className="h-2 w-full rounded-lg bg-[#E2E8F0]">
      <div
        className="h-full rounded-lg bg-[#312E81]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#CA8A04]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight text-[#1E1B4B] md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          {description}
        </p>
      </div>
      {action ? <div className="flex shrink-0">{action}</div> : null}
    </div>
  );
}

export function DeckCard({ deck }: { deck: Deck }) {
  return (
    <Link
      href={`/decks/${deck.slug}`}
      className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#FACC15]/50 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#CA8A04]">{deck.subject}</p>
          <h3 className="mt-2 text-lg font-bold text-[#1E1B4B]">{deck.title}</h3>
        </div>
        <span className="rounded-lg bg-[#F8FAFC] px-3 py-1 text-sm font-semibold text-[#312E81]">
          {deck.cards}
        </span>
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-500">Complete</span>
          <span className="font-bold text-[#1E1B4B]">{deck.progress}%</span>
        </div>
        <ProgressBar value={deck.progress} label={`${deck.title} progress`} />
        <p className="text-sm text-slate-500">Last studied {deck.lastStudied}</p>
      </div>
    </Link>
  );
}

export function QuickActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: IconName;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#312E81]/30 hover:shadow-md"
    >
      <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#312E81]/10 text-[#312E81] transition group-hover:bg-[#FACC15]/10 group-hover:text-[#CA8A04]">
        <Icon name={icon} />
      </span>
      <h3 className="mt-5 text-base font-bold text-[#1E1B4B]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </Link>
  );
}

export function InputField({
  label,
  placeholder,
  value,
}: {
  label: string;
  placeholder: string;
  value?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#1E1B4B]">{label}</span>
      <input
        className="mt-2 min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-[#1E1B4B] outline-none transition placeholder:text-slate-400 focus:border-[#312E81] focus:ring-4 focus:ring-[#312E81]/10"
        defaultValue={value}
        placeholder={placeholder}
      />
    </label>
  );
}

export function TextArea({
  label,
  placeholder,
  value,
}: {
  label: string;
  placeholder: string;
  value?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[#1E1B4B]">{label}</span>
      <textarea
        className="mt-2 min-h-52 w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-[#1E1B4B] outline-none transition placeholder:text-slate-400 focus:border-[#312E81] focus:ring-4 focus:ring-[#312E81]/10"
        defaultValue={value}
        placeholder={placeholder}
      />
    </label>
  );
}

export function DifficultySelector() {
  const levels = [
    {
      description: "Short, direct cards for quick recall.",
      label: "Easy",
      value: "easy",
    },
    {
      description: "A balanced mix for regular revision.",
      label: "Medium",
      value: "medium",
    },
    {
      description: "More detailed prompts for exam practice.",
      label: "Hard",
      value: "hard",
    },
  ];

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-[#1E1B4B]">
        Flashcard difficulty
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {levels.map((level) => (
          <label
            className="cursor-pointer rounded-lg border border-slate-200 bg-[#F8FAFC] p-4 transition has-[:checked]:border-[#312E81] has-[:checked]:bg-[#312E81]/10 has-[:checked]:ring-4 has-[:checked]:ring-[#312E81]/10"
            key={level.value}
          >
            <input
              className="sr-only"
              defaultChecked={level.value === "medium"}
              name="difficulty"
              type="radio"
              value={level.value}
            />
            <span className="text-sm font-black text-[#1E1B4B]">{level.label}</span>
            <span className="mt-2 block text-sm leading-6 text-slate-600">
              {level.description}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function UploadBox() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-[#FACC15]/10 text-[#CA8A04]">
        <Icon name="upload" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-[#1E1B4B]">Upload notes</h3>
      <p className="mt-1 text-sm text-slate-500">PDF, DOCX, TXT, or image notes</p>
      <SecondaryButton className="mt-5 w-full sm:w-auto">Choose File</SecondaryButton>
    </div>
  );
}

export function Flashcard({ card, index }: { card: StudyCard; index: number }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-[#312E81]">Card {index + 1}</span>
        <span className="rounded-lg bg-[#FACC15]/10 px-3 py-1 text-xs font-bold text-[#CA8A04]">
          {card.difficulty}
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Question
          </p>
          <p className="mt-2 text-sm leading-6 text-[#1E1B4B]">{card.question}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Answer
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{card.answer}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <SecondaryButton className="min-h-9 px-3 py-2">
          <Icon name="edit" className="h-4 w-4" />
          Edit
        </SecondaryButton>
        <SecondaryButton className="min-h-9 px-3 py-2">
          <Icon name="delete" className="h-4 w-4" />
          Delete
        </SecondaryButton>
      </div>
    </article>
  );
}

export function StudySummaryCard({
  label,
  value,
  tone = "indigo",
}: {
  label: string;
  value: string;
  tone?: "indigo" | "yellow" | "ink";
}) {
  const toneClass = {
    indigo: "bg-[#312E81]/10 text-[#312E81]",
    yellow: "bg-[#FACC15]/10 text-[#CA8A04]",
    ink: "bg-[#1E1B4B]/10 text-[#1E1B4B]",
  }[tone];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className={cn("mt-4 rounded-lg px-3 py-2 text-2xl font-black", toneClass)}>
        {value}
      </p>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-[#312E81]/10 text-[#312E81]">
        <Icon name="notes" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-[#1E1B4B]">No decks yet</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
        Your saved flashcard decks will appear here once you create your first
        study set.
      </p>
      <PrimaryButton href="/create" className="mt-5">
        Create Deck
      </PrimaryButton>
    </div>
  );
}

export function MockDashboardPreview() {
  return (
    <div className="mt-12 rounded-lg border border-white/20 bg-white p-4 shadow-2xl shadow-[#1E1B4B]/30">
      <div className="grid gap-4 lg:grid-cols-[0.78fr_1fr]">
        <div className="rounded-lg bg-[#F8FAFC] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#CA8A04]">
                Continue
              </p>
              <h3 className="mt-2 text-lg font-black text-[#1E1B4B]">
                Biology Revision
              </h3>
            </div>
            <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#312E81] shadow-sm">
              72%
            </span>
          </div>
          <div className="mt-6">
            <ProgressBar value={72} label="Preview progress" />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-2">
            {["Notes", "Upload", "Study"].map((item) => (
              <div
                className="rounded-lg border border-slate-200 bg-white p-3 text-center text-xs font-bold text-[#1E1B4B]"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-gradient-to-br from-[#312E81] to-[#1E1B4B] p-5 text-white">
          <div className="flex items-center justify-between text-sm font-semibold text-white/70">
            <span>Card 1 of 24</span>
            <span>Question</span>
          </div>
          <div className="mt-8 min-h-36 rounded-lg bg-white p-6 text-[#1E1B4B] shadow-lg">
            <p className="text-sm font-bold text-[#CA8A04]">Biology</p>
            <p className="mt-4 text-2xl font-black leading-tight">
              What is photosynthesis?
            </p>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["Hard", "Good", "Easy"].map((item) => (
              <div
                className="rounded-lg bg-white/10 px-3 py-2 text-center text-sm font-bold"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
