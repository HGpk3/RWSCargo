import { Check, ArrowUpRight, Truck, Plane, Train, Package, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Container, SectionHead, PillBtn, EyebrowLabel, Display, BodyText, BRAND, INK, LINE, NAVY } from "./shared";

export function WhiteImport() {
  const items = [
    "инвойс и упаковочный лист",
    "контроль поставщика",
    "консолидация на складе",
    "поставка в белую",
  ];
  return (
    <section className="py-14 md:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <EyebrowLabel>БЕЛЫЙ ИМПОРТ И КОНТРОЛЬ</EyebrowLabel>
            <div className="mt-6">
              <Display size="lg">
                Импорт, который можно<br />
                показать <span style={{ color: BRAND }}>бухгалтерии</span>
              </Display>
            </div>
            <div className="mt-6">
              <BodyText>
                Для коммерческих партий важны не только сроки. Нужны понятные документы,
                прогнозируемый маршрут, ответственная передача и контроль до отправки.
              </BodyText>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((t, i) => (
              <div
                key={t}
                className="rounded-2xl p-6 bg-white flex flex-col justify-between min-h-[180px]"
                style={{ border: `1px solid ${LINE}` }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(240,68,31,0.1)" }}
                >
                  <Check size={18} color={BRAND} />
                </div>
                <div>
                  <div style={{ color: "rgba(10,18,32,0.4)", fontSize: 11, letterSpacing: "0.14em" }}>
                    0{i + 1}
                  </div>
                  <div className="mt-2" style={{ color: INK, fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {t}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

const fixItems = [
  "товар и количество мест",
  "вес, объём и упаковка",
  "поставщик и условия закупки",
  "фото- и видеоотчёт",
  "инвойс и упаковочный лист",
  "маршрут и формат оформления",
  "город получения и ответственное лицо",
  "следующий шаг до оплаты",
];

export function FixBefore() {
  return (
    <section className="py-14 md:py-24" style={{ background: "#E4E0D3" }}>
      <Container>
        <SectionHead
          label="ЧТО ФИКСИРУЕМ ДО ОТПРАВКИ"
          title={<>Меньше сюрпризов,<br />больше управляемости</>}
          text="Клиент быстро видит, что поставка не строится на устных обещаниях."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {fixItems.map((t, i) => (
            <div
              key={t}
              className="rounded-2xl p-6 bg-white flex flex-col justify-between min-h-[160px]"
              style={{ border: `1px solid ${LINE}` }}
            >
              <div style={{ color: BRAND, fontSize: 28, letterSpacing: "-0.02em", fontWeight: 500 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-4" style={{ color: INK, fontSize: 15, lineHeight: 1.35, fontWeight: 500 }}>
                {t}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const methods = [
  {
    icon: <Truck size={22} />,
    title: "Автодоставка",
    tag: "10—30 дней",
    desc: "Универсальный маршрут для регулярных партий, маркетплейсов, электроники, текстиля и товаров для дома.",
    img: "/images/cargo-bridge-realistic.png",
  },
  {
    icon: <Plane size={22} />,
    title: "Авиадоставка",
    tag: "быстрее всего",
    desc: "Для образцов, срочных партий и ситуаций, когда остатки на складе нужно пополнить быстро.",
    img: "/images/hero-logistics-import.png",
  },
  {
    icon: <Train size={22} />,
    title: "ЖД доставка",
    tag: "стабильно для объёма",
    desc: "Рациональный вариант для крупных партий, оборудования и грузов, где важен баланс сроков и стоимости.",
    img: "/images/cargo-bridge-realistic.png",
  },
  {
    icon: <Package size={22} />,
    title: "Контейнер / сборный",
    tag: "под ключ",
    desc: "Для коммерческого импорта, крупногабаритных грузов и поставок с официальным оформлением.",
    img: "/images/hero-logistics-import.png",
  },
];

export function DeliveryMethods() {
  return (
    <section className="py-14 md:py-24">
      <Container>
        <SectionHead
          label="СПОСОБЫ ДОСТАВКИ"
          title={<>Подбираем маршрут<br />под экономику партии</>}
          text="Не каждый груз нужно везти самым быстрым способом. Мы сравниваем стоимость, сроки, риски и требования к документам, чтобы маршрут не съел маржинальность товара."
          action={<PillBtn variant="light">Сравнить маршруты</PillBtn>}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {methods.map((m) => (
            <div
              key={m.title}
              className="rounded-2xl overflow-hidden bg-white flex flex-col group cursor-pointer transition-all hover:-translate-y-1"
              style={{ border: `1px solid ${LINE}` }}
            >
              <div className="relative h-40 overflow-hidden">
                <ImageWithFallback
                  src={m.img}
                  alt={m.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div
                  className="absolute top-4 left-4 rounded-xl p-2.5 backdrop-blur-md"
                  style={{ background: "rgba(255,255,255,0.9)", color: BRAND }}
                >
                  {m.icon}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div style={{ color: BRAND, fontSize: 11, letterSpacing: "0.14em" }}>
                  {m.tag.toUpperCase()}
                </div>
                <div className="mt-2" style={{ color: INK, fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" }}>
                  {m.title}
                </div>
                <div className="mt-3 flex-1" style={{ color: "rgba(10,18,32,0.55)", fontSize: 13, lineHeight: 1.55 }}>
                  {m.desc}
                </div>
                <div className="mt-4 flex items-center gap-1" style={{ color: INK, fontSize: 13 }}>
                  Обсудить <ArrowUpRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const formats = [
  { tag: "МАРКЕТПЛЕЙСЫ", title: "Товары для Ozon / Wildberries", desc: "Регулярные партии, упаковка, маркировка, консолидация и понятный срок пополнения склада." },
  { tag: "КОММЕРЧЕСКАЯ ПАРТИЯ", title: "Партии для бизнеса", desc: "Документы, ответственность, официальный импорт и передача груза компании или складу." },
  { tag: "ОБОРУДОВАНИЕ", title: "Станки, узлы, комплектующие", desc: "Габариты, вес, упаковка, маршрут под объём и заранее согласованные документы." },
  { tag: "СРОЧНАЯ ПОСТАВКА", title: "Авиа или быстрый авто-маршрут", desc: "Когда важнее скорость: образцы, небольшие партии, дефицит остатков и быстрый запуск продаж." },
];

export function Formats() {
  return (
    <section className="py-14 md:py-24">
      <Container>
        <SectionHead
          label="КАКОЙ ФОРМАТ ПОДХОДИТ"
          title={<>Покажите задачу,<br />а не тариф</>}
          text="Для клиента это проще: он узнаёт свой сценарий, а менеджер уже предлагает маршрут, документы и следующий шаг."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((f, i) => (
            <div
              key={f.title}
              className="rounded-2xl p-8 bg-white flex gap-6"
              style={{ border: `1px solid ${LINE}` }}
            >
              <div
                style={{
                  color: BRAND,
                  fontSize: 56,
                  fontWeight: 500,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="flex-1">
                <div style={{ color: "rgba(10,18,32,0.4)", fontSize: 11, letterSpacing: "0.14em" }}>
                  {f.tag}
                </div>
                <div className="mt-2" style={{ color: INK, fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em" }}>
                  {f.title}
                </div>
                <div className="mt-3" style={{ color: "rgba(10,18,32,0.55)", fontSize: 14, lineHeight: 1.55 }}>
                  {f.desc}
                </div>
                <a href="#" className="mt-5 inline-flex items-center gap-1" style={{ color: BRAND, fontSize: 13 }}>
                  Обсудить сценарий <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Enterprise() {
  const chips = [
    "Регулярные поставки",
    "Несколько поставщиков",
    "Контроль для ВЭД и бухгалтерии",
    "Единая точка управления",
  ];
  return (
    <section className="py-6">
      <Container>
        <div
          className="relative overflow-hidden rounded-[28px] p-8 md:p-14"
          style={{ background: NAVY }}
        >
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: "rgba(240,68,31,0.18)" }}
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7">
              <EyebrowLabel onDark>ДЛЯ КРУПНОГО БИЗНЕСА</EyebrowLabel>
              <div className="mt-6">
                <Display size="lg" onDark>
                  Регулярный импорт<br />
                  <span style={{ color: BRAND }}>без потери контроля</span><br />
                  между отделами
                </Display>
              </div>
              <div className="mt-6 max-w-xl">
                <BodyText onDark>
                  Для компаний с постоянными поставками важна управляемость: кто отвечает
                  за груз, какие документы готовы, где находится партия и что нужно для
                  следующей отгрузки.
                </BodyText>
              </div>
              <div className="mt-8">
                <PillBtn size="lg" variant="primary">Обсудить регулярные поставки</PillBtn>
              </div>
            </div>
            <div className="lg:col-span-5 self-center space-y-3">
              {chips.map((c, i) => (
                <div
                  key={c}
                  className="rounded-2xl px-5 py-4 flex items-center justify-between"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-white/40" style={{ fontSize: 11, letterSpacing: "0.14em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white" style={{ fontSize: 15 }}>{c}</span>
                  </div>
                  <ArrowRight size={16} className="text-white/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
