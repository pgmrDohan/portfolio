window.__LANG__ = {
  ko: {
    head: {
      title: "권도한 :: 컴퓨터 공학자",
    },
    body: {
      profile: "프로필 사진",
      name: "권도한",
      bio: "컴퓨터 공학자",
      department: "@연세대학교 미래캠퍼스",
      department_url: "https://mirae.yonsei.ac.kr/wj/index.do",
    },
  },
  en: {
    head: {
      title: "Dohan Kwon :: Computer Engineer",
    },
    body: {
      profile: "Profile Image",
      name: "Dohan Kwon",
      bio: "Computer Engineer",
      department: "@Yonsei University Mirae Campus",
      department_url: "https://mirae.yonsei.ac.kr/sites/en_wj/index.do",
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
    const directives = raw.split(",");

    directives.forEach((directive) => {
      const [key, attr] = directive.trim().split("@");

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
  });

  document.documentElement.lang = lang;
};
