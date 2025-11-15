interface EventsIconProps {
  isActive?: boolean;
}

export function EventsIcon({ isActive = false }: EventsIconProps) {
  const strokeColor = isActive ? "#007AFF" : "#999999";

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 8H26C27.1046 8 28 8.89543 28 10V24C28 25.1046 27.1046 26 26 26H6C4.89543 26 4 25.1046 4 24V10C4 8.89543 4.89543 8 6 8Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 12H28"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4V8"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 4V8"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

