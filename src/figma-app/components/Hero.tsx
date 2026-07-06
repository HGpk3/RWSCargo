import { useState } from "react";
import type React from "react";
import { Phone, ArrowRight, MapPin, Calendar, Search, Menu, Star, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Logo, PillBtn, BRAND, INK, Container } from "./shared";

const HERO_IMG = "/images/hero-logistics-import.png";

function NavLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className="text-[color:var(--ink)] hover:opacity-60 transition-opacity"
      style={{ fontSize: 14, color: INK }}
    >
      {children}
    </a>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl" style={{ background: "rgba(238,235,228,0.75)" }}>
      <Container className="py-4 flex items-center justify-between">
        <Logo />
        <nav className="hidden lg:flex items-center gap-8">
          <NavLink>Услуги</NavLink>
          <NavLink>Доставка</NavLink>
          <NavLink>Калькулятор</NavLink>
          <NavLink>Процесс</NavLink>
          <NavLink>FAQ</NavLink>
          <NavLink>Контакты</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <a href="tel:+79216556560" className="hidden md:flex items-center gap-2" style={{ color: INK, fontSize: 14 }}>
            <Phone size={14} />
            +7 (921) 655-65-60
          </a>
          <PillBtn size="sm" variant="ink">Рассчитать</PillBtn>
          <button className="lg:hidden p-2 rounded-lg" style={{ background: "rgba(10,18,32,0.05)" }}>
            <Menu size={18} color={INK} />
          </button>
        </div>
      </Container>
    </header>
  );
}

function TrackingWidget() {
  const [tab, setTab] = useState<"track" | "quote">("quote");
  const field: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 13,
  };
  return (
    <div
      className="rounded-2xl p-3 w-full max-w-[360px] backdrop-blur-xl"
      style={{
        background: "rgba(10,18,32,0.55)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      }}
    >
      <div className="flex gap-1 mb-3">
        {(["quote", "track"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 rounded-full py-2 text-white transition-colors"
            style={{
              background: tab === t ? "rgba(255,255,255,0.14)" : "transparent",
              fontSize: 12,
              letterSpacing: "0.06em",
            }}
          >
            {t === "quote" ? "РАСЧЁТ" : "ТРЕКИНГ"}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={field}>
          <MapPin size={14} className="text-white/50" />
          <span className="text-white/90">Гуанчжоу, Китай</span>
        </div>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={field}>
          <MapPin size={14} style={{ color: BRAND }} />
          <span className="text-white/90">Москва, Россия</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={field}>
            <Calendar size={14} className="text-white/50" />
            <span className="text-white/80">06 июля</span>
          </div>
          <button
            className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-white"
            style={{ background: BRAND, fontSize: 13 }}
          >
            Поиск <Search size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="pt-4 pb-6">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] min-h-[860px] md:min-h-[820px]">
          <ImageWithFallback
            src={HERO_IMG}
            alt="Aerial view of orange container ship"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, rgba(10,18,32,0.85) 0%, rgba(10,18,32,0.55) 45%, rgba(10,18,32,0.15) 100%)" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1220]/60 via-transparent to-[#0A1220]/40" />

          {/* Inner nav */}
          <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8">
            <div className="flex items-center gap-3 text-white/85" style={{ fontSize: 12, letterSpacing: "0.14em" }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
              ИМПОРТ ИЗ КИТАЯ ДЛЯ БИЗНЕСА · С 2018 ГОДА
            </div>
            <div className="hidden md:flex items-center gap-6 text-white/70" style={{ fontSize: 12 }}>
              <span>RU</span>
              <span className="text-white/30">/</span>
              <span>EN</span>
              <span className="text-white/30">/</span>
              <span>中文</span>
            </div>
          </div>

          {/* Main */}
          <div className="relative z-10 px-6 md:px-10 pt-16 md:pt-24">
            <div
              className="text-white"
              style={{
                fontSize: "clamp(40px, 11vw, 168px)",
                lineHeight: 0.9,
                letterSpacing: "-0.05em",
                fontWeight: 500,
              }}
            >
              ИМПОРТ<br />
              <span style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.9)", color: "transparent" }}>
                ИЗ КИТАЯ
              </span><br />
              ПОД&nbsp;<span style={{ color: BRAND }}>КЛЮЧ</span>
            </div>
          </div>

          {/* Bottom overlay row */}
          <div className="absolute z-10 left-0 right-0 bottom-0 px-6 md:px-10 pb-6 md:pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              <div className="lg:col-span-5">
                <p className="text-white/80 max-w-md" style={{ fontSize: 15, lineHeight: 1.55 }}>
                  Покупаем, проверяем, оформляем и доставляем товары из Китая в Россию.
                  Сначала собираем понятную схему поставки — потом везём груз.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <PillBtn size="lg" variant="primary">Получить расчёт</PillBtn>
                  <PillBtn size="lg" variant="ghost" onDark>Посмотреть процесс</PillBtn>
                </div>
              </div>
              <div className="lg:col-span-3 hidden lg:flex justify-center">
                <div
                  className="rounded-2xl bg-white p-5 w-full max-w-[260px]"
                  style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.35)" }}
                >
                  <div className="flex items-center justify-between">
                    <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1, color: INK }}>
                      4.8
                    </div>
                    <div className="flex gap-0.5">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <Star key={i} size={11} fill={BRAND} stroke={BRAND} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 text-neutral-500" style={{ fontSize: 10, letterSpacing: "0.14em" }}>
                    СЛЕДУЮЩИЙ ШАГ
                  </div>
                  <div className="mt-1" style={{ fontSize: 13, fontWeight: 600, color: INK, lineHeight: 1.3 }}>
                    Сверить объём и город получения
                  </div>
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-end">
                <TrackingWidget />
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
            <a href="#" className="flex items-center gap-1" style={{ color: BRAND }}>
              трек-поставки <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
