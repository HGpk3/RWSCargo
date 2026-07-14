import { useEffect, useState } from "react";
import type React from "react";
import { Plus, Minus, Phone, ArrowUpRight } from "lucide-react";
import { Container, PillBtn, EyebrowLabel, Display, Logo, BRAND, INK, LINE, NAVY, PHONE_HREF, MESSENGER_HREF } from "./shared";
import { translateValue, useLanguage } from "../i18n";

const footerLinks = [
  ["Услуги", "#services"],
  ["Доставка", "#delivery"],
  ["Калькулятор", "#calculator"],
  ["Процесс", "#process"],
  ["FAQ", "#faq"],
  ["Контакты", "#contacts"],
] as const;

const faqs = [
  { q: "Какой срок доставки из Китая в Россию?", a: "Зависит от маршрута: авто 10—30 дней, авиа для срочных партий, ЖД и контейнер для объёмов. Точный срок рассчитаем после веса, объёма и города получения." },
  { q: "Можно ли выкупить товар у поставщика за меня?", a: "Да. Вы присылаете ссылку или контакт поставщика, мы проверяем условия, оплачиваем в юанях и принимаем товар на склад в Китае." },
  { q: "Можно ли оформить поставку официально?", a: "Да. Обсуждаем формат ввоза заранее: контрактная часть, инвойсы, упаковочные листы, закрывающие документы — для бухгалтерии и ВЭД." },
  { q: "С какими товарами работает RWSCargo?", a: "Маркетплейсы, электроника, одежда, мебель, оборудование, автозапчасти, сборные и контейнерные грузы. Не берём запрещённые к ввозу." },
  { q: "Есть ли склады в Китае?", a: "Да, два склада — в Гуанчжоу и Иу. Принимаем товары, сверяем количество, консолидируем партии и готовим упаковку к отправке." },
  { q: "Какие данные нужны для расчёта?", a: "Товар, ссылка или контакт поставщика, вес, объём, город получения, желаемые сроки и формат оформления." },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-14 md:py-24" style={{ background: "#E4E0D3" }}>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <EyebrowLabel>FAQ</EyebrowLabel>
            <div className="mt-6">
              <Display size="lg">
                Частые вопросы<br />
                о <span style={{ color: BRAND }}>доставке</span> из Китая
              </Display>
            </div>
            <div className="mt-8 rounded-2xl p-6 bg-white" style={{ border: `1px solid ${LINE}` }}>
              <div style={{ color: "rgba(10,18,32,0.5)", fontSize: 12, letterSpacing: "0.14em" }}>
                НЕ НАШЛИ ОТВЕТ?
              </div>
              <a href={PHONE_HREF} className="mt-3 inline-flex items-center gap-2" style={{ color: INK, fontSize: 20, fontWeight: 500 }}>
                <Phone size={16} /> +7 (921) 655-65-60
              </a>
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="rounded-2xl bg-white overflow-hidden lg:min-h-[640px]" style={{ border: `1px solid ${LINE}` }}>
              {faqs.map((f, i) => (
                <div key={f.q} style={{ borderTop: i > 0 ? `1px solid ${LINE}` : "none" }}>
                  <button
                    type="button"
                    aria-expanded={open === i}
                    className="w-full flex items-center justify-between px-7 py-6 text-left"
                    onClick={() => setOpen(open === i ? -1 : i)}
                  >
                    <span className="pr-4" style={{ color: INK, fontSize: 17, fontWeight: 500 }}>
                      {f.q}
                    </span>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors"
                      style={{
                        background: open === i ? BRAND : "rgba(10,18,32,0.05)",
                        color: open === i ? "#fff" : INK,
                      }}
                    >
                      {open === i ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>
                  <div
                    className="overflow-hidden transition-[max-height,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      maxHeight: open === i ? 260 : 0,
                      opacity: open === i ? 1 : 0,
                    }}
                  >
                    <div
                      className="px-7 pb-6 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{
                        color: "rgba(10,18,32,0.6)",
                        fontSize: 14.5,
                        lineHeight: 1.65,
                        opacity: open === i ? 1 : 0,
                        transform: open === i ? "translateY(0)" : "translateY(-4px)",
                      }}
                    >
                      {f.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Calculator() {
  const { lang } = useLanguage();
  const [weight, setWeight] = useState("120");
  const [volume, setVolume] = useState("0.8");
  const [method, setMethod] = useState("Авто");
  const [city, setCity] = useState("Москва");
  const [extras, setExtras] = useState<string[]>(["Документы"]);
  const t = (value: string) => translateValue(value, lang);
  const locale = lang === "ru" ? "ru-RU" : "en-US";

  useEffect(() => {
    const onDeliveryMethod = (event: Event) => {
      const method = (event as CustomEvent<{ method?: string }>).detail?.method;

      if (method === "Авто" || method === "Авиа" || method === "ЖД" || method === "Контейнер") {
        setMethod(method);
      }
    };

    window.addEventListener("rwscargo:set-delivery-method", onDeliveryMethod);

    return () => window.removeEventListener("rwscargo:set-delivery-method", onDeliveryMethod);
  }, []);

  const price = Math.round((Number(weight) || 0) * 6.5 + (Number(volume) || 0) * 12000 + extras.length * 4500);
  const priceMin = Math.round(price * 0.86);
  const priceMax = Math.round(price * 1.18);
  const days = method === "Авиа" ? "5—10" : method === "ЖД" ? "20—35" : "10—30";
  const calcMessage = [
    t("Здравствуйте! Хочу обсудить расчёт доставки из Китая."),
    `${t("Вес")}: ${weight || t("не указан")} kg`,
    `${t("Объём")}: ${volume || t("не указан")} m³`,
    `${t("Способ")}: ${t(method)}`,
    `${t("Город")}: ${city ? t(city) : t("не указан")}`,
    `${t("Дополнительно")}: ${extras.length ? extras.map(t).join(", ") : t("не выбрано")}`,
    `${t("Ориентир на сайте")}: ${priceMin.toLocaleString(locale)}—${priceMax.toLocaleString(locale)} ₽, ${days} ${t("дней")}`,
  ].join("\n");
  const calcHref = `${MESSENGER_HREF}?text=${encodeURIComponent(calcMessage)}`;

  const toggleExtra = (e: string) =>
    setExtras((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));

  const fieldStyle: React.CSSProperties = {
    background: "#F5F2EB",
    border: `1px solid ${LINE}`,
    color: INK,
    fontSize: 14,
  };

  return (
    <section id="calculator" className="py-14 md:py-24">
      <Container>
        <div
          className="rounded-[28px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white"
          style={{ border: `1px solid ${LINE}` }}
        >
          <div className="lg:col-span-5 p-8 md:p-12">
            <EyebrowLabel>КАЛЬКУЛЯТОР ДОСТАВКИ</EyebrowLabel>
            <div className="mt-6">
              <Display size="lg">
                Прикиньте<br />ориентир<br />
                <span style={{ color: BRAND }}>до заявки</span>
              </Display>
            </div>
            <div className="mt-6" style={{ color: "rgba(10,18,32,0.55)", fontSize: 14, lineHeight: 1.6 }}>
              Расчёт показывает предварительный диапазон по логистике из Китая в Россию.
              Финальная цена, сроки и документы зависят от товара, веса, объёма и города получения.
            </div>
          </div>
          <div
            className="lg:col-span-7 p-8 md:p-12 border-t lg:border-t-0 lg:border-l"
            style={{ borderColor: LINE, background: "#FAF8F2" }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2" style={{ color: "rgba(10,18,32,0.5)", fontSize: 11, letterSpacing: "0.12em" }}>ВЕС, КГ</div>
                <input aria-label={t("ВЕС, КГ")} name="cargo_weight" type="number" inputMode="decimal" min="0" className="w-full rounded-xl px-4 py-3 outline-none" style={fieldStyle} value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <div>
                <div className="mb-2" style={{ color: "rgba(10,18,32,0.5)", fontSize: 11, letterSpacing: "0.12em" }}>ОБЪЁМ, М³</div>
                <input aria-label={t("ОБЪЁМ, М³")} name="cargo_volume" type="number" inputMode="decimal" min="0" step="0.1" className="w-full rounded-xl px-4 py-3 outline-none" style={fieldStyle} value={volume} onChange={(e) => setVolume(e.target.value)} />
              </div>
              <div className="col-span-2">
                <div className="mb-2" style={{ color: "rgba(10,18,32,0.5)", fontSize: 11, letterSpacing: "0.12em" }}>СПОСОБ ДОСТАВКИ</div>
                <div className="flex gap-2 flex-wrap">
                  {["Авто", "Авиа", "ЖД", "Контейнер"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMethod(m)}
                      aria-pressed={method === m}
                      className="rounded-full px-4 py-2.5 transition-colors"
                      style={{
                        background: method === m ? INK : "#fff",
                        color: method === m ? "#fff" : INK,
                        border: `1px solid ${method === m ? INK : LINE}`,
                        fontSize: 13,
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <div className="mb-2" style={{ color: "rgba(10,18,32,0.5)", fontSize: 11, letterSpacing: "0.12em" }}>ГОРОД</div>
                <input aria-label={t("ГОРОД")} name="destination_city" className="w-full rounded-xl px-4 py-3 outline-none" style={fieldStyle} value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="col-span-2">
                <div className="mb-2" style={{ color: "rgba(10,18,32,0.5)", fontSize: 11, letterSpacing: "0.12em" }}>ДОПОЛНИТЕЛЬНО</div>
                <div className="flex gap-2 flex-wrap">
                  {["Проверка качества", "Документы", "Забор у поставщика"].map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => toggleExtra(e)}
                      aria-pressed={extras.includes(e)}
                      className="rounded-full px-4 py-2.5 transition-colors"
                      style={{
                        background: extras.includes(e) ? "rgba(240,68,31,0.1)" : "#fff",
                        color: extras.includes(e) ? BRAND : INK,
                        border: `1px solid ${extras.includes(e) ? "rgba(240,68,31,0.4)" : LINE}`,
                        fontSize: 13,
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ background: INK, color: "#fff" }}>
              <div>
                <div className="text-white/50" style={{ fontSize: 10, letterSpacing: "0.14em" }}>ПРЕДВАРИТЕЛЬНО</div>
                <div className="mt-1" style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em" }}>
                  {priceMin.toLocaleString("ru-RU")}—{priceMax.toLocaleString("ru-RU")} ₽
                </div>
                <div className="mt-2 text-white/45" style={{ fontSize: 11, lineHeight: 1.4 }}>
                  Ориентир, не оферта
                </div>
              </div>
              <div>
                <div className="text-white/50" style={{ fontSize: 10, letterSpacing: "0.14em" }}>СРОК</div>
                <div className="mt-1" style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em" }}>{days}</div>
                <div className="text-white/50" style={{ fontSize: 11 }}>дней</div>
              </div>
              <div>
                <div className="text-white/50" style={{ fontSize: 10, letterSpacing: "0.14em" }}>ВКЛЮЧЕНО</div>
                <div className="mt-1" style={{ fontSize: 13, lineHeight: 1.5 }}>
                  маршрут, склад в Китае{extras.length ? `, ${extras.join(", ").toLowerCase()}` : ""}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <PillBtn size="lg" variant="primary" href={calcHref} target="_blank" rel="noreferrer">Обсудить расчёт</PillBtn>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function CTA() {
  const { lang } = useLanguage();
  const [checks, setChecks] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const t = (value: string) => translateValue(value, lang);
  const items = [
    "поставщик уже найден",
    "нужен поиск фабрики",
    "нужен выкуп товара",
    "нужна проверка качества",
    "нужны документы",
    "нужна доставка по РФ",
  ];
  const toggle = (v: string) =>
    setChecks((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  const requestMessage = [
    t("Здравствуйте! Хочу рассчитать поставку из Китая."),
    `${t("Имя")}: ${name || t("не указано")}`,
    `${t("Телефон")}: ${phone || t("не указан")}`,
    `${t("Задачи")}: ${checks.length ? checks.map(t).join(", ") : t("не выбраны")}`,
    `${t("Описание")}: ${details || t("не указано")}`,
  ].join("\n");
  const requestHref = `${MESSENGER_HREF}?text=${encodeURIComponent(requestMessage)}`;

  const fieldStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 14,
  };

  return (
    <section id="contacts" className="py-6">
      <Container>
        <div
          className="rounded-[28px] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10"
          style={{ background: NAVY }}
        >
          <div className="lg:col-span-5">
            <EyebrowLabel onDark>ЗАЯВКА НА РАСЧЁТ</EyebrowLabel>
            <div className="mt-6">
              <Display size="lg" onDark>
                Обсудим груз,<br />
                <span style={{ color: BRAND }}>поставщика</span><br />
                и маршрут
              </Display>
            </div>
            <p className="text-white/65 mt-6 max-w-md" style={{ fontSize: 15, lineHeight: 1.6 }}>
              Опишите товар, объём, ссылку на поставщика, город получения и желаемые сроки.
              Менеджер предложит формат поставки и следующий шаг.
            </p>
            <a href={PHONE_HREF} className="inline-flex items-center gap-3 text-white mt-8" style={{ fontSize: 20, fontWeight: 500 }}>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: BRAND }}
              >
                <Phone size={18} />
              </div>
              +7 (921) 655-65-60
            </a>
          </div>
          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="grid gap-2">
                <span className="sr-only">Ваше имя</span>
                <input aria-label={t("Ваше имя")} name="name" autoComplete="name" placeholder="Ваше имя" className="rounded-xl px-4 py-3.5 outline-none placeholder:text-white/40" style={fieldStyle} value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="grid gap-2">
                <span className="sr-only">Телефон</span>
                <input aria-label={t("Телефон")} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Телефон" className="rounded-xl px-4 py-3.5 outline-none placeholder:text-white/40" style={fieldStyle} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </label>
            </div>
            <textarea
              placeholder="Опишите груз, ссылку на поставщика, город получения"
              aria-label={t("Опишите груз, ссылку на поставщика, город получения")}
              name="details"
              rows={4}
              className="w-full rounded-xl px-4 py-3.5 outline-none resize-none placeholder:text-white/40"
              style={fieldStyle}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 pt-3">
              {items.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={checks.includes(i)}
                  className="rounded-full px-4 py-2.5 transition-colors"
                  style={{
                    background: checks.includes(i) ? "rgba(240,68,31,0.18)" : "rgba(255,255,255,0.05)",
                    color: checks.includes(i) ? BRAND : "rgba(255,255,255,0.85)",
                    border: `1px solid ${checks.includes(i) ? "rgba(240,68,31,0.4)" : "rgba(255,255,255,0.1)"}`,
                    fontSize: 13,
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <PillBtn size="lg" variant="primary" href={requestHref} target="_blank" rel="noreferrer">Отправить в WhatsApp</PillBtn>
              <div className="text-white/40" style={{ fontSize: 12 }}>
                Нажимая, вы соглашаетесь с <a href="/privacy/" className="underline underline-offset-2">политикой ПДн</a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="pt-6 pb-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-md" style={{ color: "rgba(10,18,32,0.55)", fontSize: 14, lineHeight: 1.6 }}>
              RWSCargo / РВС Карго: надёжные логистические решения для вашего бизнеса с Китаем.
            </p>
          </div>
          <div className="md:col-span-4">
            <div style={{ color: "rgba(10,18,32,0.4)", fontSize: 11, letterSpacing: "0.14em" }}>НАВИГАЦИЯ</div>
            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {footerLinks.map(([label, href]) => (
                <a key={href} href={href} style={{ color: INK, fontSize: 14 }} className="hover:opacity-60">
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            <div style={{ color: "rgba(10,18,32,0.4)", fontSize: 11, letterSpacing: "0.14em" }}>КОНТАКТЫ</div>
            <a href={PHONE_HREF} className="mt-5 block" style={{ color: INK, fontSize: 20, fontWeight: 500 }}>
              +7 (921) 655-65-60
            </a>
            <a href={MESSENGER_HREF} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1" style={{ color: BRAND, fontSize: 13 }}>
              Написать в мессенджер <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
        <div
          className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <div style={{ color: "rgba(10,18,32,0.5)", fontSize: 12 }}>
            © 2026 RWSCargo / РВС Карго. Не является публичной офертой.
          </div>
          <div className="flex gap-6" style={{ fontSize: 12 }}>
            <a href="/privacy/" style={{ color: "rgba(10,18,32,0.55)" }} className="hover:opacity-60">Политика ПДн</a>
            <a href="/personal-data-consent/" style={{ color: "rgba(10,18,32,0.55)" }} className="hover:opacity-60">Согласие ПДн</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
