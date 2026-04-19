window.__LANG__ = {
  ko: {
    head: {
      title: "권도한 :: 컴퓨터 엔지니어",
    },
  },
  en: {
    head: {
      title: "Dohan Kwon :: Computer Engineer",
    },
  },
};

const applyLanguage = () => {
  const langData = window.__LANG__;

  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get("lang") || "ko";

  const translations = langData[lang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const raw = el.dataset.i18n;
    const [key, attr] = raw.split("@");

    const keys = key.split(".");
    let text = translations;

    for (const k of keys) {
      text = text?.[k];
      if (!text) break;
    }

    if (!text) return;

    if (attr) {
      el.setAttribute(attr, text);
    } else {
      el.textContent = text;
    }
  });

  document.documentElement.lang = lang;
};
