const puppeteer = require("puppeteer");

const book = {
  slides: [
    {
      id: "p1",
      width: 350,
      height: 434,
      background: "#fdf6ec",
      elements: [
        {
          id: "e1",
          data: {
            type: "text",
            bookRole: "chapter",
            text: "Getting Started",
            x: 30, y: 40, width: 280, height: 50,
            fontSize: 28, fontWeight: 700, color: "#1f2937", align: "left",
          },
        },
        {
          id: "e2",
          data: {
            type: "text",
            text: "Body copy on the first page of the book.",
            x: 30, y: 120, width: 280, height: 60,
            fontSize: 14, color: "#374151", lineHeight: 1.5,
          },
        },
        {
          id: "e3",
          data: {
            type: "shape",
            shape: "<circle cx='50' cy='50' r='45' />",
            color: "#6366f1",
            x: 220, y: 300, width: 90, height: 90, opacity: 0.85,
          },
        },
        {
          id: "e4",
          data: {
            type: "interaction",
            interactionKind: "quiz",
            text: "TAKE QUIZ",
            backgroundColor: "#2563eb",
            textColor: "#ffffff",
            borderRadius: 8,
            x: 30, y: 240, width: 150, height: 42,
            quizTitle: "Quick quiz",
            quizQuestions: [
              {
                id: "q1",
                question: "Does the popup escape the page box?",
                options: [
                  { id: "o1", text: "Yes", correct: true },
                  { id: "o2", text: "No" },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      id: "p2",
      width: 350,
      height: 434,
      background: "#ffffff",
      elements: [
        {
          id: "e5",
          data: {
            type: "text",
            bookRole: "index",
            tocTitle: "CONTENTS",
            tocStyle: "classic",
            x: 30, y: 40, width: 290, height: 340,
            fontSize: 14, color: "#111827", lineHeight: 1.4,
          },
        },
      ],
    },
    {
      id: "p3",
      width: 350,
      height: 434,
      background: "#eef2ff",
      elements: [
        {
          id: "e6",
          data: {
            type: "text",
            bookRole: "chapter",
            text: "Second Chapter",
            x: 30, y: 40, width: 280, height: 50,
            fontSize: 26, fontWeight: 700, color: "#312e81",
          },
        },
        {
          id: "e7",
          data: {
            type: "table",
            rows: 2, columns: 2,
            cells: [
              [{ text: "Name" }, { text: "Value" }],
              [{ text: "Pages" }, { text: "3" }],
            ],
            style: {
              borderColor: "#c7d2fe", borderWidth: 1, background: "#fff",
              cellBackground: "#fff", padding: 6, fontFamily: "Inter",
              fontSize: 12, fontWeight: 400, textColor: "#1e1b4b",
              lineHeight: 1.4, letterSpacing: 0, textAlign: "left",
              verticalAlign: "middle",
            },
            x: 30, y: 140, width: 280, height: 80,
          },
        },
      ],
    },
  ],
};

const src =
  "data:application/json;base64," +
  Buffer.from(JSON.stringify(book)).toString("base64");

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text());
  });

  const url = `http://localhost:3001/preview?src=${encodeURIComponent(src)}`;
  await page.goto(url, { waitUntil: "networkidle0", timeout: 180000 });
  await new Promise((r) => setTimeout(r, 2500));

  const out = process.argv[2];
  await page.screenshot({ path: `${out}/01-flipbook.png` });

  // Pages present?
  const pageCount = await page.$$eval("[data-page-id]", (els) => els.length);
  const texts = await page.$eval("body", (b) => b.innerText.slice(0, 400));

  // Quiz popup must portal to <body>, outside the page box.
  let popupParentIsBody = null;
  const quiz = await page.$('[data-block-id="e4"]');
  if (quiz) {
    await quiz.click();
    await new Promise((r) => setTimeout(r, 700));
    popupParentIsBody = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (!dialog) return "no-dialog";
      const wrapper = dialog.parentElement;
      return wrapper?.parentElement === document.body ? "body" : "nested";
    });
    await page.screenshot({ path: `${out}/02-quiz-popup.png` });
    await page.keyboard.press("Escape");
    await new Promise((r) => setTimeout(r, 400));
  }

  // Vertical view + page directory
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      b.textContent.includes("Vertical"),
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${out}/03-vertical.png` });

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      b.textContent.trim() === "Pages",
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `${out}/04-directory.png` });

  console.log(JSON.stringify({ pageCount, popupParentIsBody, errors, texts }, null, 2));
  await browser.close();
})().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
