interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

const SIZES = {
  sm: { icon: 28, text: "text-lg", gap: "gap-1.5" },
  md: { icon: 34, text: "text-xl", gap: "gap-2" },
  lg: { icon: 44, text: "text-3xl", gap: "gap-2.5" },
};

export function Logo({ size = "md", variant = "full", className = "" }: LogoProps) {
  const s = SIZES[size];

  const icon = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Background — rounded square with gradient */}
      <defs>
        <linearGradient id="logoBg" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#009E49" />
          <stop offset="100%" stopColor="#006a32" />
        </linearGradient>
        <linearGradient id="goldAccent" x1="10" y1="10" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCD116" />
          <stop offset="100%" stopColor="#FFE44D" />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="12" fill="url(#logoBg)" />

      {/* Wrench silhouette — simplified, bold */}
      <path
        d="M28.5 13.5c-2.5-1.5-5.7-1.2-7.8.9-1.7 1.7-2.1 4.2-1.3 6.3l-6.9 6.9c-.6.6-.6 1.5 0 2.1l1.1 1.1c.6.6 1.5.6 2.1 0l6.9-6.9c2.1.8 4.6.4 6.3-1.3 2.1-2.1 2.4-5.3.9-7.8l-3.2 3.2-2.1-.5-.5-2.1 3.2-3.2z"
        fill="url(#goldAccent)"
      />

      {/* Small diamond accent */}
      <rect x="31" y="6" width="5" height="5" rx="1" transform="rotate(45 33.5 8.5)" fill="#FCD116" opacity="0.6" />
    </svg>
  );

  if (variant === "icon") {
    return <div className={className}>{icon}</div>;
  }

  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      {icon}
      <span className={`font-display ${s.text} tracking-tight`}>
        <span className="text-text-primary">Pro</span>
        <span className="text-brand-green-500">Find</span>
      </span>
    </div>
  );
}
