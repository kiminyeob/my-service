/** 선 아이콘 모음 (24px 격자, currentColor). 장식용이면 aria-hidden, 의미가 있으면 label을 넘깁니다. */

const paths = {
  filter: <path d="M4 5h16l-6 7.5V19l-4-2v-4.5z" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" />
    </>
  ),
  link: <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
  history: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5" />
      <path d="M3.5 4v4.5H8M12 7.5V12l3 2" />
    </>
  ),
  book: <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" />,
  scale: <path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z" />,
  bell: <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />,
  flag: <path d="M5 21V4M5 4h11l-2 4 2 4H5" />,
  chevronDown: <polyline points="6,9 12,15 18,9" />,
  arrowLeft: <path d="M19 12H5M11 6l-6 6 6 6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  play: <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <polyline points="5,12.5 10,17 19,7.5" />,
  upload: <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />,
  apple: (
    <path d="M16.5 13.2c0-2.3 1.9-3.4 2-3.5a4.3 4.3 0 0 0-3.4-1.8c-1.4-.2-2.8.8-3.5.8s-1.8-.8-3-.8A4.4 4.4 0 0 0 5 10.2c-1.6 2.8-.4 6.9 1.1 9.1.8 1.1 1.7 2.3 2.8 2.2 1.1 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.7-2.2a9 9 0 0 0 1.2-2.5 3.9 3.9 0 0 1-2.3-3.6zM14.3 6.4A4 4 0 0 0 15.2 3.5a4.1 4.1 0 0 0-2.7 1.4 3.8 3.8 0 0 0-.9 2.8 3.4 3.4 0 0 0 2.7-1.3z" />
  ),
  android: (
    <>
      <path d="M5 10.5a7 7 0 0 1 14 0V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
      <path d="M8 4.5 9.5 7M16 4.5 14.5 7" />
      <circle cx="9.5" cy="10.5" r=".6" fill="currentColor" />
      <circle cx="14.5" cy="10.5" r=".6" fill="currentColor" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

type Props = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
};

export default function Icon({ name, size = 20, strokeWidth = 2, label, className }: Props) {
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...a11y}
    >
      {paths[name]}
    </svg>
  );
}
