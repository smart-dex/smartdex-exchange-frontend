var fs = require('fs');
const fetch = require("node-fetch");
const URL = "https://api.crowdin.com/api/v2/projects/422458/languages";
const BEARER_TOKEN = "Bearer 21fd8a9df301e5be886ab8886c8e65a565bd57798041100160c4138f8b0e5643f50f74abac2bb2e2";
const LANGUAGES_SUPPORT = [
      { code: 'en', language: 'English' },
      { code: 'ar', language: 'العربية' },
      { code: 'ca', language: 'Català' },
      { code: 'zh-CN', language: '简体中文' },
      { code: 'zh-TW', language: '繁體中文' },
      { code: 'cs', language: 'Čeština' },
      { code: 'da', language: 'Dansk' },
      { code: 'de', language: 'Deutsch' },
      { code: 'nl', language: 'Nederlands' },
      { code: 'fil', language: 'Filipino' },
      { code: 'fi', language: 'Suomalainen' },
      { code: 'fr', language: 'Français' },
      { code: 'el', language: 'Ελληνικά' },
      { code: 'hi', language: 'हिंदी' },
      { code: 'hu', language: 'Magyar' },
      { code: 'id', language: 'Bahasa Indonesia' },
      { code: 'it', language: 'Italiano' },
      { code: 'ja', language: '日本語' },
      { code: 'ko', language: '한국어' },
      { code: 'pt-BR', language: 'Português' },
      { code: 'ro', language: 'Română' },
      { code: 'ru', language: 'Русский' },
      { code: 'sr', language: 'Српски' },
      { code: 'es-ES', language: 'Español' },
      { code: 'sv-SE', language: 'Svenska' },
      { code: 'ta', language: 'தமிழ்' },
      { code: 'tr', language: 'Türkçe' },
      { code: 'uk', language: 'Українська' },
      { code: 'vi', language: 'Tiếng Việt' },
];
const path = require('path');
let offset = 0;


async function crawlData() {
      let round = 0;
      for (let i = 0; i <= LANGUAGES_SUPPORT.length; i++){
            let firstCrawl = true;
            let item = await LANGUAGES_SUPPORT[i]
            console.log(`Start crawl language ${item.language} ....`);
            await fetchData(item, round, firstCrawl);
            console.log(`Crawl language ${item.language} Success`);
            console.log("=========================================")
      }
      return "success";
}

async function writeFile(language, data, firstCrawl = false) {
     try {
           if (firstCrawl) {
                 await fs.writeFile(path.join(__dirname,`../src/locales/${language}.json`), data, (data) => {});
           } else {
                 await fs.appendFile(path.join(__dirname,`../src/locales/${language}.json`), data, (language) => {});
           }
     } catch (e) {
           console.log(e)
     }
}

async function fetchData(item, round, firstCrawl) {
      offset = round * 200;
      let languages = [];
      let api = `${URL}/${item.code}/translations?offset=${offset}&limit=200`;
      const response = await fetch(api, {
            headers: {
                  'Accept': 'application/json',
                  'Authorization': BEARER_TOKEN
            },
      });
      const data = await response.json();
      if (!data.data.length) {
            return;
      }
      await languages.push(data.data)
      await writeFile(item.code, JSON.stringify(languages[0]), firstCrawl);
      console.log("..................................")
      if (data.data.length === 200) {
       await fetchData(item, round + 1);
      }
}

const data = crawlData().then((data) => {
      console.log(`Crawl success !`)
})
  .catch(e => {
        console.log(e)
});