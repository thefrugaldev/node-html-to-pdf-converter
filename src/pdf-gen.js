const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

async function generatePdf(data) {
  var templateHtml = fs.readFileSync(
    path.join(process.cwd(), "pdf-template.html"),
    "utf8"
  );
  var template = handlebars.compile(templateHtml);
  var html = template(data);

  var milis = new Date();
  milis = milis.getTime();

  var pdfPath = path.join("pdf", `${data.name}-${milis}.pdf`);

  var options = {
    width: "1230px",
    headerTemplate: "<p></p>",
    footerTemplate: "<p></p>",
    displayHeaderFooter: false,
    margin: {
      top: "10px",
      bottom: "30px"
    },
    printBackground: true,
    path: pdfPath
  };

  const browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    headless: true
  });

  var page = await browser.newPage();

  await page.setContent(`${html}`, {
    waitUntil: "networkidle0"
  });

  await page.pdf(options);
  await browser.close();
}

const dateOptions = { year: "numeric", month: "long", day: "numeric" };
const today = new Date().toLocaleDateString("en-US", dateOptions);

const data = {
  date: today,
  name: "TheFrugalDev",
  age: 31,
  birthdate: "11/02/1988",
  hobby: "Video Games",
  fav_team: "Georgia Bulldogs",
  fav_lang: "JavaScript"
};

generatePdf(data);
