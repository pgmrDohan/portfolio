const SUPPORTED_LANGS = ["ko", "en"];
const DEFAULT_LANG = "ko";

const COUNTRY_TO_LANG = {
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
};

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

    return fetch(request);
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
