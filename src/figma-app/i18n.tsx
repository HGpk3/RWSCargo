import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type React from "react";
import { BRAND } from "./components/shared";

type Lang = "ru" | "en" | "zh";
type Translation = Partial<Record<Exclude<Lang, "ru">, string>>;

const STORAGE_KEY = "rwscargo-language";

const languages: Array<{ code: Lang; label: string; htmlLang: string; ariaLabel: string }> = [
  { code: "ru", label: "RU", htmlLang: "ru", ariaLabel: "Русский язык" },
  { code: "en", label: "EN", htmlLang: "en", ariaLabel: "English language" },
  { code: "zh", label: "中文", htmlLang: "zh-CN", ariaLabel: "中文" },
];

const metaByLang: Record<Lang, { title: string; description: string; locale: string }> = {
  ru: {
    title: "Доставка грузов из Китая в Россию под ключ и в белую - RWSCargo / РВС Карго",
    description:
      "RWSCargo / РВС Карго организует импорт, выкуп, проверку, оформление и доставку грузов из Китая в Россию для бизнеса: авто, авиа, ЖД, контейнеры и сборные партии.",
    locale: "ru_RU",
  },
  en: {
    title: "Turnkey cargo delivery from China to Russia - RWSCargo",
    description:
      "RWSCargo organizes import, purchasing, inspection, paperwork and cargo delivery from China to Russia for businesses: truck, air, rail, containers and consolidated shipments.",
    locale: "en_US",
  },
  zh: {
    title: "中国到俄罗斯一站式货运服务 - RWSCargo",
    description:
      "RWSCargo 为企业提供中国到俄罗斯进口、采购、验货、文件办理和货运服务：汽运、空运、铁路、集装箱和拼货。",
    locale: "zh_CN",
  },
};

const dictionary: Record<string, Translation> = {
  "Услуги": { en: "Services", zh: "服务" },
  "Доставка": { en: "Delivery", zh: "运输" },
  "Калькулятор": { en: "Calculator", zh: "计算器" },
  "Процесс": { en: "Process", zh: "流程" },
  "Контакты": { en: "Contacts", zh: "联系方式" },
  "Рассчитать": { en: "Calculate", zh: "计算" },
  "Открыть меню": { en: "Open menu", zh: "打开菜单" },
  "ИМПОРТ ИЗ КИТАЯ ДЛЯ БИЗНЕСА · С 2018 ГОДА": {
    en: "Import from China for business · since 2018",
    zh: "中国进口业务 · 自 2018 年起",
  },
  "ИМПОРТ": { en: "IMPORT", zh: "进口" },
  "ИЗ КИТАЯ": { en: "CHINA", zh: "来自中国" },
  "ПОД": { en: "FULL", zh: "一站式" },
  "КЛЮЧ": { en: "SERVICE", zh: "服务" },
  "Покупаем, проверяем, оформляем и доставляем товары из Китая в Россию.": {
    en: "We buy, inspect, clear and deliver goods from China to Russia.",
    zh: "我们采购、验货、清关并将货物从中国运往俄罗斯。",
  },
  "Сначала собираем понятную схему поставки — потом везём груз.": {
    en: "First we build a clear supply plan, then we move the cargo.",
    zh: "先制定清晰的供应方案，再安排运输。",
  },
  "Покупаем, проверяем, оформляем и доставляем товары из Китая в Россию. Сначала собираем понятную схему поставки — потом везём груз.": {
    en: "We buy, inspect, clear and deliver goods from China to Russia. First we build a clear supply plan, then we move the cargo.",
    zh: "我们采购、验货、清关并将货物从中国运往俄罗斯。先制定清晰的供应方案，再安排运输。",
  },
  "Получить расчёт": { en: "Get a quote", zh: "获取报价" },
  "Посмотреть процесс": { en: "View process", zh: "查看流程" },
  "РАСЧЁТ": { en: "QUOTE", zh: "报价" },
  "ТРЕКИНГ": { en: "TRACKING", zh: "追踪" },
  "Гуанчжоу, Китай": { en: "Guangzhou, China", zh: "中国广州" },
  "Москва, Россия": { en: "Moscow, Russia", zh: "俄罗斯莫斯科" },
  "06 июля": { en: "July 06", zh: "7月06日" },
  "Поиск": { en: "Search", zh: "搜索" },
  "СЛЕДУЮЩИЙ ШАГ": { en: "NEXT STEP", zh: "下一步" },
  "Сверить объём и город получения": {
    en: "Check volume and destination city",
    zh: "核对体积和收货城市",
  },
  "МАРШРУТ": { en: "ROUTE", zh: "路线" },
  "10—30 дней": { en: "10—30 days", zh: "10—30 天" },
  "авто · авиа · ЖД": { en: "truck · air · rail", zh: "汽运 · 空运 · 铁路" },
  "трек-поставки": { en: "track shipment", zh: "追踪货运" },
  "работаем с Китаем": { en: "working with China", zh: "深耕中国业务" },
  "склада в Китае": { en: "warehouses in China", zh: "中国仓库" },
  "дней в пути": { en: "days in transit", zh: "运输天数" },
  "доставка по всей России": { en: "delivery across Russia", zh: "俄罗斯全境配送" },
  "С ЧЕГО НАЧАТЬ": { en: "WHERE TO START", zh: "从哪里开始" },
  "Выберите задачу,": { en: "Choose the task,", zh: "选择任务，" },
  "а не услугу из списка": { en: "not a service from a list", zh: "而不是列表中的服务" },
  "Мы говорим на языке результата. Расскажите, что нужно бизнесу — а остальное соберём в понятную поставку.": {
    en: "We speak in outcomes. Tell us what your business needs and we will assemble a clear delivery plan.",
    zh: "我们关注结果。告诉我们业务需求，其余流程由我们整合成清晰方案。",
  },
  "Все сценарии": { en: "All scenarios", zh: "所有场景" },
  "УСЛУГИ RWSCARGO": { en: "RWSCARGO SERVICES", zh: "RWSCARGO 服务" },
  "Все этапы импорта из Китая": { en: "Every stage of importing from China", zh: "中国进口全流程" },
  "в одном процессе": { en: "in one process", zh: "一站式管理" },
  "Все услуги": { en: "All services", zh: "全部服务" },
  "Рассчитать поставку": { en: "Calculate shipment", zh: "计算运输" },
  "Поиск поставщика или фабрики": { en: "Supplier or factory sourcing", zh: "寻找供应商或工厂" },
  "Выкуп товаров из Китая": { en: "Purchase goods in China", zh: "中国代采商品" },
  "Контроль качества и образцов": { en: "Quality and sample control", zh: "质量和样品检查" },
  "Доставка грузов из Китая": { en: "Cargo delivery from China", zh: "中国货物运输" },
  "Официальное оформление": { en: "Official customs paperwork", zh: "正规清关文件" },
  "Переговоры с поставщиком": { en: "Supplier negotiations", zh: "供应商谈判" },
  "ДОКУМЕНТЫ И ОТВЕТСТВЕННОСТЬ": { en: "DOCUMENTS AND RESPONSIBILITY", zh: "文件与责任" },
  "Импорт,": { en: "Import,", zh: "进口，" },
  "который можно": { en: "that your", zh: "可交给" },
  "показать бухгалтерии": { en: "accounting can verify", zh: "财务审核" },
  "ЧТО ФИКСИРУЕМ ДО ОТПРАВКИ": { en: "WHAT WE LOCK BEFORE SHIPPING", zh: "发货前确认内容" },
  "Меньше сюрпризов,": { en: "Fewer surprises,", zh: "减少意外，" },
  "больше управляемости": { en: "more control", zh: "提升可控性" },
  "СПОСОБЫ ДОСТАВКИ": { en: "DELIVERY METHODS", zh: "运输方式" },
  "Подбираем маршрут": { en: "We choose the route", zh: "匹配路线" },
  "под экономику партии": { en: "for shipment economics", zh: "兼顾成本效益" },
  "Сравнить маршруты": { en: "Compare routes", zh: "比较路线" },
  "КАКОЙ ФОРМАТ ПОДХОДИТ": { en: "WHICH FORMAT FITS", zh: "适合的模式" },
  "Покажите задачу,": { en: "Show us the task,", zh: "告诉我们任务，" },
  "а не тариф": { en: "not a tariff", zh: "而不是单一价格" },
  "Обсудить услугу": { en: "Discuss service", zh: "咨询服务" },
  "Обсудить сценарий": { en: "Discuss scenario", zh: "讨论方案" },
  "ДЛЯ РЕГУЛЯРНЫХ ПОСТАВОК": { en: "FOR REGULAR SHIPMENTS", zh: "适合长期供货" },
  "Регулярный импорт": { en: "Regular imports", zh: "长期进口" },
  "без потери": { en: "without losing", zh: "不失去" },
  "контроля": { en: "control", zh: "控制" },
  "между отделами": { en: "between teams", zh: "跨部门协作" },
  "Обсудить регулярные поставки": { en: "Discuss regular shipments", zh: "讨论长期供货" },
  "КИТАЙ → РОССИЯ": { en: "CHINA → RUSSIA", zh: "中国 → 俄罗斯" },
  "Маршруты выглядят по-разному,": { en: "Routes look different,", zh: "路线各不相同，" },
  "но логика одна": { en: "but the logic is the same", zh: "但逻辑一致" },
  "ДОКУМЕНТЫ ДО ОТПРАВКИ": { en: "DOCUMENTS BEFORE SHIPPING", zh: "发货前文件" },
  "Сначала сверяем бумажную часть,": { en: "First we check the paperwork,", zh: "先核对文件，" },
  "потом двигаем груз": { en: "then we move the cargo", zh: "再安排货运" },
  "ГРУЗЫ И ТОВАРЫ": { en: "CARGO AND GOODS", zh: "货物品类" },
  "Работаем с коммерческими партиями,": { en: "We work with commercial shipments,", zh: "服务商业批量货物，" },
  "маркетплейсами и производством": { en: "marketplaces and manufacturing", zh: "电商平台与生产供应链" },
  "КАК РАБОТАЕМ": { en: "HOW WE WORK", zh: "我们的流程" },
  "Пять шагов": { en: "Five steps", zh: "五个步骤" },
  "без хаоса в переписках": { en: "without chat chaos", zh: "避免沟通混乱" },
  "ОПЕРАЦИОННЫЕ СЦЕНАРИИ": { en: "OPERATIONAL SCENARIOS", zh: "运营场景" },
  "Два типовых маршрута": { en: "Two typical routes", zh: "两种典型路线" },
  "вместо абстрактного процесса": { en: "instead of an abstract process", zh: "替代抽象流程" },
  "ЧЕСТНЫЕ ОГРАНИЧЕНИЯ": { en: "HONEST LIMITS", zh: "明确限制" },
  "Честные ограничения": { en: "Honest limitations", zh: "明确限制" },
  "делают расчёт": { en: "make the quote", zh: "让报价" },
  "точнее": { en: "more accurate", zh: "更准确" },
  "Доставка товаров из Китая в Россию": { en: "Goods delivery from China to Russia", zh: "中国到俄罗斯商品运输" },
  "с понятной ответственностью": { en: "with clear responsibility", zh: "责任清晰" },
  "Частые вопросы": { en: "Frequently asked questions", zh: "常见问题" },
  "о": { en: "about", zh: "关于" },
  "доставке": { en: "delivery", zh: "运输" },
  "из Китая": { en: "from China", zh: "中国" },
  "НЕ НАШЛИ ОТВЕТ?": { en: "DIDN'T FIND AN ANSWER?", zh: "没有找到答案？" },
  "КАЛЬКУЛЯТОР ДОСТАВКИ": { en: "DELIVERY CALCULATOR", zh: "运输计算器" },
  "Прикиньте": { en: "Estimate", zh: "估算" },
  "ориентир": { en: "the range", zh: "费用范围" },
  "до заявки": { en: "before request", zh: "提交前" },
  "ВЕС, КГ": { en: "WEIGHT, KG", zh: "重量，KG" },
  "ОБЪЁМ, М³": { en: "VOLUME, M³", zh: "体积，M³" },
  "СПОСОБ ДОСТАВКИ": { en: "DELIVERY METHOD", zh: "运输方式" },
  "ГОРОД": { en: "CITY", zh: "城市" },
  "ДОПОЛНИТЕЛЬНО": { en: "EXTRAS", zh: "附加服务" },
  "Авто": { en: "Truck", zh: "汽运" },
  "Авиа": { en: "Air", zh: "空运" },
  "ЖД": { en: "Rail", zh: "铁路" },
  "Контейнер": { en: "Container", zh: "集装箱" },
  "Проверка качества": { en: "Quality check", zh: "质量检查" },
  "Документы": { en: "Documents", zh: "文件" },
  "Забор у поставщика": { en: "Supplier pickup", zh: "供应商提货" },
  "ПРЕДВАРИТЕЛЬНО": { en: "PRELIMINARY", zh: "预估" },
  "СРОК": { en: "TIME", zh: "时效" },
  "дней": { en: "days", zh: "天" },
  "ВКЛЮЧЕНО": { en: "INCLUDED", zh: "包含" },
  "Обсудить расчёт": { en: "Discuss quote", zh: "讨论报价" },
  "ЗАЯВКА НА РАСЧЁТ": { en: "QUOTE REQUEST", zh: "报价申请" },
  "Обсудим груз,": { en: "Let's discuss cargo,", zh: "讨论货物，" },
  "поставщика": { en: "supplier", zh: "供应商" },
  "и маршрут": { en: "and route", zh: "和路线" },
  "Ваше имя": { en: "Your name", zh: "您的姓名" },
  "Телефон": { en: "Phone", zh: "电话" },
  "Опишите груз, ссылку на поставщика, город получения": {
    en: "Describe cargo, supplier link and destination city",
    zh: "描述货物、供应商链接和收货城市",
  },
  "Отправить заявку": { en: "Send request", zh: "发送申请" },
  "Нажимая, вы соглашаетесь с политикой ПДн": {
    en: "By clicking, you agree to the personal data policy",
    zh: "点击即表示您同意个人数据政策",
  },
  "НАВИГАЦИЯ": { en: "NAVIGATION", zh: "导航" },
  "КОНТАКТЫ": { en: "CONTACTS", zh: "联系方式" },
  "Написать в мессенджер": { en: "Message us", zh: "发送消息" },
  "Политика ПДн": { en: "Privacy policy", zh: "隐私政策" },
  "Согласие ПДн": { en: "Data consent", zh: "数据同意" },
};

Object.assign(dictionary, {
  "Найти поставщика": { en: "Find a supplier", zh: "寻找供应商" },
  "Нужна фабрика, цена, образцы или проверка производителя до закупки.": {
    en: "Need a factory, price, samples or manufacturer check before purchase.",
    zh: "需要工厂、价格、样品或采购前的厂家核查。",
  },
  "Выкупить товар": { en: "Purchase goods", zh: "代采商品" },
  "Есть ссылка или контакт в Китае, нужно безопасно оплатить и принять товар.": {
    en: "You have a link or contact in China and need safe payment and receiving.",
    zh: "已有中国链接或联系人，需要安全付款并收货。",
  },
  "Доставить партию": { en: "Deliver a shipment", zh: "运输批量货物" },
  "Груз уже готов, нужен маршрут, склад, консолидация и понятный срок.": {
    en: "Cargo is ready; you need a route, warehouse, consolidation and clear timing.",
    zh: "货物已备好，需要路线、仓库、合并和明确时效。",
  },
  "Оформить импорт": { en: "Arrange import", zh: "办理进口" },
  "Нужны документы, ответственность и схема, которую можно показать бухгалтерии.": {
    en: "Need documents, responsibility and a scheme your accounting team can review.",
    zh: "需要文件、责任划分和可供财务审核的方案。",
  },
  "ЧТО ИЗМЕНИЛИ В ПОДХОДЕ": { en: "WHAT CHANGED IN OUR APPROACH", zh: "方法上的改变" },
  "Не просто перевозим коробки.": { en: "We do more than move boxes.", zh: "我们不只是搬运箱子。" },
  "Собираем управляемую поставку.": { en: "We build a controlled shipment.", zh: "我们打造可控供应链。" },
  "Понятная схема до оплаты": { en: "Clear plan before payment", zh: "付款前方案清晰" },
  "видите план поставки заранее": { en: "you see the supply plan in advance", zh: "提前看到供货计划" },
  "Ответственная передача": { en: "Responsible handover", zh: "责任明确的交付" },
  "менеджер сопровождает до склада в РФ": { en: "a manager supports you until the Russian warehouse", zh: "经理跟进至俄罗斯仓库" },
  "Документы до отправки": { en: "Documents before shipping", zh: "发货前文件" },
  "инвойс, упаковочный, контракт": { en: "invoice, packing list, contract", zh: "发票、装箱单、合同" },

  "Подбираем производителей под товар, запрашиваем реальные фото и видео, проверяем образцы и согласуем условия закупки.": {
    en: "We select manufacturers for your product, request real photos and videos, check samples and agree purchase terms.",
    zh: "我们按产品筛选厂家，索取真实照片和视频，检查样品并确认采购条件。",
  },
  "фабрики и альтернативные поставщики": { en: "factories and alternative suppliers", zh: "工厂和备选供应商" },
  "цены, MOQ и сроки производства": { en: "prices, MOQ and production time", zh: "价格、MOQ 和生产周期" },
  "брендирование и упаковка": { en: "branding and packaging", zh: "品牌定制和包装" },
  "Вы присылаете ссылку или контакт поставщика, мы проверяем условия, выкупаем товар, принимаем его на склад и готовим к отправке.": {
    en: "You send a supplier link or contact; we check terms, purchase the goods, receive them at the warehouse and prepare shipment.",
    zh: "您发送供应商链接或联系方式；我们核查条件、代采商品、入仓并准备发运。",
  },
  "1688, Alibaba и прямые фабрики": { en: "1688, Alibaba and direct factories", zh: "1688、Alibaba 和直连工厂" },
  "оплата поставщику": { en: "supplier payment", zh: "向供应商付款" },
  "приёмка и консолидация": { en: "receiving and consolidation", zh: "收货与合并" },
  "Проверяем количество, комплектацию, упаковку и качество партии до того, как груз уйдёт из Китая.": {
    en: "We check quantity, contents, packaging and quality before the cargo leaves China.",
    zh: "货物离开中国前，我们核对数量、配置、包装和质量。",
  },
  "фото- и видеоотчёт": { en: "photo and video report", zh: "照片和视频报告" },
  "тестирование по ТЗ": { en: "testing by specification", zh: "按要求测试" },
  "рекомендация до закупки": { en: "recommendation before purchase", zh: "采购前建议" },
  "Для коммерческих партий заранее обсуждаем документы, формат ввоза, инвойсы, контрактную часть и закрывающие документы.": {
    en: "For commercial shipments, we discuss documents, import format, invoices, contract details and closing paperwork in advance.",
    zh: "商业批量货物会提前确认文件、进口形式、发票、合同部分和结算文件。",
  },
  "документы до отправки": { en: "documents before shipping", zh: "发货前文件" },
  "понятная ответственность": { en: "clear responsibility", zh: "责任清晰" },
  "поставка для бухгалтерии": { en: "accounting-ready shipment", zh: "适合财务审核的供货" },
  "Организуем онлайн-переговоры с китайским поставщиком, переводчиком и фиксацией договорённостей по цене, срокам и доработкам.": {
    en: "We arrange online negotiations with the Chinese supplier, interpreter and documented agreements on price, timing and revisions.",
    zh: "我们组织与中国供应商的线上谈判，配翻译并固定价格、周期和修改事项。",
  },
  "перевод и смысл без потерь": { en: "translation without losing meaning", zh: "准确翻译不失真" },
  "условия производства": { en: "production terms", zh: "生产条件" },
  "контроль спорных деталей": { en: "control of disputed details", zh: "争议细节管控" },
  "01 · ФЛАГМАН": { en: "01 · FLAGSHIP", zh: "01 · 核心服务" },
  "ПРИНИМАЕМ ЗАЯВКИ": { en: "ACCEPTING REQUESTS", zh: "接受申请" },
  "Доставка": { en: "Delivery", zh: "运输" },
  "грузов": { en: "cargo", zh: "货物" },
  "из Китая": { en: "from China", zh: "来自中国" },
  "Считаем маршрут под вес, объём, срочность и экономику партии: авто, авиа, железная дорога, контейнер или сборный груз.": {
    en: "We calculate the route by weight, volume, urgency and shipment economics: truck, air, rail, container or consolidated cargo.",
    zh: "我们按重量、体积、紧急程度和成本测算路线：汽运、空运、铁路、集装箱或拼货。",
  },
  "авто": { en: "truck", zh: "汽运" },
  "авиа": { en: "air", zh: "空运" },
  "срочно": { en: "urgent", zh: "紧急" },
  "ЖД": { en: "rail", zh: "铁路" },
  "море": { en: "sea", zh: "海运" },
  "контейнер": { en: "container", zh: "集装箱" },
  "Можно подключить только доставку или собрать поставку под ключ: от поиска фабрики и выкупа товара до оформления документов и передачи партии в России.": {
    en: "You can order only delivery or build a turnkey shipment: from factory sourcing and purchase to documents and handover in Russia.",
    zh: "您可以只做运输，也可以做一站式供货：从找工厂和代采，到文件办理和俄罗斯交付。",
  },

  "инвойс и упаковочный лист": { en: "invoice and packing list", zh: "发票和装箱单" },
  "контроль поставщика": { en: "supplier control", zh: "供应商管控" },
  "консолидация на складе": { en: "warehouse consolidation", zh: "仓库合并" },
  "поставка в белую": { en: "official white import", zh: "正规进口" },
  "БЕЛЫЙ ИМПОРТ И КОНТРОЛЬ": { en: "WHITE IMPORT AND CONTROL", zh: "正规进口与管控" },
  "Импорт, который можно": { en: "Import your", zh: "可供" },
  "показать": { en: "accounting", zh: "财务" },
  "бухгалтерии": { en: "can review", zh: "审核的进口" },
  "Для коммерческих партий важны не только сроки. Нужны понятные документы, прогнозируемый маршрут, ответственная передача и контроль до отправки.": {
    en: "Commercial shipments need more than timing: clear documents, predictable route, responsible handover and control before shipping.",
    zh: "商业货物不仅看时效，还需要清晰文件、可预测路线、责任交付和发货前管控。",
  },
  "товар и количество мест": { en: "goods and package count", zh: "商品和件数" },
  "вес, объём и упаковка": { en: "weight, volume and packaging", zh: "重量、体积和包装" },
  "поставщик и условия закупки": { en: "supplier and purchase terms", zh: "供应商和采购条件" },
  "маршрут и формат оформления": { en: "route and paperwork format", zh: "路线和文件形式" },
  "город получения и ответственное лицо": { en: "destination city and responsible person", zh: "收货城市和负责人" },
  "следующий шаг до оплаты": { en: "next step before payment", zh: "付款前下一步" },
  "Клиент быстро видит, что поставка не строится на устных обещаниях.": {
    en: "The client quickly sees that the shipment is not based on verbal promises.",
    zh: "客户能快速看到，供货不是靠口头承诺推进。",
  },
  "Автодоставка": { en: "Truck delivery", zh: "汽运" },
  "Универсальный маршрут для регулярных партий, маркетплейсов, электроники, текстиля и товаров для дома.": {
    en: "A universal route for regular shipments, marketplaces, electronics, textiles and home goods.",
    zh: "适合长期批量、电商、电子、纺织和家居用品的通用路线。",
  },
  "Авиадоставка": { en: "Air delivery", zh: "空运" },
  "быстрее всего": { en: "fastest", zh: "最快" },
  "Для образцов, срочных партий и ситуаций, когда остатки на складе нужно пополнить быстро.": {
    en: "For samples, urgent batches and cases where stock needs to be replenished quickly.",
    zh: "适合样品、急件和需要快速补仓的情况。",
  },
  "ЖД доставка": { en: "Rail delivery", zh: "铁路运输" },
  "стабильно для объёма": { en: "stable for volume", zh: "大批量稳定" },
  "Рациональный вариант для крупных партий, оборудования и грузов, где важен баланс сроков и стоимости.": {
    en: "A rational option for large batches, equipment and cargo where timing and cost balance matter.",
    zh: "适合大批量、设备和需要平衡时效与成本的货物。",
  },
  "Контейнер / сборный": { en: "Container / consolidated", zh: "集装箱 / 拼货" },
  "под ключ": { en: "turnkey", zh: "一站式" },
  "Для коммерческого импорта, крупногабаритных грузов и поставок с официальным оформлением.": {
    en: "For commercial imports, oversized cargo and shipments with official paperwork.",
    zh: "适合商业进口、大件货物和需要正规文件的供货。",
  },
  "Маршрут": { en: "Route", zh: "路线" },
  "Тип груза": { en: "Cargo type", zh: "货物类型" },
  "склад → РФ": { en: "warehouse → Russia", zh: "仓库 → 俄罗斯" },
  "аэропорт → склад": { en: "airport → warehouse", zh: "机场 → 仓库" },
  "терминал → город": { en: "terminal → city", zh: "货站 → 城市" },
  "фабрика → склад": { en: "factory → warehouse", zh: "工厂 → 仓库" },
  "регулярные партии": { en: "regular shipments", zh: "常规批次" },
  "срочные поставки": { en: "urgent shipments", zh: "紧急运输" },
  "объёмные грузы": { en: "volume cargo", zh: "大批量货物" },
  "сборные партии": { en: "consolidated batches", zh: "拼货批次" },
  "Рассчитать авто": { en: "Calculate truck", zh: "计算汽运" },
  "Рассчитать авиа": { en: "Calculate air", zh: "计算空运" },
  "Рассчитать ЖД": { en: "Calculate rail", zh: "计算铁路" },
  "Рассчитать контейнер": { en: "Calculate container", zh: "计算集装箱" },
  "Обсудить": { en: "Discuss", zh: "讨论" },
  "МАРКЕТПЛЕЙСЫ": { en: "MARKETPLACES", zh: "电商平台" },
  "Товары для маркетплейсов": { en: "Goods for marketplaces", zh: "Marketplace goods" },
  "Регулярные партии, упаковка, маркировка, консолидация и понятный срок пополнения склада.": {
    en: "Regular batches, packaging, labeling, consolidation and clear warehouse replenishment time.",
    zh: "长期批量、包装、贴标、合并和明确补仓时效。",
  },
  "КОММЕРЧЕСКАЯ ПАРТИЯ": { en: "COMMERCIAL SHIPMENT", zh: "商业批量" },
  "Партии для бизнеса": { en: "Business shipments", zh: "企业批量货物" },
  "Документы, ответственность, официальный импорт и передача груза компании или складу.": {
    en: "Documents, responsibility, official import and handover to a company or warehouse.",
    zh: "文件、责任、正规进口以及交付给公司或仓库。",
  },
  "ОБОРУДОВАНИЕ": { en: "EQUIPMENT", zh: "设备" },
  "Станки, узлы, комплектующие": { en: "Machines, units, components", zh: "机器、部件、配件" },
  "Габариты, вес, упаковка, маршрут под объём и заранее согласованные документы.": {
    en: "Dimensions, weight, packaging, route by volume and documents agreed in advance.",
    zh: "尺寸、重量、包装、按体积匹配路线，并提前确认文件。",
  },
  "СРОЧНАЯ ПОСТАВКА": { en: "URGENT SHIPMENT", zh: "紧急供货" },
  "Авиа или быстрый авто-маршрут": { en: "Air or fast truck route", zh: "空运或快速汽运" },
  "Когда важнее скорость: образцы, небольшие партии, дефицит остатков и быстрый запуск продаж.": {
    en: "When speed matters most: samples, small batches, low stock and quick sales launch.",
    zh: "适合速度优先：样品、小批量、库存不足和快速上架。",
  },
  "Для клиента это проще: он узнаёт свой сценарий, а менеджер уже предлагает маршрут, документы и следующий шаг.": {
    en: "It is simpler for the client: they recognize their scenario, and the manager offers the route, documents and next step.",
    zh: "对客户更简单：先识别场景，经理再给出路线、文件和下一步。",
  },
  "ДЛЯ КРУПНОГО БИЗНЕСА": { en: "FOR LARGER BUSINESSES", zh: "适合大型业务" },
  "Регулярные поставки": { en: "Regular shipments", zh: "长期供货" },
  "Несколько поставщиков": { en: "Multiple suppliers", zh: "多个供应商" },
  "Контроль для ВЭД и бухгалтерии": { en: "Control for customs and accounting", zh: "外贸和财务管控" },
  "Единая точка управления": { en: "Single control point", zh: "统一管理点" },
  "Для компаний с постоянными поставками важна управляемость: кто отвечает за груз, какие документы готовы, где находится партия и что нужно для следующей отгрузки.": {
    en: "For companies with regular shipments, control matters: who is responsible, which documents are ready, where the batch is and what is needed for the next dispatch.",
    zh: "对长期供货的公司来说，可控性很重要：谁负责货物、哪些文件已准备、货物在哪、下一票需要什么。",
  },

  "Гуанчжоу": { en: "Guangzhou", zh: "广州" },
  "Москва / СПб": { en: "Moscow / St. Petersburg", zh: "莫斯科 / 圣彼得堡" },
  "авто и ЖД": { en: "truck and rail", zh: "汽运和铁路" },
  "Для регулярных поставок, маркетплейсов, электроники, текстиля и товаров для дома.": {
    en: "For regular shipments, marketplaces, electronics, textiles and home goods.",
    zh: "适合长期供货、电商、电子、纺织和家居用品。",
  },
  "Иу": { en: "Yiwu", zh: "义乌" },
  "Регионы РФ": { en: "Russian regions", zh: "俄罗斯地区" },
  "сборные грузы": { en: "consolidated cargo", zh: "拼货" },
  "Для небольших партий, закупок у нескольких поставщиков и консолидации на складе.": {
    en: "For small batches, purchases from several suppliers and warehouse consolidation.",
    zh: "适合小批量、多供应商采购和仓库合并。",
  },
  "Порт / склад": { en: "Port / warehouse", zh: "港口 / 仓库" },
  "Склад клиента": { en: "Client warehouse", zh: "客户仓库" },
  "Для объёмных партий, оборудования и официального коммерческого импорта.": {
    en: "For large batches, equipment and official commercial imports.",
    zh: "适合大批量、设备和正规商业进口。",
  },
  "Мы показываем не абстрактную карту, а рабочие направления: где принимаем груз, как консолидируем и куда передаём партию.": {
    en: "We show working directions, not an abstract map: where we receive cargo, how we consolidate it and where we hand it over.",
    zh: "我们展示实际路线，而不是抽象地图：在哪里收货、如何合并、交付到哪里。",
  },
  "упаковочный лист": { en: "packing list", zh: "装箱单" },
  "контрактная часть": { en: "contract details", zh: "合同部分" },
  "описание товара": { en: "product description", zh: "商品描述" },
  "закрывающие документы": { en: "closing documents", zh: "结算文件" },
  "товары для маркетплейсов": { en: "goods for marketplaces", zh: "Marketplace goods" },
  "электроника и техника": { en: "electronics and appliances", zh: "电子和设备" },
  "одежда, обувь и текстиль": { en: "clothing, footwear and textiles", zh: "服装、鞋类和纺织品" },
  "мебель и товары для дома": { en: "furniture and home goods", zh: "家具和家居用品" },
  "оборудование и станки": { en: "equipment and machines", zh: "设备和机器" },
  "автозапчасти и комплектующие": { en: "auto parts and components", zh: "汽车配件和部件" },
  "образцы и малогабаритные партии": { en: "samples and small-size batches", zh: "样品和小件批量" },
  "контейнерные и сборные грузы": { en: "container and consolidated cargo", zh: "集装箱和拼货" },
  "Разбираем задачу": { en: "Clarify the task", zh: "梳理任务" },
  "Уточняем товар, объём, вес, город получения, сроки и требования к документам.": {
    en: "We clarify the product, volume, weight, destination city, timing and document requirements.",
    zh: "明确商品、体积、重量、收货城市、时效和文件要求。",
  },
  "Проверяем поставщика": { en: "Check the supplier", zh: "核查供应商" },
  "Ищем фабрику, сравниваем предложения, проверяем образцы и фиксируем условия закупки.": {
    en: "We find factories, compare offers, check samples and lock purchase terms.",
    zh: "寻找工厂、比较报价、检查样品并固定采购条件。",
  },
  "Принимаем груз в Китае": { en: "Receive cargo in China", zh: "在中国收货" },
  "Склад в Гуанчжоу или Иу принимает товары, сверяет количество и консолидирует партии.": {
    en: "The Guangzhou or Yiwu warehouse receives goods, checks quantity and consolidates batches.",
    zh: "广州或义乌仓库收货、核对数量并合并批次。",
  },
  "Собираем маршрут и документы": { en: "Build route and documents", zh: "制定路线和文件" },
  "Подбираем способ доставки, обсуждаем инвойсы, упаковочные листы и ответственность.": {
    en: "We choose the delivery method and discuss invoices, packing lists and responsibility.",
    zh: "选择运输方式，并确认发票、装箱单和责任。",
  },
  "Доставляем в Россию": { en: "Deliver to Russia", zh: "运输到俄罗斯" },
  "Контролируем движение груза, передаём партию и помогаем с отправкой по регионам.": {
    en: "We monitor cargo movement, hand over the batch and help dispatch it to regions.",
    zh: "监控货物运输，交付批次并协助发往各地区。",
  },
  "Процесс построен так, чтобы клиент видел не набор обещаний, а последовательность решений.": {
    en: "The process is built so the client sees a sequence of decisions, not a list of promises.",
    zh: "流程让客户看到连续的决策，而不是一堆承诺。",
  },
  "Партия для маркетплейса": { en: "Marketplace shipment", zh: "电商平台货物" },
  "Иу / Гуанчжоу → склад РФ": { en: "Yiwu / Guangzhou → Russian warehouse", zh: "义乌 / 广州 → 俄罗斯仓库" },
  "поставщик найден": { en: "supplier found", zh: "已找到供应商" },
  "выкуп и приёмка": { en: "purchase and receiving", zh: "代采和收货" },
  "проверка упаковки": { en: "packaging check", zh: "包装检查" },
  "авто или сборный груз": { en: "truck or consolidated cargo", zh: "汽运或拼货" },
  "передача в РФ": { en: "handover in Russia", zh: "俄罗斯交付" },
  "Оборудование или комплектующие": { en: "Equipment or components", zh: "设备或配件" },
  "фабрика → контейнер / ЖД": { en: "factory → container / rail", zh: "工厂 → 集装箱 / 铁路" },
  "сверяем документы": { en: "check documents", zh: "核对文件" },
  "фиксируем габариты": { en: "lock dimensions", zh: "确认尺寸" },
  "выбираем маршрут": { en: "choose route", zh: "选择路线" },
  "готовим оформление": { en: "prepare paperwork", zh: "准备文件" },
  "контролируем передачу": { en: "control handover", zh: "管控交付" },
  "СЦЕНАРИЙ": { en: "SCENARIO", zh: "场景" },
  "Поставщики и ссылки уже собраны: проверяем условия, выкупаем товар и заранее выбираем склад/маршрут.": {
    en: "Suppliers and links are already collected: we check terms, purchase goods and choose the warehouse/route in advance.",
    zh: "供应商和链接已整理：我们核对条件、代采货物，并提前选择仓库和路线。",
  },
  "маркировка и упаковка под маркетплейс": { en: "marketplace labeling and packaging", zh: "电商平台标识和包装" },
  "количество мест, вес и объём": { en: "number of packages, weight and volume", zh: "件数、重量和体积" },
  "фотоотчёт до отправки": { en: "photo report before shipping", zh: "发货前照片报告" },
  "Партия приходит в РФ с понятным сроком, документами и точкой передачи.": {
    en: "The shipment arrives in Russia with clear timing, documents and handover point.",
    zh: "批次按明确时效、文件和交付点抵达俄罗斯。",
  },
  "Для тяжёлых и габаритных грузов сначала фиксируем технические параметры, затем выбираем маршрут и формат оформления.": {
    en: "For heavy and oversized cargo we first lock technical parameters, then choose the route and paperwork format.",
    zh: "对于重货和大件货，先确认技术参数，再选择路线和文件方案。",
  },
  "инвойс, упаковочный лист и код ТН ВЭД": { en: "invoice, packing list and HS code", zh: "发票、装箱单和海关编码" },
  "габариты, вес и требования к погрузке": { en: "dimensions, weight and loading requirements", zh: "尺寸、重量和装货要求" },
  "страхование и ответственные точки передачи": { en: "insurance and responsible handover points", zh: "保险和责任交接点" },
  "Груз уходит по согласованной схеме без пересчёта на последнем этапе.": {
    en: "The cargo ships under the agreed plan without recalculation at the final stage.",
    zh: "货物按确认方案发运，最后阶段无需重新核算。",
  },
  "ЧТО УТОЧНЯЕМ": { en: "WHAT WE CLARIFY", zh: "需要确认" },
  "РЕЗУЛЬТАТ": { en: "RESULT", zh: "结果" },
  "Подробнее": { en: "Details", zh: "详情" },
  "Скрыть детали": { en: "Hide details", zh: "收起详情" },
  "не называем финальную цену без веса, объёма и города получения": {
    en: "we do not quote a final price without weight, volume and destination city",
    zh: "没有重量、体积和收货城市，不报最终价格",
  },
  "не обещаем срок без маршрута, склада и формата оформления": {
    en: "we do not promise timing without route, warehouse and paperwork format",
    zh: "没有路线、仓库和文件形式，不承诺时效",
  },
  "не берём запрещённые к перевозке или ввозу грузы": {
    en: "we do not take cargo prohibited for transport or import",
    zh: "不承运禁止运输或进口的货物",
  },
  "не подменяем договор перепиской в мессенджере": {
    en: "we do not replace agreements with messenger chats",
    zh: "不以聊天记录替代合同",
  },
  "ЧТО НЕ ОБЕЩАЕМ": { en: "WHAT WE DO NOT PROMISE", zh: "我们不承诺什么" },
  "Этот блок работает на доверие: пользователь видит, что условия зависят от реальных данных о грузе.": {
    en: "This section builds trust: the user sees that terms depend on real cargo data.",
    zh: "这一部分建立信任：用户看到条件取决于真实货物数据。",
  },
  "RWSCargo / РВС Карго работает с задачами, которые часто ищут как доставка грузов из Китая, доставка товаров из Китая в Россию, доставка из Китая под ключ, выкуп товаров из Китая, доставка для маркетплейсов, сборные грузы из Китая, контейнерная доставка и белый импорт.": {
    en: "RWSCargo works with tasks often searched as cargo delivery from China, goods delivery from China to Russia, turnkey China delivery, product purchasing from China, marketplace delivery, consolidated cargo from China, container delivery and white import.",
    zh: "RWSCargo 处理常见需求：从中国运货、中国到俄罗斯商品运输、中国一站式运输、中国代采、电商运输、中国拼货、集装箱运输和正规进口。",
  },
  "Но для бизнеса важнее не ключевые слова, а результат: найти надёжного производителя, снизить закупочную цену, проверить товар, принять партию на складе в Китае, выбрать маршрут и получить груз в России без потери контроля.": {
    en: "For business, keywords matter less than results: find a reliable manufacturer, reduce purchase price, inspect goods, receive the batch at a China warehouse, choose the route and get cargo in Russia without losing control.",
    zh: "对企业来说，关键词不如结果重要：找到可靠厂家、降低采购价、验货、在中国仓库收货、选择路线，并在不失控的情况下在俄罗斯收货。",
  },

  "Какой срок доставки из Китая в Россию?": { en: "How long does delivery from China to Russia take?", zh: "中国到俄罗斯运输需要多久？" },
  "Зависит от маршрута: авто 10—30 дней, авиа для срочных партий, ЖД и контейнер для объёмов. Точный срок рассчитаем после веса, объёма и города получения.": {
    en: "It depends on the route: truck takes 10—30 days, air is for urgent batches, rail and container are for volume. We calculate exact timing after weight, volume and destination city.",
    zh: "取决于路线：汽运 10—30 天，空运适合急件，铁路和集装箱适合大批量。准确时效需根据重量、体积和收货城市计算。",
  },
  "Можно ли выкупить товар у поставщика за меня?": { en: "Can you purchase goods from a supplier for me?", zh: "你们能帮我向供应商采购吗？" },
  "Да. Вы присылаете ссылку или контакт поставщика, мы проверяем условия, оплачиваем в юанях и принимаем товар на склад в Китае.": {
    en: "Yes. You send a supplier link or contact, we check terms, pay in yuan and receive the goods at our China warehouse.",
    zh: "可以。您发送供应商链接或联系方式，我们核查条件、用人民币付款并在中国仓库收货。",
  },
  "Можно ли оформить поставку официально?": { en: "Can the shipment be arranged officially?", zh: "可以正规办理供货吗？" },
  "Да. Обсуждаем формат ввоза заранее: контрактная часть, инвойсы, упаковочные листы, закрывающие документы — для бухгалтерии и ВЭД.": {
    en: "Yes. We discuss the import format in advance: contract details, invoices, packing lists and closing documents for accounting and customs.",
    zh: "可以。我们提前确认进口形式：合同、发票、装箱单和财务及外贸所需的结算文件。",
  },
  "С какими товарами работает RWSCargo?": { en: "What goods does RWSCargo work with?", zh: "RWSCargo 承接哪些商品？" },
  "Маркетплейсы, электроника, одежда, мебель, оборудование, автозапчасти, сборные и контейнерные грузы. Не берём запрещённые к ввозу.": {
    en: "Marketplace goods, electronics, clothing, furniture, equipment, auto parts, consolidated and container cargo. We do not take goods prohibited for import.",
    zh: "电商商品、电子、服装、家具、设备、汽车配件、拼货和集装箱货物。不承接禁止进口商品。",
  },
  "Есть ли склады в Китае?": { en: "Do you have warehouses in China?", zh: "你们在中国有仓库吗？" },
  "Да, два склада — в Гуанчжоу и Иу. Принимаем товары, сверяем количество, консолидируем партии и готовим упаковку к отправке.": {
    en: "Yes, two warehouses: in Guangzhou and Yiwu. We receive goods, check quantity, consolidate batches and prepare packaging for shipment.",
    zh: "有，两个仓库：广州和义乌。我们收货、核对数量、合并批次并准备发运包装。",
  },
  "Какие данные нужны для расчёта?": { en: "What data is needed for a quote?", zh: "报价需要哪些资料？" },
  "Товар, ссылка или контакт поставщика, вес, объём, город получения, желаемые сроки и формат оформления.": {
    en: "Product, supplier link or contact, weight, volume, destination city, desired timing and paperwork format.",
    zh: "商品、供应商链接或联系方式、重量、体积、收货城市、期望时效和文件形式。",
  },
  "Расчёт показывает предварительный диапазон по логистике из Китая в Россию. Финальная цена, сроки и документы зависят от товара, веса, объёма и города получения.": {
    en: "The calculator shows a preliminary logistics range from China to Russia. Final price, timing and documents depend on product, weight, volume and destination city.",
    zh: "计算器显示中国到俄罗斯物流的预估范围。最终价格、时效和文件取决于商品、重量、体积和收货城市。",
  },
  "маршрут, склад в Китае": { en: "route, warehouse in China", zh: "路线、中国仓库" },
  "Здравствуйте! Хочу обсудить расчёт доставки из Китая.": { en: "Hello! I would like to discuss a China delivery quote.", zh: "您好！我想咨询中国运输报价。" },
  "не указан": { en: "not specified", zh: "未填写" },
  "не указана": { en: "not specified", zh: "未填写" },
  "не указано": { en: "not specified", zh: "未填写" },
  "не выбрано": { en: "not selected", zh: "未选择" },
  "не выбраны": { en: "not selected", zh: "未选择" },
  "поставщик уже найден": { en: "supplier already found", zh: "已找到供应商" },
  "нужен поиск фабрики": { en: "need factory sourcing", zh: "需要找工厂" },
  "нужен выкуп товара": { en: "need product purchase", zh: "需要代采商品" },
  "нужна проверка качества": { en: "need quality check", zh: "需要质量检查" },
  "нужны документы": { en: "need documents", zh: "需要文件" },
  "нужна доставка по РФ": { en: "need delivery across Russia", zh: "需要俄罗斯境内配送" },
  "Здравствуйте! Хочу рассчитать поставку из Китая.": { en: "Hello! I would like to calculate a shipment from China.", zh: "您好！我想计算一票中国供货。" },
  "Опишите товар, объём, ссылку на поставщика, город получения и желаемые сроки. Менеджер предложит формат поставки и следующий шаг.": {
    en: "Describe the product, volume, supplier link, destination city and desired timing. A manager will suggest the shipment format and next step.",
    zh: "请描述商品、体积、供应商链接、收货城市和期望时效。经理会建议供货形式和下一步。",
  },
  "RWSCargo / РВС Карго: надёжные логистические решения для вашего бизнеса с Китаем.": {
    en: "RWSCargo: reliable logistics solutions for your business with China.",
    zh: "RWSCargo：为您的中国业务提供可靠物流解决方案。",
  },
  "© 2026 RWSCargo / РВС Карго. Не является публичной офертой.": {
    en: "© 2026 RWSCargo. Not a public offer.",
    zh: "© 2026 RWSCargo。非公开报价。",
  },
  "не услугу": { en: "not a service", zh: "而不是服务" },
  "из списка": { en: "from a list", zh: "列表中的" },
  "вес": { en: "weight", zh: "重量" },
  "объём": { en: "volume", zh: "体积" },
  "поставщик": { en: "supplier", zh: "供应商" },
  "документы": { en: "documents", zh: "文件" },
  "проверка": { en: "inspection", zh: "验货" },
  "склад": { en: "warehouse", zh: "仓库" },
  "маршрут": { en: "route", zh: "路线" },
  "белый импорт": { en: "white import", zh: "正规进口" },
  "без потери контроля": { en: "without losing control", zh: "不失去控制" },
  "расчёт точнее": { en: "quotes more accurate", zh: "报价更准确" },
  "крупного бизнеса": { en: "larger business", zh: "大型业务" },
  "Маркетплейсы": { en: "Marketplaces", zh: "电商平台" },
  "электроника": { en: "electronics", zh: "电子产品" },
  "одежда": { en: "clothing", zh: "服装" },
  "мебель": { en: "furniture", zh: "家具" },
  "оборудование": { en: "equipment", zh: "设备" },
  "автозапчасти": { en: "auto parts", zh: "汽车配件" },
  "сборные": { en: "consolidated", zh: "拼货" },
  "контейнерные грузы": { en: "container cargo", zh: "集装箱货物" },
  "Ваше имя": { en: "Your name", zh: "您的姓名" },
  "Телефон": { en: "Phone", zh: "电话" },
  "Имя": { en: "Name", zh: "姓名" },
  "Задачи": { en: "Tasks", zh: "任务" },
  "Описание": { en: "Description", zh: "描述" },
  "Вес": { en: "Weight", zh: "重量" },
  "Объём": { en: "Volume", zh: "体积" },
  "Способ": { en: "Method", zh: "方式" },
  "Город": { en: "City", zh: "城市" },
  "Дополнительно": { en: "Extras", zh: "附加服务" },
  "Ориентир на сайте": { en: "Site estimate", zh: "网站估算" },
  "РВС КАРГО": { en: "RVS CARGO", zh: "RVS CARGO" },
  "Москва": { en: "Moscow", zh: "莫斯科" },
  "Наверх": { en: "Back to top", zh: "返回顶部" },
  "РФ": { en: "Russia", zh: "俄罗斯" },
  "а": { en: "not", zh: "而不是" },
  "Не каждый груз нужно везти самым быстрым способом. Мы сравниваем стоимость, сроки, риски и требования к документам, чтобы маршрут не съел маржинальность товара.": {
    en: "Not every cargo should move by the fastest route. We compare cost, timing, risks and document requirements so logistics does not eat the product margin.",
    zh: "不是每票货都适合最快路线。我们比较成本、时效、风险和文件要求，避免物流吞掉商品利润。",
  },
  "ДНЕЙ": { en: "DAYS", zh: "天" },
  "БЫСТРЕЕ ВСЕГО": { en: "FASTEST", zh: "最快" },
  "СТАБИЛЬНО ДЛЯ ОБЪЁМА": { en: "STABLE FOR VOLUME", zh: "大批量稳定" },
  "ПОД КЛЮЧ": { en: "TURNKEY", zh: "一站式" },
  "АВТО И ЖД": { en: "TRUCK AND RAIL", zh: "汽运和铁路" },
  "СБОРНЫЕ ГРУЗЫ": { en: "CONSOLIDATED CARGO", zh: "拼货" },
  "КОНТЕЙНЕР": { en: "CONTAINER", zh: "集装箱" },
  "инвойс": { en: "invoice", zh: "发票" },
  "делают": { en: "make", zh: "让" },
});

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

const reverseDictionary = new Map<string, string>();

for (const [source, values] of Object.entries(dictionary)) {
  reverseDictionary.set(normalizeText(source), source);
  for (const value of Object.values(values)) {
    if (value) {
      reverseDictionary.set(normalizeText(value), source);
    }
  }
}

function translateText(raw: string, lang: Lang) {
  if (!raw.trim()) return raw;

  const leading = raw.match(/^\s*/)?.[0] ?? "";
  const trailing = raw.match(/\s*$/)?.[0] ?? "";
  const core = raw.trim();
  const source = reverseDictionary.get(normalizeText(core)) ?? core;

  if (lang === "ru") {
    if (source !== core) {
      return `${leading}${source}${trailing}`;
    }

    let restored = core;

    for (const [phrase, values] of Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length)) {
      for (const value of Object.values(values)) {
        if (!value || !restored.includes(value)) continue;

        restored = restored.split(value).join(phrase);
      }
    }

    return restored !== core ? `${leading}${restored}${trailing}` : raw;
  }

  const translated = dictionary[source]?.[lang];

  if (translated) {
    return `${leading}${translated}${trailing}`;
  }

  let replaced = core;

  for (const [phrase, values] of Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length)) {
    const value = values[lang];

    if (!value || !replaced.includes(phrase)) continue;

    replaced = replaced.split(phrase).join(value);
  }

  return replaced !== core ? `${leading}${replaced}${trailing}` : raw;
}

Object.assign(dictionary, {
  "Работа строится вокруг понятной схемы поставки: кто поставщик, как проходит закупка, где принимаем груз, какие документы нужны и где происходит передача. Клиент видит маршрут, ответственность и следующий шаг до оплаты и отправки партии.": {
    en: "The work is built around a clear shipment plan: who the supplier is, how purchasing works, where we receive cargo, which documents are needed and where handover happens. The client sees the route, responsibility and next step before payment and shipment.",
    zh: "流程围绕清晰的供货方案展开：供应商是谁、如何采购、在哪里收货、需要哪些文件以及在哪里交付。客户在付款和发货前就能看到路线、责任和下一步。",
  },
  "Отправить в WhatsApp": { en: "Send via WhatsApp", zh: "通过 WhatsApp 发送" },
  "Ориентир, не оферта": { en: "Estimate, not an offer", zh: "预估价格，非正式报价" },
  "политикой ПДн": { en: "privacy policy", zh: "隐私政策" },
  "ЧЕМ ПОДТВЕРЖДАЕМ РАБОТУ": { en: "HOW WE CONFIRM THE WORK", zh: "如何确认工作" },
  "Не просим верить на слово:": { en: "We do not ask you to trust words alone:", zh: "不只靠口头承诺：" },
  "показываем следы поставки": { en: "we show shipment evidence", zh: "展示货运记录" },
  "Вместо абстрактных обещаний клиент получает проверяемые материалы по партии, маршруту и документам.": {
    en: "Instead of abstract promises, the client receives verifiable materials for the shipment, route and documents.",
    zh: "客户获得关于货物、路线和文件的可核查材料，而不是抽象承诺。",
  },
  "Фото- и видеоотчёт": { en: "Photo and video report", zh: "照片和视频报告" },
  "Фиксируем упаковку, количество мест и состояние партии до отправки из Китая.": {
    en: "We record packaging, number of packages and shipment condition before it leaves China.",
    zh: "货物离开中国前，我们记录包装、件数和货物状态。",
  },
  "Документы до движения груза": { en: "Documents before cargo moves", zh: "货物移动前的文件" },
  "Сверяем инвойс, упаковочный лист и данные для оформления до запуска маршрута.": {
    en: "We check the invoice, packing list and paperwork data before the route starts.",
    zh: "路线开始前，我们核对发票、装箱单和申报资料。",
  },
  "Понятный маршрут": { en: "Clear route", zh: "清晰路线" },
  "Показываем, где принимаем груз, как консолидируем и где передаём партию в России.": {
    en: "We show where cargo is received, how it is consolidated and where it is handed over in Russia.",
    zh: "展示收货地点、合并方式以及在俄罗斯的交付地点。",
  },
  "Ответственная передача": { en: "Responsible handover", zh: "明确责任的交付" },
  "Согласуем контакт, город получения и следующий шаг до оплаты и отправки.": {
    en: "We agree the contact, destination city and next step before payment and shipment.",
    zh: "付款和发货前确认联系人、收货城市和下一步。",
  },
});

export function translateValue(raw: string, lang: Lang) {
  return translateText(raw, lang);
}

function translateElementAttributes(element: Element, lang: Lang) {
  for (const attr of ["placeholder", "aria-label", "title"]) {
    const value = element.getAttribute(attr);

    if (value) {
      element.setAttribute(attr, translateText(value, lang));
    }
  }

  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    element.value = translateText(element.value, lang);
  }
}

function translateTree(root: ParentNode, lang: Lang) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const parent = node.parentElement;

    if (!parent || parent.closest("script, style, [data-i18n-ignore]")) continue;

    textNodes.push(node);
  }

  for (const node of textNodes) {
    const next = translateText(node.nodeValue ?? "", lang);

    if (next !== node.nodeValue) {
      node.nodeValue = next;
    }
  }

  const elements = root instanceof Element ? [root, ...Array.from(root.querySelectorAll("*"))] : Array.from(root.querySelectorAll("*"));

  for (const element of elements) {
    if (element.closest("[data-i18n-ignore]")) continue;

    translateElementAttributes(element, lang);
  }
}

function updateMeta(lang: Lang) {
  const meta = metaByLang[lang];
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
  const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
  const ogLocale = document.querySelector<HTMLMetaElement>('meta[property="og:locale"]');

  document.title = meta.title;
  description?.setAttribute("content", meta.description);
  ogTitle?.setAttribute("content", meta.title);
  ogDescription?.setAttribute("content", meta.description);
  ogLocale?.setAttribute("content", meta.locale);
}

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
}>({
  lang: "ru",
  setLang: () => undefined,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("lang");

    if (requested === "ru" || requested === "en" || requested === "zh") {
      setLangState(requested);
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored === "ru" || stored === "en" || stored === "zh") {
      setLangState(stored);
    }
  }, []);

  useEffect(() => {
    const language = languages.find((item) => item.code === lang) ?? languages[0];
    let applying = false;

    const apply = () => {
      applying = true;
      document.documentElement.lang = language.htmlLang;
      window.localStorage.setItem(STORAGE_KEY, lang);
      updateMeta(lang);
      translateTree(document.querySelector("[data-i18n-root]") ?? document.body, lang);
      applying = false;
    };

    apply();

    const observer = new MutationObserver(() => {
      if (!applying) {
        window.requestAnimationFrame(apply);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "aria-label", "title"],
    });

    return () => observer.disconnect();
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang: setLangState,
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSwitcher({ onDark = false }: { onDark?: boolean }) {
  const { lang, setLang } = useLanguage();

  return (
    <div data-i18n-ignore className="inline-flex items-center gap-1" aria-label="Language">
      {languages.map((item) => {
        const active = item.code === lang;

        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLang(item.code)}
            aria-pressed={active}
            aria-label={item.ariaLabel}
            className="rounded-full px-2.5 py-1 transition-colors"
            style={{
              color: active ? "#FFFFFF" : onDark ? "rgba(255,255,255,0.68)" : "rgba(10,18,32,0.62)",
              background: active ? BRAND : "transparent",
              border: `1px solid ${active ? BRAND : onDark ? "rgba(255,255,255,0.14)" : "rgba(10,18,32,0.1)"}`,
              fontSize: 12,
              lineHeight: 1,
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
