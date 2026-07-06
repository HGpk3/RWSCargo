import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Container, SectionHead, BRAND, INK, LINE, PillBtn, EyebrowLabel, Display, BodyText } from "./shared";

export function Partners() {
  const brands = ["OZON", "WILDBERRIES", "1688", "ALIBABA", "SBERBANK", "CDEK"];
  return (
    <section className="py-10 md:py-14">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div style={{ color: "rgba(10,18,32,0.5)", fontSize: 12, letterSpacing: "0.16em" }}>
            С НАМИ ВОЗЯТ БИЗНЕСЫ И МАРКЕТПЛЕЙСЫ
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4 items-center">
            {brands.map((b) => (
              <div
                key={b}
                style={{
                  fontSize: 15,
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                  color: "rgba(10,18,32,0.35)",
                }}
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Metrics() {
  const items = [
    { n: "2018", l: "работаем с Китаем" },
    { n: "2", l: "склада в Китае" },
    { n: "10—45", l: "дней в пути" },
    { n: "РФ", l: "доставка по всей России" },
  ];
  return (
    <section className="pb-10">
      <Container>
        <div
          className="rounded-3xl grid grid-cols-2 md:grid-cols-4 overflow-hidden"
          style={{ background: "#FFFFFF", border: `1px solid ${LINE}` }}
        >
          {items.map((it, i) => (
            <div
              key={it.l}
              className="p-7 md:p-9"
              style={{
                borderLeft: i > 0 ? `1px solid ${LINE}` : "none",
                borderTop: i >= 2 ? `1px solid ${LINE}` : "none",
              }}
            >
              <div style={{ fontSize: 44, letterSpacing: "-0.03em", fontWeight: 500, color: INK, lineHeight: 1 }}>
                {it.n}
              </div>
              <div className="mt-3" style={{ color: "rgba(10,18,32,0.55)", fontSize: 13 }}>
                {it.l}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function TaskCard({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div
      className="rounded-2xl p-7 bg-white flex flex-col group cursor-pointer transition-all hover:shadow-lg"
      style={{ border: `1px solid ${LINE}` }}
    >
      <div className="flex items-start justify-between">
        <div style={{ color: BRAND, fontSize: 12, letterSpacing: "0.14em" }}>{n}</div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors group-hover:bg-[color:var(--brand)]"
          style={{ background: "rgba(10,18,32,0.05)" }}
        >
          <ArrowUpRight size={16} color={INK} />
        </div>
      </div>
      <div className="mt-10" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em", color: INK, lineHeight: 1.15 }}>
        {title}
      </div>
      <div className="mt-3" style={{ color: "rgba(10,18,32,0.55)", fontSize: 13.5, lineHeight: 1.55 }}>
        {desc}
      </div>
    </div>
  );
}

export function Tasks() {
  return (
    <section className="py-14 md:py-24">
      <Container>
        <SectionHead
          label="С ЧЕГО НАЧАТЬ"
          title={
            <>
              Выберите задачу,<br />
              а <span style={{ color: "rgba(10,18,32,0.35)" }}>не услугу</span> из списка
            </>
          }
          text="Мы говорим на языке результата. Расскажите, что нужно бизнесу — а остальное соберём в понятную поставку."
          action={<PillBtn variant="light">Все сценарии</PillBtn>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TaskCard n="01" title="Найти поставщика" desc="Нужна фабрика, цена, образцы или проверка производителя до закупки." />
          <TaskCard n="02" title="Выкупить товар" desc="Есть ссылка или контакт в Китае, нужно безопасно оплатить и принять товар." />
          <TaskCard n="03" title="Доставить партию" desc="Груз уже готов, нужен маршрут, склад, консолидация и понятный срок." />
          <TaskCard n="04" title="Оформить импорт" desc="Нужны документы, ответственность и схема, которую можно показать бухгалтерии." />
        </div>
      </Container>
    </section>
  );
}

export function Approach() {
  return (
    <section className="py-14 md:py-24">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <EyebrowLabel>ЧТО ИЗМЕНИЛИ В ПОДХОДЕ</EyebrowLabel>
            <div className="mt-6">
              <Display size="lg">
                Не просто перевозим коробки.<br />
                <span style={{ color: BRAND }}>Собираем управляемую поставку.</span>
              </Display>
            </div>
          </div>
          <div className="lg:col-span-6 lg:pt-4">
            <BodyText>
              Старый сайт RWSCargo делал акцент на снижении себестоимости, маркетплейс-бизнесе
              и полном цикле работы с Китаем. В новой версии этот смысл вынесен вперёд:
              поставщик, закупка, проверка, склад, маршрут, документы и передача груза
              должны быть понятны до оплаты и отправки.
            </BodyText>
            <div className="mt-8 space-y-3">
              {[
                ["Понятная схема до оплаты", "видите план поставки заранее"],
                ["Ответственная передача", "менеджер сопровождает до склада в РФ"],
                ["Документы до отправки", "инвойс, упаковочный, контракт"],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="flex items-start justify-between gap-6 py-4"
                  style={{ borderTop: `1px solid ${LINE}` }}
                >
                  <div>
                    <div style={{ color: INK, fontSize: 16, fontWeight: 500 }}>{t}</div>
                    <div className="mt-1" style={{ color: "rgba(10,18,32,0.55)", fontSize: 13 }}>{d}</div>
                  </div>
                  <ArrowRight size={18} className="mt-1" style={{ color: BRAND }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
