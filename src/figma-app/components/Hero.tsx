import { useState } from "react";
import type React from "react";
import { Phone, ArrowRight, Calendar, Menu, TrendingUp } from "lucide-react";
import { Logo, PillBtn, BRAND, INK, Container, PHONE_HREF } from "./shared";
import { LanguageSwitcher } from "../i18n";

const HERO_IMG = "/images/hero-logistics-import-1600.webp";
const HERO_WEBP = "/images/hero-logistics-import-1600.webp";
const HERO_WEBP_MOBILE = "/images/hero-logistics-import-768.webp";
const HERO_AVIF = "/images/hero-logistics-import-1200.avif";
const navItems = [
  ["Услуги", "#services"],
  ["Доставка", "#delivery"],
  ["Форматы", "#formats"],
  ["Процесс", "#process"],
  ["FAQ", "#faq"],
  ["Контакты", "#contacts"],
] as const;

function NavLink({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="text-[color:var(--ink)] hover:opacity-60 transition-opacity"
      style={{ fontSize: 14, color: INK }}
    >
      {children}
    </a>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(238,235,228,0.75)" }}>
      <Container className="py-4 flex items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map(([label, href]) => (
            <NavLink key={href} href={href}>{label}</NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a href={PHONE_HREF} className="hidden md:flex items-center gap-2" style={{ color: INK, fontSize: 14 }}>
            <Phone size={14} />
            +7 (921) 655-65-60
          </a>
          <PillBtn size="sm" variant="ink" href="#contacts">Оформить заявку</PillBtn>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="lg:hidden p-2 rounded-lg"
            style={{ background: "rgba(10,18,32,0.05)" }}
            aria-expanded={menuOpen}
            aria-label="Открыть меню"
          >
            <Menu size={18} color={INK} />
          </button>
        </div>
      </Container>
      <div
        className="lg:hidden grid border-t transition-[grid-template-rows,opacity] duration-200 ease-out"
        style={{
          gridTemplateRows: menuOpen ? "1fr" : "0fr",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          borderColor: menuOpen ? "rgba(10,18,32,0.08)" : "transparent",
          background: "rgba(238,235,228,0.96)",
          contain: "layout paint",
        }}
      >
        <div className="overflow-hidden">
          <div
            className="transition-[transform,opacity] duration-200 ease-out"
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(-4px)",
              willChange: "transform, opacity",
            }}
          >
            <Container className="py-4 grid gap-3">
              {navItems.map(([label, href]) => (
                <NavLink key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</NavLink>
              ))}
              <a href={PHONE_HREF} className="inline-flex items-center gap-2 pt-2" style={{ color: INK, fontSize: 14 }}>
                <Phone size={14} />
                +7 (921) 655-65-60
              </a>
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
            </Container>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Hero() {
  return (
    <section id="hero" className="pt-4 pb-6">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] min-h-[660px] sm:min-h-[720px] md:min-h-[820px]">
          <picture>
            <source type="image/avif" srcSet={HERO_AVIF} />
            <source
              type="image/webp"
              srcSet={`${HERO_WEBP_MOBILE} 768w, ${HERO_WEBP} 1600w`}
              sizes="(max-width: 640px) 100vw, 1400px"
            />
            <img
              src={HERO_IMG}
              alt="Aerial view of orange container ship"
              width={1600}
              height={1067}
              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
          <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(10,18,32,0.85) 0%, rgba(10,18,32,0.55) 45%, rgba(10,18,32,0.15) 100%)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1220]/60 via-transparent to-[#0A1220]/40" />

          {/* Inner nav */}
          <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
            <div className="flex items-center gap-3 text-white/85" style={{ fontSize: 12, letterSpacing: "0.14em" }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
              ИМПОРТ ИЗ КИТАЯ ДЛЯ БИЗНЕСА · С 2018 ГОДА
            </div>
            <div className="hidden md:block">
              <LanguageSwitcher onDark />
            </div>
          </div>

          {/* Main */}
          <div className="relative z-10 px-6 md:px-10 pt-12 sm:pt-16 md:pt-24">
            <div
              className="text-white"
              style={{
                fontSize: "clamp(42px, 12vw, 168px)",
                lineHeight: 0.9,
                letterSpacing: "-0.05em",
                fontWeight: 500,
              }}
            >
              ПОСТАВКИ<br />
              <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.9)", color: "transparent" }}>
                ИЗ КИТАЯ
              </span><br />
              ПОД&nbsp;<span style={{ color: BRAND }}>ЗАДАЧУ</span>
            </div>
          </div>

          {/* Bottom overlay row */}
          <div className="absolute z-10 left-0 right-0 bottom-5 sm:bottom-0 px-6 md:px-10 pb-[calc(30px+env(safe-area-inset-bottom))] sm:pb-6 md:pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-7">
                <p className="text-white/80 max-w-md" style={{ fontSize: 15, lineHeight: 1.55 }}>
                  Подбираем схему поставки под задачу: быстро и экономично, официально
                  с документами или в смешанном формате. Сначала фиксируем маршрут и условия,
                  потом двигаем груз.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <PillBtn size="lg" variant="primary" href="#calculator">Калькулятор доставки</PillBtn>
                  <PillBtn size="lg" variant="ghost" onDark href="#contacts">Получить бесплатный расчёт</PillBtn>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Route bar under hero */}
        <div
          className="mt-3 rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4"
          style={{ background: INK, color: "#FFFFFF" }}
        >
          <div className="flex items-center gap-4" style={{ fontSize: 14 }}>
            <span className="text-white/50" style={{ fontSize: 11, letterSpacing: "0.14em" }}>МАРШРУТ</span>
            <span style={{ fontWeight: 600 }}>CN GZH</span>
            <div className="relative w-16 md:w-32 h-px bg-white/25">
              <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full" style={{ background: BRAND }} />
            </div>
            <span style={{ fontWeight: 600 }}>RU MOW</span>
          </div>
          <div className="flex items-center gap-6 text-white/70" style={{ fontSize: 13 }}>
            <span className="flex items-center gap-2"><Calendar size={13} /> 10—30 дней</span>
            <span className="hidden md:flex items-center gap-2"><TrendingUp size={13} /> авто · авиа · ЖД</span>
            <a href="#calculator" className="flex items-center gap-1" style={{ color: BRAND }}>
              рассчитать маршрут <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
