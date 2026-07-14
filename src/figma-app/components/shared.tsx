import type React from "react";
import { ArrowUpRight } from "lucide-react";

export const BRAND = "#F0441F";
export const INK = "#0A1220";
export const PAGE = "#EEEBE4";
export const CARD = "#FFFFFF";
export const NAVY = "#0E1A2E";
export const LINE = "#E2DED3";
export const PHONE_HREF = "tel:+79216556560";
export const MESSENGER_HREF = "https://wa.me/79216556560";

export function Logo({ onDark = false, size = 22 }: { onDark?: boolean; size?: number }) {
  return (
    <a href="/" className="flex items-center gap-2 leading-none" aria-label="RWSCargo">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: BRAND }}
      >
        <div className="w-4 h-4 rounded-sm bg-white" style={{ opacity: 0.95 }} />
      </div>
      <div className="flex flex-col">
        <div style={{ fontSize: size, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1 }}>
          <span style={{ color: BRAND }}>RWS</span>
          <span style={{ color: onDark ? "#FFFFFF" : INK }}>Cargo</span>
        </div>
        <div
          className="mt-1"
          style={{
            fontSize: 9,
            letterSpacing: "0.18em",
            color: onDark ? "rgba(255,255,255,0.55)" : "rgba(10,18,32,0.5)",
          }}
        >
          РВС КАРГО
        </div>
      </div>
    </a>
  );
}

export function EyebrowLabel({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
      style={{
        background: onDark ? "rgba(255,255,255,0.08)" : "rgba(10,18,32,0.05)",
        color: onDark ? "rgba(255,255,255,0.85)" : INK,
        border: `1px solid ${onDark ? "rgba(255,255,255,0.12)" : "rgba(10,18,32,0.08)"}`,
        fontSize: 11,
        letterSpacing: "0.16em",
      }}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
      {children}
    </span>
  );
}

export function Display({
  children,
  size = "lg",
  onDark = false,
  className = "",
}: {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  onDark?: boolean;
  className?: string;
}) {
  const sizes = {
    sm: "clamp(26px, 3.2vw, 42px)",
    md: "clamp(31px, 4vw, 56px)",
    lg: "clamp(36px, 5vw, 76px)",
    xl: "clamp(48px, 7.4vw, 128px)",
  };
  return (
    <h2
      className={className}
      style={{
        fontSize: sizes[size],
        lineHeight: 0.96,
        letterSpacing: 0,
        fontWeight: 500,
        color: onDark ? "#FFFFFF" : INK,
      }}
    >
      {children}
    </h2>
  );
}

export function BodyText({
  children,
  onDark = false,
  className = "",
}: {
  children: React.ReactNode;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <p
      className={className}
      style={{
        fontSize: 16,
        lineHeight: 1.6,
        color: onDark ? "rgba(255,255,255,0.7)" : "rgba(10,18,32,0.6)",
      }}
    >
      {children}
    </p>
  );
}

export function PillBtn({
  children,
  variant = "primary",
  size = "md",
  onDark = false,
  href,
  target,
  rel,
  type = "button",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ink" | "ghost" | "light";
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit";
  onClick?: React.MouseEventHandler<HTMLElement>;
}) {
  const pad = size === "lg" ? "px-7 py-4" : size === "sm" ? "px-4 py-2.5" : "px-5 py-3.5";
  const fs = size === "lg" ? 15 : size === "sm" ? 13 : 14;
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: BRAND, color: "#FFFFFF", border: "none" },
    ink: { background: INK, color: "#FFFFFF", border: "none" },
    light: { background: "#FFFFFF", color: INK, border: `1px solid ${LINE}` },
    ghost: {
      background: onDark ? "rgba(255,255,255,0.08)" : "rgba(10,18,32,0.04)",
      color: onDark ? "#FFFFFF" : INK,
      border: `1px solid ${onDark ? "rgba(255,255,255,0.18)" : "rgba(10,18,32,0.1)"}`,
    },
  };
  const className = `inline-flex items-center gap-2 rounded-full transition-transform hover:-translate-y-0.5 ${pad}`;
  const style = { ...styles[variant], fontSize: fs };
  const content = (
    <>
      {children}
      <ArrowUpRight size={size === "lg" ? 18 : 16} />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        className={className}
        style={style}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      className={className}
      style={style}
    >
      {content}
    </button>
  );
}

export function SectionHead({
  label,
  title,
  text,
  action,
  onDark = false,
}: {
  label?: string;
  title: React.ReactNode;
  text?: string;
  action?: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <div className="mb-12 md:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
      <div className="max-w-3xl">
        {label && (
          <div className="mb-5">
            <EyebrowLabel onDark={onDark}>{label}</EyebrowLabel>
          </div>
        )}
        <Display size="md" onDark={onDark}>
          {title}
        </Display>
        {text && (
          <div className="mt-5 max-w-xl">
            <BodyText onDark={onDark}>{text}</BodyText>
          </div>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`max-w-[1400px] mx-auto px-5 md:px-10 ${className}`}>{children}</div>;
}
