import "dotenv/config";

import { getContext } from "./utils/playwright.js";

import request from "./utils/request.js";

import CrawlNetTruyen from "./crawl/nettruyen.js";

async function app() {
  const context = await getContext();
  const page = await context.newPage();

  const crawl = new CrawlNetTruyen(page, process.env.CRAWL_DOMAIN);

  await page.close();
  await context.close();
}

app();
