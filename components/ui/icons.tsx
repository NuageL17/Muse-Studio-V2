/**
 * Muse. — Icônes trait fin 1.5px (24x24)
 */
import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  style?: React.CSSProperties;
}

function makeIcon(path: string | string[]) {
  return (props: IconProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {Array.isArray(path) ? path.map((p, i) => <path key={i} d={p} />) : <path d={path} />}
    </svg>
  );
}

export const IconHome = makeIcon("M3 9.5L12 3 21 9.5V20a1 1 0 0 1-1 1h-5v-5H9v5H4a1 1 0 0 1-1-1z");
export const IconCalendar = makeIcon(["M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2", "M9 1h6v3H9"]);
export const IconSprinkler = makeIcon("M12 2.5C8.5 2.5 6 5.5 6 9.5c0 4 6 7.5 6 7.5s6-3.5 6-7.5C18 5.5 15.5 2.5 12 2.5z");
export const IconFolder = makeIcon("M2 6a2 2 0 0 1 2-2h7l3 2h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z");
export const IconTeam = makeIcon(["M16 21v-2a4 4 0 0 0-3.83-4M9 21v-2a4 4 0 0 1 3.83-4", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"]);
export const IconClients = makeIcon(["M12 11c2.7 0 8 1.34 8 4v3H4v-3c0-2.66 5.3-4 8-4z", "M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]);
export const IconWallet = makeIcon(["M2 5h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z", "M2 5V3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2", "M6 10h12v4H6z"]);
export const IconClock = makeIcon(["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z", "M12 8v5l3 3"]);
export const IconBell = makeIcon(["M18 8a6 6 0 0 0-12 0c0 4-3 5-3 7h12s-3-3-3-7", "M13.73 21a2 2 0 0 1-3.46 0"]);
export const IconProfile = makeIcon(["M12 11c2.7 0 8 1.34 8 4v3H4v-3c0-2.66 5.3-4 8-4z", "M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"]);
export const IconStar = makeIcon("M12 2l3 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7-5.5-4h7z");
export const IconSparkle = makeIcon("M12 3l2 6h6l-4 4 2 6-6-4-6 4 2-6-4-4h6z");
export const IconLogout = makeIcon(["M15 3h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2", "M15 12h-6", "M12 9l3 3-3 3"]);
export const IconArrowRight = makeIcon(["M5 12h14", "M12 5l7 7-7 7"]);
