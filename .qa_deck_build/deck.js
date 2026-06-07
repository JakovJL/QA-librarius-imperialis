// Innowise QA-stack analysis deck — pptxgenjs (variant A: honest methodology)
const pptxgen = require("pptxgenjs");
const path = require("path");
const A = (f) => path.join(__dirname, "assets", f);

const C = {
  GREEN: "8DC63F", GREEN_D: "6F8C1E", INK: "1B1F1A", INK2: "2D2D2D",
  WHITE: "FFFFFF", PANEL: "F2F5EC", GRAY: "7C8473", GRAYL: "AEB6A2", LIME_L: "C6E27A",
};
const FH = "Arial Black", FS = "Segoe UI Semibold", FB = "Segoe UI";

const p = new pptxgen();
p.defineLayout({ name: "W16", width: 13.333, height: 7.5 });
p.layout = "W16";
const W = 13.333, H = 7.5;

function footer(s, n) {
  s.addText("Innowise · Анализ bench-реестра QA/AQA", { x: 0.55, y: H - 0.42, w: 8, h: 0.3, fontFace: FB, fontSize: 9, color: C.GRAY });
  s.addText(String(n), { x: W - 1.0, y: H - 0.42, w: 0.5, h: 0.3, fontFace: FS, fontSize: 10, color: C.GRAY, align: "right" });
}
function head(s, kicker, title) {
  s.addShape(p.ShapeType.rect, { x: 0.55, y: 0.5, w: 0.13, h: 0.62, fill: { color: C.GREEN } });
  s.addText(kicker.toUpperCase(), { x: 0.78, y: 0.46, w: 11, h: 0.3, fontFace: FS, fontSize: 12, color: C.GREEN_D, charSpacing: 2 });
  s.addText(title, { x: 0.76, y: 0.72, w: 12, h: 0.7, fontFace: FH, fontSize: 29, color: C.INK });
}
const lightBg = (s) => { s.background = { color: C.WHITE }; };

// ===================================================== SLIDE 1 — TITLE
let s = p.addSlide();
s.background = { color: C.INK };
s.addShape(p.ShapeType.rect, { x: 9.7, y: 0, w: 3.63, h: H, fill: { color: C.GREEN } });
s.addShape(p.ShapeType.rect, { x: 9.4, y: 0, w: 0.16, h: H, fill: { color: C.GREEN } });
s.addText("INNOWISE · QA / AQA", { x: 0.7, y: 1.15, w: 8, h: 0.4, fontFace: FS, fontSize: 14, color: C.GREEN, charSpacing: 3 });
s.addText("Какой стек учить\nQA/AQA-инженеру", { x: 0.65, y: 1.7, w: 8.6, h: 2.4, fontFace: FH, fontSize: 44, color: C.WHITE, lineSpacingMultiple: 1.0 });
s.addText("Только Java — или нужен второй язык?\nЧто реально видно в данных, а что — нет.", { x: 0.7, y: 4.15, w: 8.3, h: 1.0, fontFace: FB, fontSize: 17, color: "C9CFC0", lineSpacingMultiple: 1.15 });
[["1148", "запросов (вся история)"], ["n≈95", "рабочая выборка*"], ["2023–2026", "период данных"]].forEach((d, i) => {
  const x = 0.7 + i * 2.85;
  s.addText(d[0], { x, y: 5.45, w: 2.7, h: 0.55, fontFace: FH, fontSize: 24, color: C.GREEN });
  s.addText(d[1], { x, y: 6.02, w: 2.7, h: 0.4, fontFace: FB, fontSize: 11.5, color: "AEB6A2" });
});
s.addText("* запросы за год, где язык явно назван", { x: 0.7, y: 6.5, w: 8, h: 0.3, fontFace: FB, fontSize: 10, color: "8A9282", italic: true });
s.addText("05.06.2026", { x: 10.0, y: 6.6, w: 3.0, h: 0.4, fontFace: FS, fontSize: 14, color: C.INK });

// ===================================================== SLIDE 2 — VERDICT
s = p.addSlide(); lightBg(s);
head(s, "Главный вывод", "Java — да. Но не «только Java»");
s.addShape(p.ShapeType.rect, { x: 0.55, y: 1.7, w: 12.23, h: 1.3, fill: { color: C.INK } });
s.addShape(p.ShapeType.rect, { x: 0.55, y: 1.7, w: 0.16, h: 1.3, fill: { color: C.GREEN } });
s.addText([
  { text: "Учить Java — верно. Второй язык — разумно, но выбор ", options: { color: C.WHITE } },
  { text: "(JS/TS или Python)", options: { color: C.GREEN } },
  { text: " делается по экосистеме, а не из этих цифр.", options: { color: C.WHITE } },
], { x: 0.95, y: 1.7, w: 11.6, h: 1.3, fontFace: FS, fontSize: 20, valign: "middle", lineSpacingMultiple: 1.05 });
[
  ["Java не падает", "Топ-группа спроса, доля стабильна. Ядром оставить."],
  ["Но и не лидирует", "Java, Python, JS/TS статистически неразличимы — Java не впереди."],
  ["Язык вторичен", "4 из 5 запросов вообще не про язык, а про навык автоматизации."],
  ["Второй — по вкусу", "JS/TS (Playwright/веб) или Python (API/data) — данные не выбирают за тебя."],
].forEach((c, i) => {
  const x = 0.55 + (i % 2) * 6.18, y = 3.35 + Math.floor(i / 2) * 1.72;
  s.addShape(p.ShapeType.rect, { x, y, w: 5.95, h: 1.55, fill: { color: C.PANEL }, line: { color: "E3E9D6", width: 1 } });
  s.addShape(p.ShapeType.rect, { x, y, w: 0.12, h: 1.55, fill: { color: C.GREEN } });
  s.addText(c[0], { x: x + 0.3, y: y + 0.18, w: 5.5, h: 0.4, fontFace: FH, fontSize: 16, color: C.INK });
  s.addText(c[1], { x: x + 0.3, y: y + 0.64, w: 5.5, h: 0.85, fontFace: FB, fontSize: 13, color: C.INK2, lineSpacingMultiple: 1.05 });
});
footer(s, 2);

// ===================================================== SLIDE 3 — METHOD + SAMPLE HONESTY
s = p.addSlide(); lightBg(s);
head(s, "Методология", "Что считали и чего данные НЕ говорят");
[
  ["Данные", "Bench-реестр Innowise: 1148 запросов клиентов (2023–2026) и 104 AQA-инженера на бенче. Это пайплайн одной компании, не «весь рынок»."],
  ["Рабочая выборка мала", "Язык назван лишь в 21% запросов. После среза «свежие + с языком» остаётся n≈95. Тонкие срезы — единицы (немецкий 21, Junior 4)."],
].forEach((c, i) => {
  const y = 1.8 + i * 1.35;
  s.addShape(p.ShapeType.ellipse, { x: 0.7, y: y + 0.05, w: 0.85, h: 0.85, fill: { color: C.GREEN } });
  s.addText(String(i + 1), { x: 0.7, y: y + 0.05, w: 0.85, h: 0.85, fontFace: FH, fontSize: 26, color: C.WHITE, align: "center", valign: "middle" });
  s.addText(c[0], { x: 1.85, y: y, w: 10.7, h: 0.45, fontFace: FH, fontSize: 18, color: C.INK });
  s.addText(c[1], { x: 1.85, y: y + 0.48, w: 10.7, h: 0.8, fontFace: FB, fontSize: 13.5, color: C.INK2, lineSpacingMultiple: 1.05 });
});
// "cannot claim" warning box
s.addShape(p.ShapeType.rect, { x: 0.6, y: 4.7, w: 12.15, h: 2.05, fill: { color: "FBF3E7" }, line: { color: "E7C98A", width: 1 } });
s.addShape(p.ShapeType.rect, { x: 0.6, y: 4.7, w: 0.14, h: 2.05, fill: { color: "C98A2E" } });
s.addText("Чего по этим данным утверждать НЕЛЬЗЯ", { x: 0.95, y: 4.85, w: 11.5, h: 0.4, fontFace: FH, fontSize: 15, color: "8A5A12" });
s.addText([
  { text: "•  ранжировать Java / Python / JS-TS между собой — разница в пределах погрешности (±10 п.п.);\n" },
  { text: "•  делать точные выводы о трендах по времени — старые тикеты заполнены беднее (артефакт тегирования);\n" },
  { text: "•  опираться на тонкие срезы (немецкий, грейды, Kotlin) — там единицы наблюдений." },
], { x: 0.95, y: 5.3, w: 11.5, h: 1.35, fontFace: FB, fontSize: 13, color: C.INK2, lineSpacingMultiple: 1.15 });
footer(s, 3);

// ===================================================== SLIDE 4 — 79% AGNOSTIC (robust)
s = p.addSlide(); lightBg(s);
head(s, "Самый надёжный факт", "Спрос почти не про язык");
s.addImage({ path: A("chart_agnostic.png"), x: 0.7, y: 1.75, w: 6.0, h: 5.0 });
s.addShape(p.ShapeType.rect, { x: 7.2, y: 1.9, w: 5.6, h: 4.7, fill: { color: C.PANEL } });
s.addShape(p.ShapeType.rect, { x: 7.2, y: 1.9, w: 5.6, h: 0.12, fill: { color: C.GREEN } });
s.addText("Что это значит", { x: 7.5, y: 2.15, w: 5.0, h: 0.4, fontFace: FH, fontSize: 17, color: C.INK });
s.addText([
  { text: "79% запросов", options: { color: C.GREEN_D, bold: true } },
  { text: " называют не язык, а ", options: {} },
  { text: "вид работы", options: { bold: true } },
  { text: ": «Automation QA», «Manual QA», инструмент или домен.\n\n", options: {} },
  { text: "Это вывод на полной выборке (n=1148) — поэтому надёжный.\n\n", options: { italic: true, color: C.GRAY } },
  { text: "Практический смысл: ", options: { bold: true, color: C.INK } },
  { text: "умение автоматизировать (фреймворк, SQL, API, CI) ценится выше, чем конкретный язык. Язык — инструмент под задачу.", options: {} },
], { x: 7.5, y: 2.6, w: 5.0, h: 3.9, fontFace: FB, fontSize: 14, color: C.INK2, lineSpacingMultiple: 1.1, valign: "top" });
footer(s, 4);

// ===================================================== SLIDE 5 — LANGUAGE TIER (CI)
s = p.addSlide(); lightBg(s);
head(s, "Языки", "Тройка лидеров неотличима друг от друга");
s.addImage({ path: A("chart_langtier.png"), x: 0.4, y: 1.7, w: 8.7, h: 5.0 });
s.addShape(p.ShapeType.rect, { x: 9.3, y: 1.8, w: 3.5, h: 5.0, fill: { color: C.PANEL } });
s.addShape(p.ShapeType.rect, { x: 9.3, y: 1.8, w: 3.5, h: 0.12, fill: { color: C.GREEN } });
s.addText("Как читать", { x: 9.55, y: 2.0, w: 3.05, h: 0.4, fontFace: FH, fontSize: 16, color: C.INK });
s.addText([
  { text: "Усы — 95% доверительный интервал.\n\n", options: { italic: true, color: C.GRAY } },
  { text: "Java, Python, JS/TS", options: { color: C.GREEN_D, bold: true } },
  { text: " — интервалы перекрываются: ранжировать их нельзя, это один тир.\n\n", options: {} },
  { text: "C# / Kotlin", options: { bold: true } },
  { text: " — заметно ниже, нишевые.\n\n", options: {} },
  { text: "Вывод: моноязык покрывает ~⅓ языковых запросов из трёх равных.", options: { color: C.INK } },
], { x: 9.55, y: 2.45, w: 3.05, h: 4.2, fontFace: FB, fontSize: 13, color: C.INK2, lineSpacingMultiple: 1.08, valign: "top" });
footer(s, 5);

// ===================================================== SLIDE 6 — TESTING TYPES (NEW)
s = p.addSlide(); lightBg(s);
head(s, "Виды тестирования", "Что стабильно, а что появляется");
s.addImage({ path: A("chart_testtypes.png"), x: 0.4, y: 1.65, w: 8.8, h: 4.6 });
s.addText("Доля внутри тикетов, где вид указан (нормировка убирает перекос: старые тикеты тегированы беднее). 2023 исключён — всего 11 упоминаний.", {
  x: 0.55, y: 6.35, w: 8.9, h: 0.7, fontFace: FB, fontSize: 11, color: C.GRAY, italic: true, lineSpacingMultiple: 1.0,
});
s.addShape(p.ShapeType.rect, { x: 9.35, y: 1.75, w: 3.45, h: 5.1, fill: { color: C.PANEL } });
s.addShape(p.ShapeType.rect, { x: 9.35, y: 1.75, w: 3.45, h: 0.12, fill: { color: C.GREEN } });
s.addText("Что реально видно", { x: 9.6, y: 1.95, w: 3.0, h: 0.4, fontFace: FH, fontSize: 15, color: C.INK });
s.addText([
  { text: "▲ Performance и Security", options: { color: C.GREEN_D, bold: true } },
  { text: "  — с нуля до 7–8%. Новые специализации.\n\n", options: {} },
  { text: "▼ Mobile", options: { bold: true } },
  { text: "  — доля снижается.\n\n", options: {} },
  { text: "▬ Automation / Manual", options: { bold: true } },
  { text: "  — стабильно ~60/40 в пользу авто (давно, не «рост»).\n\n", options: {} },
  { text: "✕ Accessibility", options: { bold: true, color: "B5524A" } },
  { text: "  — спроса нет (нули).\n\n", options: {} },
  { text: "Числа малы (Perf 25, Sec 15) — сигнал, не доказательство.", options: { italic: true, color: C.GRAY } },
], { x: 9.6, y: 2.4, w: 3.0, h: 4.4, fontFace: FB, fontSize: 12, color: C.INK2, lineSpacingMultiple: 1.08, valign: "top" });
footer(s, 6);

// ===================================================== SLIDE 7 — SUPPLY
s = p.addSlide(); lightBg(s);
head(s, "Предложение", "Чем владеет команда на бенче");
s.addImage({ path: A("chart_supply.png"), x: 0.5, y: 1.85, w: 7.4, h: 4.3 });
s.addText("Рабочий уровень = High + Medium (Low и «на проверке» исключены). На бенче JS/TS впереди Java по реально применимому навыку.", {
  x: 0.6, y: 6.25, w: 7.4, h: 0.8, fontFace: FB, fontSize: 12.5, color: C.INK2, lineSpacingMultiple: 1.05,
});
s.addShape(p.ShapeType.rect, { x: 8.3, y: 1.85, w: 4.5, h: 4.95, fill: { color: C.INK } });
s.addShape(p.ShapeType.rect, { x: 8.3, y: 1.85, w: 4.5, h: 0.12, fill: { color: C.GREEN } });
s.addText("83%", { x: 8.55, y: 2.35, w: 4.0, h: 1.2, fontFace: FH, fontSize: 64, color: C.GREEN });
s.addText("AQA-инженеров владеют двумя и более языками", { x: 8.55, y: 3.6, w: 4.0, h: 0.9, fontFace: FS, fontSize: 17, color: C.WHITE, lineSpacingMultiple: 1.05 });
s.addText("Типичный реальный стек:\nJava + JS/TS + Python.\n\nПолиглотизм — норма, а не исключение.", { x: 8.55, y: 4.65, w: 4.0, h: 2.0, fontFace: FB, fontSize: 13.5, color: "C9CFC0", lineSpacingMultiple: 1.12 });
footer(s, 7);

// ===================================================== SLIDE 8 — GRADES + ENGLISH
s = p.addSlide(); lightBg(s);
head(s, "Кого берут", "Грейды и английский");
s.addImage({ path: A("chart_grades.png"), x: 0.5, y: 1.8, w: 7.0, h: 4.2 });
s.addText("Тренд понятен — берут опытных (Senior/Middle), джунов почти нет. Но абсолютные числа малы — точные доли не выводим.", {
  x: 0.6, y: 6.05, w: 7.0, h: 0.9, fontFace: FB, fontSize: 12.5, color: C.INK2, italic: true, lineSpacingMultiple: 1.05,
});
s.addShape(p.ShapeType.rect, { x: 7.9, y: 1.8, w: 4.9, h: 4.95, fill: { color: C.PANEL } });
s.addShape(p.ShapeType.rect, { x: 7.9, y: 1.8, w: 4.9, h: 0.12, fill: { color: C.GREEN } });
s.addText("Языки", { x: 8.2, y: 2.0, w: 4.3, h: 0.45, fontFace: FH, fontSize: 18, color: C.INK });
s.addText("B2", { x: 8.2, y: 2.5, w: 2.2, h: 1.0, fontFace: FH, fontSize: 52, color: C.GREEN_D });
s.addText("английский — самый частый\nпорог в запросах (надёжно)", { x: 8.2, y: 3.5, w: 4.3, h: 0.8, fontFace: FB, fontSize: 13, color: C.INK2, lineSpacingMultiple: 1.05 });
s.addShape(p.ShapeType.line, { x: 8.2, y: 4.5, w: 4.3, h: 0, line: { color: "DDE4D0", width: 1 } });
s.addText([
  { text: "Немецкий", options: { color: C.INK, bold: true } },
  { text: " — встречается, но всего в 21 запросе. Возможный бонус, но как тренд — не доказательство.", options: { color: C.INK2 } },
], { x: 8.2, y: 4.65, w: 4.3, h: 1.9, fontFace: FB, fontSize: 13, lineSpacingMultiple: 1.08, valign: "top" });
footer(s, 8);

// ===================================================== SLIDE 9 — BASE SKILLS
s = p.addSlide(); lightBg(s);
head(s, "Помимо языка", "Обязательный фундамент AQA");
[
  ["SQL / Базы данных", "Проверка данных в БД — встречается в запросах чаще любого языка."],
  ["REST / API + Postman", "Тестирование бэкенда и интеграций; базовый навык для любого стека."],
  ["Selenium / Playwright", "Веб-автоматизация. Selenium — классика, Playwright — современный выбор."],
  ["Git + CI/CD", "Версионирование и автозапуск тестов — ожидается по умолчанию."],
  ["Docker (минимум)", "Поднять окружение, запустить тесты в контейнере."],
].forEach((r, i) => {
  const y = 1.85 + i * 1.02;
  s.addShape(p.ShapeType.rect, { x: 0.6, y, w: 12.15, h: 0.9, fill: { color: i % 2 ? C.WHITE : C.PANEL }, line: { color: "E7ECDD", width: 1 } });
  s.addShape(p.ShapeType.rect, { x: 0.6, y, w: 0.1, h: 0.9, fill: { color: C.GREEN } });
  s.addText(r[0], { x: 0.95, y, w: 4.1, h: 0.9, fontFace: FH, fontSize: 15.5, color: C.INK, valign: "middle" });
  s.addText(r[1], { x: 5.2, y, w: 7.4, h: 0.9, fontFace: FB, fontSize: 13.5, color: C.INK2, valign: "middle" });
});
footer(s, 9);

// ===================================================== SLIDE 10 — SOFT SKILLS
s = p.addSlide(); lightBg(s);
head(s, "Soft skills", "Что ценят кроме кода");
[
  ["Английский B2+", "Бенч продаётся «лицом»: созвоны, интервью с клиентом — без языка не продают."],
  ["Коммуникация", "Обсудить требования, задать вопросы, защитить баг — ежедневно с заказчиком."],
  ["Работа с требованиями", "Понять и уточнить ТЗ, найти противоречия раньше, чем баг уйдёт в прод."],
  ["Самоорганизация", "Удалёнка и несколько проектов: дисциплина и self-management обязательны."],
  ["Гибкость", "Готовность ко 2-му проекту, иногда вечерним/ночным сменам — плюс при продаже."],
  ["Обучаемость", "Стек меняется (Playwright, Perf/Security): важно быстро осваивать новое."],
].forEach((c, i) => {
  const x = 0.6 + (i % 3) * 4.08, y = 1.9 + Math.floor(i / 3) * 2.45;
  s.addShape(p.ShapeType.rect, { x, y, w: 3.85, h: 2.2, fill: { color: C.PANEL }, line: { color: "E7ECDD", width: 1 } });
  s.addShape(p.ShapeType.ellipse, { x: x + 0.28, y: y + 0.28, w: 0.62, h: 0.62, fill: { color: C.GREEN } });
  s.addText(String(i + 1), { x: x + 0.28, y: y + 0.28, w: 0.62, h: 0.62, fontFace: FH, fontSize: 20, color: C.WHITE, align: "center", valign: "middle" });
  s.addText(c[0], { x: x + 0.28, y: y + 1.0, w: 3.3, h: 0.45, fontFace: FH, fontSize: 15, color: C.INK });
  s.addText(c[1], { x: x + 0.28, y: y + 1.42, w: 3.35, h: 0.72, fontFace: FB, fontSize: 11.5, color: C.INK2, lineSpacingMultiple: 1.02 });
});
footer(s, 10);

// ===================================================== SLIDE 11 — JAVA ONLY vs +LANG
s = p.addSlide(); lightBg(s);
head(s, "Ответ на вопрос", "Только Java или Java + второй язык");
s.addShape(p.ShapeType.rect, { x: 0.6, y: 1.85, w: 5.9, h: 4.35, fill: { color: C.PANEL }, line: { color: "E2E8D4", width: 1 } });
s.addText("Только Java", { x: 0.9, y: 2.05, w: 5.3, h: 0.55, fontFace: FH, fontSize: 22, color: C.INK });
s.addText([
  { text: "+  Java стабильна, входит в топ-группу\n" },
  { text: "+  глубокая экспертиза в одном стеке\n\n" },
  { text: "−  Java не лидирует — закрывает ~⅓ языковых запросов из трёх равных\n" },
  { text: "−  мимо Playwright-стека (он JS-родной)\n" },
  { text: "−  на бенче ты как все, кто на Java" },
], { x: 0.9, y: 2.7, w: 5.35, h: 3.5, fontFace: FB, fontSize: 14, color: C.INK2, lineSpacingMultiple: 1.2, valign: "top" });
s.addShape(p.ShapeType.rect, { x: 6.85, y: 1.85, w: 5.9, h: 4.35, fill: { color: C.INK } });
s.addShape(p.ShapeType.rect, { x: 6.85, y: 1.85, w: 5.9, h: 0.16, fill: { color: C.GREEN } });
s.addText("Java + второй язык", { x: 7.15, y: 2.05, w: 5.3, h: 0.55, fontFace: FH, fontSize: 22, color: C.GREEN });
s.addText([
  { text: "+  закрываешь два из трёх равных тиров\n" },
  { text: "+  полиглот — как 83% бенча, продаёшься легче\n" },
  { text: "+  JS/TS открывает Playwright; Python — API/data\n\n" },
  { text: "−  больше учить на старте\n" },
  { text: "−  выбор языка данные не решают — решает экосистема и твой интерес" },
], { x: 7.15, y: 2.7, w: 5.35, h: 3.5, fontFace: FB, fontSize: 14, color: "DDE3D2", lineSpacingMultiple: 1.2, valign: "top" });
s.addShape(p.ShapeType.rect, { x: 0.6, y: 6.45, w: 12.15, h: 0.62, fill: { color: C.PANEL }, line: { color: "E2E8D4", width: 1 } });
s.addShape(p.ShapeType.rect, { x: 0.6, y: 6.45, w: 0.12, h: 0.62, fill: { color: C.GREEN } });
s.addText([
  { text: "Рекомендация:  ", options: { color: C.GREEN_D, bold: true } },
  { text: "сначала Java + база (SQL/REST) + English B2. Второй язык — позже и по экосистеме: JS/TS под веб/Playwright, Python под API/data.", options: { color: C.INK2 } },
], { x: 0.95, y: 6.45, w: 11.7, h: 0.62, fontFace: FS, fontSize: 12.5, valign: "middle" });
s.addText("11", { x: W - 1.0, y: H - 0.42, w: 0.5, h: 0.3, fontFace: FS, fontSize: 10, color: C.GRAY, align: "right" });

// ===================================================== SLIDE 12 — ROADMAP
s = p.addSlide(); lightBg(s);
head(s, "Дорожная карта", "План обучения для трейни");
[
  ["Сейчас", "Добить базу", "Java + Selenium + JUnit, SQL, REST/API, Git. Это уже продаёт."],
  ["Параллельно", "English до B2", "Самый частый порог в запросах — язык идёт фоном с первого дня."],
  ["Шаг 2", "Второй язык", "JS/TS (под Playwright/веб) или Python (под API/data) — по интересу."],
  ["Шаг 3", "DevOps-минимум", "Docker и CI/CD: поднять окружение, гонять тесты в пайплайне."],
  ["Опц.", "Узкая ниша", "Performance или Security — растущие специализации, выше ставка."],
].forEach((st, i) => {
  const sw = 2.34, x = 0.6 + i * (sw + 0.07), y = 2.2;
  s.addShape(p.ShapeType.rect, { x, y, w: sw, h: 4.2, fill: { color: i < 2 ? C.GREEN : C.PANEL }, line: { color: "E2E8D4", width: 1 } });
  s.addText(st[0].toUpperCase(), { x: x + 0.18, y: y + 0.2, w: sw - 0.36, h: 0.35, fontFace: FS, fontSize: 11, color: i < 2 ? "12380F" : C.GREEN_D, charSpacing: 1 });
  s.addShape(p.ShapeType.ellipse, { x: x + 0.18, y: y + 0.62, w: 0.66, h: 0.66, fill: { color: C.INK } });
  s.addText(String(i + 1), { x: x + 0.18, y: y + 0.62, w: 0.66, h: 0.66, fontFace: FH, fontSize: 22, color: C.GREEN, align: "center", valign: "middle" });
  s.addText(st[1], { x: x + 0.18, y: y + 1.45, w: sw - 0.36, h: 0.9, fontFace: FH, fontSize: 16, color: C.INK, lineSpacingMultiple: 0.95 });
  s.addText(st[2], { x: x + 0.18, y: y + 2.35, w: sw - 0.36, h: 1.6, fontFace: FB, fontSize: 12, color: C.INK2, lineSpacingMultiple: 1.05 });
});
footer(s, 12);

// ===================================================== SLIDE 13 — CLOSING
s = p.addSlide();
s.background = { color: C.INK };
s.addShape(p.ShapeType.rect, { x: 0, y: 0, w: 0.22, h: H, fill: { color: C.GREEN } });
s.addText("ИТОГ", { x: 0.8, y: 0.7, w: 6, h: 0.4, fontFace: FS, fontSize: 14, color: C.GREEN, charSpacing: 3 });
s.addText("Java — да. Но не только Java.", { x: 0.75, y: 1.15, w: 11.8, h: 1.0, fontFace: FH, fontSize: 36, color: C.WHITE });
[
  "Java не падает — оставляй ядром. Но она не лидирует: тир с Python и JS/TS неразличим.",
  "4 из 5 запросов вообще не про язык → вкладывайся в AQA-навык (SQL, API, фреймворки) + English B2.",
  "Второй язык полезен, но данные не выбирают: JS/TS под Playwright/веб, Python под API/data.",
  "Из растущего — Performance и Security (с нуля). Mobile проседает, Accessibility — нет спроса.",
].forEach((t, i) => {
  const y = 2.5 + i * 0.78;
  s.addShape(p.ShapeType.rect, { x: 0.8, y: y + 0.07, w: 0.26, h: 0.26, fill: { color: C.GREEN } });
  s.addText(t, { x: 1.28, y: y - 0.08, w: 11.4, h: 0.7, fontFace: FB, fontSize: 15, color: "E2E7DA", valign: "middle", lineSpacingMultiple: 1.0 });
});
s.addText("Данные — пайплайн Innowise, рабочая выборка n≈95: выводы индикативные, направление, а не точные доли.", {
  x: 0.8, y: 5.95, w: 11.8, h: 0.5, fontFace: FB, fontSize: 12, color: "8A9282", italic: true,
});
s.addText("На этой неделе: продолжить Java + SQL/REST, начать ежедневный английский, присмотреть второй язык.", {
  x: 0.8, y: 6.55, w: 11.8, h: 0.5, fontFace: FS, fontSize: 13.5, color: C.GREEN,
});

const OUT = path.join(__dirname, "QA Stack Analysis - Innowise Bench.pptx");
p.writeFile({ fileName: OUT }).then(() => console.log("WROTE:", OUT));
