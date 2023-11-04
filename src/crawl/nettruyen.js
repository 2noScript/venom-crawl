import { EMPTY_TEXT } from "../const/index.js";
import {
  sleep,
  getNumberForText,
  getIdentifierByName,
} from "../utils/handle.js";

export default class CrawlNetTruyen {
  constructor(context, suppliers) {
    this.context = context;
    this.suppliers = suppliers;
  }

  async getBookInfo(startPage, totalPage) {
    const page = await this.context.newPage();
    // const supplierIndex = Math.floor(Math.random() * this.suppliers.length);
    const supplierIndex = 1;
    // const host =
    //   this.suppliers[Math.floor(Math.random() * this.suppliers.length)];
    const supplierId = this.suppliers[supplierIndex].id;
    const host = this.suppliers[supplierIndex].name;
    const baseUrl = `https://${host}`;
    let dataCrawl = [];
    for (let i = startPage; i <= totalPage; i++) {
      let data = [];
      try {
        await page.goto(`${baseUrl}/?page=${i}`, {
          timeout: 60000,
        });

        const books = await page.$$("#ctl00_divCenter .item ");
        for (const book of books) {
          const a = await book.$(".box_img a");
          const img = await a.$("img");
          const href = await a.getAttribute("href");
          const info = await book.$$(".message_main p");

          const description =
            (await (await book?.$(".box_text"))?.textContent()) ?? EMPTY_TEXT;

          const name =
            (await (await book.$("figcaption>h3>a"))?.textContent()).trim() ??
            EMPTY_TEXT;

          let avatar =
            (await img.getAttribute("data-original")) ||
            (await img.getAttribute("src"));
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
            identifier: getIdentifierByName(name),
            supplierId,
            comicId: getNumberForText(href),
            name,
            avatar,
            link: new URL(href).pathname,
            genres,
            description,
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
    await page.close();
    return dataCrawl;
  }

  // async getGenres() {
  //   const page = await this.context.newPage();

  //   const dataCrawl = [];
  //   try {
  //     await this.page.goto(`${this.baseUrl}/tim-truyen`, { timeout: 60000 });

  //     const listGenre = await this.page.$$("#ctl00_divRight ul.nav li a");

  //     for (const item of listGenre) {
  //       const genre = (await item.textContent()).trim().toLowerCase();
  //       if (/tất cả|thể loại/g.test(genre)) {
  //         continue;
  //       }
  //       const identifier = (await item.getAttribute("href"))
  //         .replace(/(https|http)/g, EMPTY_TEXT)
  //         .replace(`://www.${this.host}/tim-truyen/`, EMPTY_TEXT)
  //         .toLowerCase();
  //       dataCrawl.push({
  //         name: genre,
  //         identifier,
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   await page.close();
  //   return dataCrawl;
  // }

  async getImagesByChapter(path) {}

  // async getInfoDetailBook(path) {
  //   let dataCrawl=
  // }
}
