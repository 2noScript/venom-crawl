import "dotenv/config";

import { getContext } from "./utils/playwright.js";

import request from "./utils/request.js";

import CrawlNetTruyen from "./crawl/nettruyen.js";

async function app() {
  const context = await getContext();

  const resSupplier = await request({
    method: "GET",
    url: "/supplier",
  });
  const crawl = new CrawlNetTruyen(context, resSupplier.data);
  const data = await crawl.getBookInfo(1, 1);
  console.log(data[0].data);
  await context.close();
}

app();
