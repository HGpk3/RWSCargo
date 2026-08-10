import { ArrowUpRight, Ship, Plane, Train, Truck, Check } from "lucide-react";
import { Container, SectionHead, PillBtn, BRAND, INK, LINE, NAVY } from "./shared";

const services = [
  {
    id: "service-sourcing",
    n: "02",
    title: "Поиск поставщика или фабрики",
    desc: "Подбираем производителей под товар, запрашиваем реальные фото и видео, проверяем образцы и согласуем условия закупки.",
    bullets: ["фабрики и альтернативные поставщики", "цены, MOQ и сроки производства", "брендирование и упаковка"],
  },
  {
    id: "service-purchase",
    n: "03",
    title: "Выкуп товаров из Китая",
    desc: "Вы присылаете ссылку или контакт поставщика, мы проверяем условия, выкупаем товар, принимаем его на склад и готовим к отправке.",
    bullets: ["1688, Alibaba и прямые фабрики", "оплата поставщику", "приёмка и консолидация"],
  },
  {
    id: "service-quality",
    n: "04",
    title: "Контроль качества и образцов",
    desc: "Проверяем количество, комплектацию, упаковку и качество партии до того, как груз уйдёт из Китая.",
    bullets: ["фото- и видеоотчёт", "тестирование по ТЗ", "рекомендация до закупки"],
  },
  {
    id: "service-customs",
    n: "05",
    title: "Официальное оформление",
    desc: "Для коммерческих партий заранее обсуждаем документы, формат ввоза, инвойсы, контрактную часть и закрывающие документы.",
    bullets: ["документы до отправки", "понятная ответственность", "поставка для бухгалтерии"],
  },
  {
    id: "service-negotiation",
    n: "06",
    title: "Переговоры с поставщиком",
    desc: "Организуем онлайн-переговоры с китайским поставщиком, переводчиком и фиксацией договорённостей по цене, срокам и доработкам.",
    bullets: ["перевод и смысл без потерь", "условия производства", "контроль спорных деталей"],
  },
];

function ServiceCard({ id, n, title, desc, bullets }: (typeof services)[0]) {
  return (
    <a
      id={id}
      href="#contacts"
      className="rounded-2xl p-7 bg-white flex flex-col group transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-lg scroll-mt-24 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
      style={{ border: `1px solid ${LINE}` }}
    >
      <div className="flex items-start justify-between mb-8">
        <div style={{ color: BRAND, fontSize: 12, letterSpacing: "0.14em" }}>{n}</div>
        <ArrowUpRight size={18} className="opacity-30 transition-opacity group-hover:opacity-100" />
      </div>
      <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em", color: INK, lineHeight: 1.2 }}>
        {title}
      </div>
      <div className="mt-3 flex-1" style={{ color: "rgba(10,18,32,0.55)", fontSize: 13.5, lineHeight: 1.55 }}>
        {desc}
      </div>
      <ul className="mt-6 pt-5 space-y-2.5" style={{ borderTop: `1px solid ${LINE}` }}>
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5" style={{ color: INK, fontSize: 13 }}>
            <Check size={14} color={BRAND} className="mt-0.5 shrink-0" />
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-6 inline-flex items-center gap-1" style={{ color: BRAND, fontSize: 13, fontWeight: 500 }}>
        Обсудить услугу <ArrowUpRight size={13} />
      </div>
    </a>
  );
}

export function Services() {
  return (
    <section id="services" className="py-14 md:py-24">
      <Container>
        <SectionHead
          label="УСЛУГИ RWSCARGO"
          title={<>Все этапы импорта из Китая<br />в одном процессе</>}
          text="Можно подключить только доставку или собрать поставку под ключ: от поиска фабрики и выкупа товара до оформления документов и передачи партии в России."
          action={<PillBtn variant="light" href="#services-list">Все услуги</PillBtn>}
        />

        <div id="services-list" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Big dark hero service */}
          <div
            id="service-delivery"
            className="relative overflow-hidden rounded-2xl md:col-span-2 md:row-span-2 p-8 md:p-10 min-h-[540px] flex flex-col justify-between scroll-mt-24"
            style={{ background: NAVY }}
          >
            <picture>
              <source type="image/avif" srcSet="/images/cargo-bridge-realistic-1200.avif" />
              <source
                type="image/webp"
                srcSet="/images/cargo-bridge-realistic-768.webp 768w, /images/cargo-bridge-realistic-1200.webp 1200w"
                sizes="(max-width: 768px) 100vw, 900px"
              />
              <img
                src="/images/cargo-bridge-realistic-1200.webp"
                alt="Container yard"
                width={1200}
                height={800}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            </picture>
            <div className="absolute inset-0" style={{ background: "linear-gradient(140deg, rgba(14,26,46,0.9) 0%, rgba(14,26,46,0.55) 100%)" }} />
            <div className="relative z-10 flex items-center justify-between">
              <div style={{ color: BRAND, fontSize: 12, letterSpacing: "0.14em" }}>01 · ФЛАГМАН</div>
              <div className="flex items-center gap-2 text-white/70" style={{ fontSize: 11, letterSpacing: "0.12em" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ПРИНИМАЕМ ЗАЯВКИ
              </div>
            </div>
            <div className="relative z-10">
              <div
                className="text-white"
                style={{ fontSize: "clamp(34px, 4vw, 60px)", lineHeight: 0.98, letterSpacing: "-0.03em", fontWeight: 500 }}
              >
                Доставка<br />грузов<br />из&nbsp;Китая
              </div>
              <p className="text-white/70 mt-6 max-w-md" style={{ fontSize: 14, lineHeight: 1.6 }}>
                Считаем маршрут под вес, объём, срочность и экономику партии: авто,
                авиа, железная дорога, контейнер или сборный груз.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-8">
                {[
                  { icon: <Truck size={16} />, k: "авто", v: "10—30 дней" },
                  { icon: <Plane size={16} />, k: "авиа", v: "срочно" },
                  { icon: <Train size={16} />, k: "ЖД", v: "объём" },
                  { icon: <Ship size={16} />, k: "море", v: "контейнер" },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="rounded-xl px-3 py-3"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="text-white/60">{x.icon}</div>
                    <div className="text-white/50 mt-2" style={{ fontSize: 11 }}>{x.k}</div>
                    <div className="text-white" style={{ fontSize: 13, fontWeight: 500 }}>{x.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <PillBtn variant="primary" href="#calculator">Рассчитать поставку</PillBtn>
              </div>
            </div>
          </div>

          {services.map((s) => (
            <ServiceCard key={s.n} {...s} />
          ))}
        </div>
      </Container>
    </section>
  );
}
