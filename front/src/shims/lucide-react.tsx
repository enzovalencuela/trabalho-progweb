import type { SVGProps, ReactNode } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

const baseProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.75,
  viewBox: "0 0 24 24",
};

const createIcon = (paths: ReactNode) => {
  const Icon = ({ size = 24, ...props }: IconProps) => (
    <svg {...baseProps} width={size} height={size} {...props}>
      {paths}
    </svg>
  );

  return Icon;
};

export const Search = createIcon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </>
);

export const ShoppingBag = createIcon(
  <>
    <path d="M6 8h12l-1 11H7L6 8Z" />
    <path d="M9 8a3 3 0 0 1 6 0" />
  </>
);

export const UserRound = createIcon(
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 19a7 7 0 0 1 14 0" />
  </>
);

export const User = UserRound;

export const Menu = createIcon(
  <>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </>
);

export const X = createIcon(
  <>
    <path d="m6 6 12 12" />
    <path d="m18 6-12 12" />
  </>
);

export const LayoutDashboard = createIcon(
  <>
    <rect x="3" y="3" width="8" height="8" rx="2" />
    <rect x="13" y="3" width="8" height="5" rx="2" />
    <rect x="13" y="10" width="8" height="11" rx="2" />
    <rect x="3" y="13" width="8" height="8" rx="2" />
  </>
);

export const LogOut = createIcon(
  <>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </>
);

export const Package = createIcon(
  <>
    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
    <path d="m4 7.5 8 4.5 8-4.5" />
    <path d="M12 12v9" />
  </>
);

export const ArrowRight = createIcon(
  <>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </>
);

export const Home = createIcon(
  <>
    <path d="m3 11 9-7 9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M10 20v-6h4v6" />
  </>
);

export const Grid2X2 = createIcon(
  <>
    <rect x="4" y="4" width="6" height="6" rx="1.5" />
    <rect x="14" y="4" width="6" height="6" rx="1.5" />
    <rect x="4" y="14" width="6" height="6" rx="1.5" />
    <rect x="14" y="14" width="6" height="6" rx="1.5" />
  </>
);

export const Sparkles = createIcon(
  <>
    <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
    <path d="m5 16 .8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16Z" />
  </>
);

export const Tag = createIcon(
  <>
    <path d="M20 10 10 20 4 14 14 4h5l1 1v5Z" />
    <circle cx="16.5" cy="7.5" r="1" />
  </>
);

export const ShieldCheck = createIcon(
  <>
    <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
    <path d="m9.5 12 1.8 1.8L15 10" />
  </>
);

export const Truck = createIcon(
  <>
    <path d="M3 7h11v8H3Z" />
    <path d="M14 10h3l3 3v2h-6" />
    <circle cx="7.5" cy="17.5" r="1.5" />
    <circle cx="17.5" cy="17.5" r="1.5" />
  </>
);

export const Zap = createIcon(<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />);

export const BadgeCheck = createIcon(
  <>
    <path d="M12 3 8.5 5H5v4l-2 3 2 3v4h3.5L12 21l3.5-2H19v-4l2-3-2-3V5h-3.5L12 3Z" />
    <path d="m9.5 12 1.8 1.8L15 10" />
  </>
);

export const Wallet = createIcon(
  <>
    <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    <path d="M16 12h5" />
    <circle cx="16" cy="12" r="1" />
  </>
);

export const CreditCard = createIcon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18" />
  </>
);

export const Clock3 = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>
);

export const BarChart3 = createIcon(
  <>
    <path d="M4 20V10" />
    <path d="M10 20V4" />
    <path d="M16 20v-7" />
    <path d="M22 20v-4" />
  </>
);

export const Monitor = createIcon(
  <>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8" />
    <path d="M12 16v4" />
  </>
);

export const Github = createIcon(
  <>
    <path d="M9 18c-4 1.5-4-2-6-2" />
    <path d="M15 22v-3.9c0-1.2.1-2-.5-2.7 2.6-.3 5.5-1.3 5.5-6A4.7 4.7 0 0 0 18.7 6c.1-.3.5-1.5-.1-3-1 0-2 .7-3 1.4a10.4 10.4 0 0 0-5.2 0C9.4 3.7 8.4 3 7.4 3c-.6 1.5-.2 2.7-.1 3A4.7 4.7 0 0 0 6 9.4c0 4.7 2.9 5.7 5.5 6-.6.7-.6 1.6-.5 2.7V22" />
  </>
);

export const Instagram = createIcon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" />
  </>
);

export const Linkedin = createIcon(
  <>
    <rect x="4" y="9" width="4" height="11" />
    <circle cx="6" cy="5" r="1.5" />
    <path d="M12 20v-6a3 3 0 1 1 6 0v6" />
    <path d="M12 9v11" />
  </>
);
