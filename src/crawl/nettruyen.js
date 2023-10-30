import { EMPTY_TEXT } from "../const/index.js";
import { sleep, getNumberForText } from "../utils/handle.js";

export default class CrawlNetTruyen {
  constructor(page, host) {
    this.page = page;
    this.host = host;
    this.baseUrl = `https://${host}`;
  }

  async getBookInfo(startPage, totalPage) {
    let dataCrawl = [];
    for (let i = startPage; i <= totalPage; i++) {
      let data = [];
      try {
        await this.page.goto(`${this.baseUrl}/hot?page=${i}`, {
          timeout: 60000,
        });
        // await sleep(1);

        const books = await this.page.$$("#ctl00_divCenter .item ");
        for (const book of books) {
          const a = await book.$(".box_img a");
          const img = await a.$("img");
          const href = await a.getAttribute("href");
          const info = await book.$$(".message_main p");

          let avatar =
            (await img.getAttribute("data-original")) ||
            (await img.getAttribute("src"));
          avatar = avatar
            .replace(/(https|http|\/\/st\.)/g, EMPTY_TEXT)
            .replace(this.host, EMPTY_TEXT);
          let genres = [];

          for (const msg of info) {
            const text = await msg.textContent();
            const check = "Thể loại:";
            if (text.includes(check)) {
              genres = text
                .replace(check, EMPTY_TEXT)
                .split(",")
                .map((txt) => txt.trim().toLowerCase());
              break;
            }
          }

          data.push({
            identifier: getNumberForText(href),
            name: await a.getAttribute("title"),
            avatar,
            link: new URL(href).pathname,
            genres,
          });
        }
      } catch (error) {
        console.error(error);
      }
      dataCrawl.push({
        page: i,
        data,
      });
    }
    return dataCrawl;
  }

  async getGenres() {
    const dataCrawl = [];
    try {
      await this.page.goto(`${this.baseUrl}/tim-truyen`, { timeout: 60000 });

      const listGenre = await this.page.$$("#ctl00_divRight ul.nav li a");

      for (const item of listGenre) {
        const genre = (await item.textContent()).trim().toLowerCase();
        if (/tất cả|thể loại/g.test(genre)) {
          continue;
        }
        const identifier = (await item.getAttribute("href"))
          .replace(/(https|http)/g, EMPTY_TEXT)
          .replace(`://www.${this.host}/tim-truyen/`, EMPTY_TEXT)
          .toLowerCase();
        dataCrawl.push({
          name: genre,
          identifier,
        });
      }
    } catch (error) {
      console.error(error);
    }
    return dataCrawl;
  }

  async getImagesByChapter(path) {}

  // async getInfoDetailBook(path) {
  //   let dataCrawl=
  // }
}
