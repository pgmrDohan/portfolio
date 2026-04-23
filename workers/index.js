const __LANG__ = {};

const SUPPORTED_LANGS = ["ko", "en"];
const DEFAULT_LANG = "ko";
const COUNTRY_TO_LANG = {
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
};

function resolvePath(translations, key) {
  const keys = key.split(".");
  let value = translations;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  return typeof value === "string" ? value : null;
}

class I18nRewriter {
  constructor(translations) {
    this.translations = translations;
  }

  element(element) {
    const raw = element.getAttribute("data-i18n");
    if (!raw) return;

    const directives = raw.split(",");
    for (const directive of directives) {
      const [key, attr] = directive.trim().split("@");
      const text = resolvePath(this.translations, key);
      if (!text) continue;

      if (attr) {
        element.setAttribute(attr, text);
      } else {
        element.setInnerContent(text, { html: true });
      }
    }
  }
}

class HtmlLangRewriter {
  constructor(lang) {
    this.lang = lang;
  }
  element(element) {
    element.setAttribute("lang", this.lang);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const rssMatch = pathname.match(/^\/([a-z]{2})\/rss\.xml$/);
    if (rssMatch) {
      const targetLang = rssMatch[1];
      if (SUPPORTED_LANGS.includes(targetLang)) {
        const rssUrl = `https://raw.githubusercontent.com/pgmrDohan/portfolio/refs/heads/master/rss/${targetLang}.xml`;
        return fetchAsset(rssUrl, "application/xml");
      }
    }

    const isContentRequest = !/\.[a-zA-Z0-9]+$/.test(pathname);
    if (!url.searchParams.has("lang") && isContentRequest) {
      const country = request.cf?.country;
      const estimatedLang = COUNTRY_TO_LANG[country] || DEFAULT_LANG;
      url.searchParams.set("lang", estimatedLang);
      return Response.redirect(url.toString(), 302);
    }

    const response = await fetch(request);

    const contentType = response.headers.get("Content-Type") || "";
    if (!contentType.includes("text/html")) {
      return response;
    }

    const lang = url.searchParams.get("lang") || DEFAULT_LANG;
    const translations =
      __LANG__[SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG];

    return new HTMLRewriter()
      .on("html", new HtmlLangRewriter(lang))
      .on("[data-i18n]", new I18nRewriter(translations))
      .transform(response);
  },
};

async function fetchAsset(url, contentType) {
  const response = await fetch(url);
  if (!response.ok) return new Response("Not Found", { status: 404 });
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Content-Type", `${contentType}; charset=utf-8`);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  return newResponse;
}
