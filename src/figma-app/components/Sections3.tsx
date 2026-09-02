import { useState } from "react";
import { ArrowRight, Camera, ChevronDown, FileCheck, Handshake, MapPin, Route } from "lucide-react";
import { Container, SectionHead, EyebrowLabel, Display, BodyText, BRAND, INK, LINE, NAVY } from "./shared";

const routes = [
  { from: "Гуанчжоу", to: "Москва / СПб", tag: "авто и ЖД", desc: "Для регулярных поставок, маркетплейсов, электроники, текстиля и товаров для дома.", days: "12—24" },
  { from: "Иу", to: "Регионы РФ", tag: "сборные грузы", desc: "Для небольших партий, закупок у нескольких поставщиков и консолидации на складе.", days: "18—30" },
  { from: "Порт / склад", to: "Склад клиента", tag: "контейнер", desc: "Для объёмных партий, оборудования и официального коммерческого импорта.", days: "30—45" },
];

export function Routes() {
  return (
    <section id="routes" className="py-14 md:py-24">
      <Container>
        <SectionHead
          label="КИТАЙ → РОССИЯ"
          title={<>Маршруты выглядят по-разному,<br />но логика одна</>}
          text="Мы показываем не абстрактную карту, а рабочие направления: где принимаем груз, как консолидируем и куда передаём партию."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {routes.map((r) => (
            <div
              key={r.from + r.to}
              className="rounded-2xl p-7 bg-white flex flex-col"
              style={{ border: `1px solid ${LINE}` }}
            >
              <div style={{ color: BRAND, fontSize: 11, letterSpacing: "0.14em" }}>
                {r.tag.toUpperCase()}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center gap-2" style={{ color: INK, fontSize: 17, fontWeight: 500 }}>
                  <MapPin size={14} style={{ color: BRAND }} />
                  {r.from}
                </div>
              </div>
              <div className="my-3 flex items-center gap-3">
                <div className="flex-1 relative h-px" style={{ background: LINE }}>
                  <div className="absolute left-1/2 -top-1 w-2 h-2 rounded-full" style={{ background: BRAND }} />
                </div>
                <div style={{ color: "rgba(10,18,32,0.4)", fontSize: 12 }}>{r.days} дней</div>
              </div>
              <div className="flex items-center gap-2" style={{ color: INK, fontSize: 17, fontWeight: 500 }}>
                <MapPin size={14} style={{ color: INK }} />
                {r.to}
              </div>
              <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${LINE}`, color: "rgba(10,18,32,0.55)", fontSize: 13, lineHeight: 1.55 }}>
                {r.desc}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const docs = ["инвойс", "упаковочный лист", "контрактная часть", "описание товара", "фото- и видеоотчёт", "закрывающие документы"];

export function Documents() {
  return (
    <section id="documents" className="py-14 md:py-24" style={{ background: "#E4E0D3" }}>
      <Container>
        <SectionHead
          label="ДОКУМЕНТЫ ДО ОТПРАВКИ"
          title={<>Сначала сверяем бумажную часть,<br />потом двигаем груз</>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {docs.map((d, i) => (
            <div
              key={d}
              className="rounded-2xl p-7 bg-white flex items-center gap-6"
              style={{ border: `1px solid ${LINE}` }}
            >
              <div style={{ color: BRAND, fontSize: 38, fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ color: INK, fontSize: 17, fontWeight: 500 }}>{d}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const proofPoints = [
  {
    icon: <Camera size={20} />,
    title: "Фото- и видеоотчёт",
    text: "Фиксируем упаковку, количество мест и состояние партии до отправки из Китая.",
  },
  {
    icon: <FileCheck size={20} />,
    title: "Документы до движения груза",
    text: "Сверяем инвойс, упаковочный лист и данные для оформления до запуска маршрута.",
  },
  {
    icon: <Route size={20} />,
    title: "Понятный маршрут",
    text: "Показываем, где принимаем груз, как консолидируем и где передаём партию в России.",
  },
  {
    icon: <Handshake size={20} />,
    title: "Ответственная передача",
    text: "Согласуем контакт, город получения и следующий шаг до оплаты и отправки.",
  },
];

export function ProofPoints() {
  return (
    <section id="proof-points" className="py-14 md:py-24">
      <Container>
        <SectionHead
          label="ЧЕМ ПОДТВЕРЖДАЕМ РАБОТУ"
          title={<>Не просим верить на слово:<br />показываем следы поставки</>}
          text="Вместо абстрактных обещаний клиент получает проверяемые материалы по партии, маршруту и документам."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {proofPoints.map((item, i) => (
            <div
              key={item.title}
              className="rounded-2xl p-6 bg-white flex flex-col gap-8"
              style={{ border: `1px solid ${LINE}` }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(240,68,31,0.1)", color: BRAND }}
                >
                  {item.icon}
                </div>
                <span style={{ color: "rgba(10,18,32,0.35)", fontSize: 12 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <div style={{ color: INK, fontSize: 18, fontWeight: 500, lineHeight: 1.2 }}>
                  {item.title}
                </div>
                <div className="mt-3" style={{ color: "rgba(10,18,32,0.58)", fontSize: 13.5, lineHeight: 1.55 }}>
                  {item.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const tags = [
  "товары для маркетплейсов",
  "электроника и техника",
  "одежда, обувь и текстиль",
  "мебель и товары для дома",
  "оборудование и станки",
  "автозапчасти и комплектующие",
  "образцы и малогабаритные партии",
  "контейнерные и сборные грузы",
];

export function CargoTypes() {
  return (
    <section id="cargo-types" className="py-14 md:py-24">
      <Container>
        <SectionHead
          label="ГРУЗЫ И ТОВАРЫ"
          title={<>Работаем с коммерческими партиями,<br />маркетплейсами и производством</>}
        />
        <div className="flex flex-wrap gap-3">
          {tags.map((t) => (
            <div
              key={t}
              className="rounded-full px-5 py-3 bg-white"
              style={{
                border: `1px solid ${LINE}`,
                color: INK,
                fontSize: 14,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const steps = [
  { title: "Разбираем задачу", desc: "Уточняем товар, объём, вес, город получения, сроки и требования к документам." },
  { title: "Проверяем поставщика", desc: "Ищем фабрику, сравниваем предложения, проверяем образцы и фиксируем условия закупки." },
  { title: "Принимаем груз в Китае", desc: "Склад в Гуанчжоу или Иу принимает товары, сверяет количество и консолидирует партии." },
  { title: "Собираем маршрут и документы", desc: "Подбираем способ доставки, обсуждаем инвойсы, упаковочные листы и ответственность." },
  { title: "Доставляем в Россию", desc: "Контролируем движение груза, передаём партию и помогаем с отправкой по регионам." },
];

export function Process() {
  return (
    <section id="process" className="py-6">
      <Container>
        <div
          className="rounded-[28px] p-8 md:p-14"
          style={{ background: NAVY }}
        >
          <SectionHead
            onDark
            label="КАК РАБОТАЕМ"
            title={<>Пять шагов<br />без хаоса в переписках</>}
            text="Процесс построен так, чтобы клиент видел не набор обещаний, а последовательность решений."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                  style={{ background: BRAND, fontSize: 16, fontWeight: 600 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-6 text-white" style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                  {s.title}
                </div>
                <div className="mt-2 text-white/55" style={{ fontSize: 13, lineHeight: 1.55 }}>
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

const scenarios = [
  {
    title: "Партия для своего магазина",
    route: "Иу / Гуанчжоу → склад РФ",
    steps: ["поставщик найден", "выкуп и приёмка", "проверка упаковки", "авто или сборный груз", "передача в РФ"],
    details: {
      summary: "Если поставщик уже найден или есть сертификаты на товар, проверяем условия, выкупаем партию и заранее выбираем склад/маршрут.",
      check: ["сертификаты, маркировка и упаковка", "количество мест, вес и объём", "фотоотчёт до отправки"],
      result: "Партия приходит в РФ с понятным сроком, документами и точкой передачи для магазина.",
    },
  },
  {
    title: "Оборудование или комплектующие",
    route: "фабрика → контейнер / ЖД",
    steps: ["сверяем документы", "фиксируем габариты", "выбираем маршрут", "готовим оформление", "контролируем передачу"],
    details: {
      summary: "Для тяжёлых и габаритных грузов сначала фиксируем технические параметры, затем выбираем маршрут и формат оформления.",
      check: ["инвойс, упаковочный лист и код ТН ВЭД", "габариты, вес и требования к погрузке", "страхование и ответственные точки передачи"],
      result: "Груз уходит по согласованной схеме без пересчёта на последнем этапе.",
    },
  },
];

export function Scenarios() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="operation-scenarios" className="py-14 md:py-24">
      <Container>
        <SectionHead
          label="ОПЕРАЦИОННЫЕ СЦЕНАРИИ"
          title={<>Два типовых маршрута<br />вместо абстрактного процесса</>}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {scenarios.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl p-6 md:p-8 bg-white"
              style={{ border: `1px solid ${LINE}` }}
            >
              <div style={{ color: BRAND, fontSize: 12, letterSpacing: "0.14em" }}>
                СЦЕНАРИЙ {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-4" style={{ color: INK, fontSize: 26, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {s.title}
              </div>
              <div className="mt-2" style={{ color: "rgba(10,18,32,0.5)", fontSize: 14 }}>{s.route}</div>
              <div className="mt-6">
                {s.steps.map((step, j) => (
                  <div
                    key={step}
                    className="flex items-center justify-between py-3.5"
                    style={{ borderTop: `1px solid ${LINE}` }}
                  >
                    <div className="flex items-center gap-4">
                      <span style={{ color: "rgba(10,18,32,0.4)", fontSize: 12 }}>
                        {String(j + 1).padStart(2, "0")}
                      </span>
                      <span style={{ color: INK, fontSize: 14 }}>{step}</span>
                    </div>
                    <ArrowRight size={14} style={{ color: "rgba(10,18,32,0.3)" }} />
                  </div>
                ))}
              </div>
              <div
                aria-hidden={open !== i}
                className="grid transition-[grid-template-rows,opacity] duration-200 ease-out"
                style={{
                  gridTemplateRows: open === i ? "1fr" : "0fr",
                  opacity: open === i ? 1 : 0,
                  contain: "layout paint",
                }}
              >
                <div className="overflow-hidden">
                <div
                  className="mt-6 rounded-2xl p-5 transition-[transform,opacity] duration-200 ease-out"
                  style={{
                    background: "#F5F2EB",
                    border: `1px solid ${LINE}`,
                    opacity: open === i ? 1 : 0,
                    transform: open === i ? "translateY(0)" : "translateY(-4px)",
                    willChange: "transform, opacity",
                  }}
                >
                  <div style={{ color: "rgba(10,18,32,0.6)", fontSize: 14, lineHeight: 1.6 }}>
                    {s.details.summary}
                  </div>
                  <div className="mt-5 grid gap-2">
                    <div style={{ color: BRAND, fontSize: 11, letterSpacing: "0.14em" }}>ЧТО УТОЧНЯЕМ</div>
                    {s.details.check.map((item) => (
                      <div key={item} className="flex items-start gap-3" style={{ color: INK, fontSize: 13.5, lineHeight: 1.45 }}>
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: BRAND }} />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${LINE}` }}>
                    <div style={{ color: BRAND, fontSize: 11, letterSpacing: "0.14em" }}>РЕЗУЛЬТАТ</div>
                    <div className="mt-2" style={{ color: INK, fontSize: 14, lineHeight: 1.55 }}>
                      {s.details.result}
                    </div>
                  </div>
                </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                style={{
                  background: open === i ? INK : "rgba(10,18,32,0.04)",
                  color: open === i ? "#FFFFFF" : INK,
                  border: `1px solid ${open === i ? INK : LINE}`,
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {open === i ? "Скрыть детали" : "Подробнее"}
                <ChevronDown
                  size={15}
                  className="transition-transform"
                  style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

const limits = [
  "не называем финальную цену без веса, объёма и города получения",
  "не обещаем срок без маршрута, склада и формата оформления",
  "не берём запрещённые к перевозке или ввозу грузы",
  "не подменяем договор перепиской в мессенджере",
];

export function Limits() {
  return (
    <section id="limits" className="py-14 md:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <EyebrowLabel>ЧТО НЕ ОБЕЩАЕМ</EyebrowLabel>
            <div className="mt-6">
              <Display size="lg">
                Честные ограничения<br />
                делают <span style={{ color: BRAND }}>расчёт точнее</span>
              </Display>
            </div>
            <div className="mt-6">
              <BodyText>
                Этот блок работает на доверие: пользователь видит, что условия зависят
                от реальных данных о грузе.
              </BodyText>
            </div>
          </div>
          <div className="lg:col-span-7 space-y-3">
            {limits.map((l, i) => (
              <div
                key={l}
                className="rounded-2xl p-6 bg-white flex items-start gap-5"
                style={{ border: `1px solid ${LINE}` }}
              >
                <div style={{ color: BRAND, fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1, minWidth: 40 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ color: INK, fontSize: 16, lineHeight: 1.5 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function SeoBlock() {
  return (
    <section id="seo" className="py-14 md:py-24">
      <Container>
        <SectionHead
          label="ОТВЕТСТВЕННОСТЬ И МАРШРУТ"
          title={<>Доставка товаров из Китая в Россию<br />с понятной ответственностью</>}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <BodyText>
            RWSCargo / РВС Карго работает с задачами, которые часто ищут как
            доставка грузов из Китая, доставка товаров из Китая в Россию, доставка
            из Китая под ключ, выкуп товаров из Китая, доставка для маркетплейсов,
            сборные грузы из Китая, контейнерная доставка и белый импорт.
          </BodyText>
          <BodyText>
            Но для бизнеса важнее не ключевые слова, а результат: найти надёжного
            производителя, снизить закупочную цену, проверить товар, принять партию
            на складе в Китае, выбрать маршрут и получить груз в России без потери
            контроля.
          </BodyText>
        </div>
      </Container>
    </section>
  );
}
