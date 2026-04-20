window.__LANG__ = {
  ko: {
    head: {
      title: "권도한 :: 컴퓨터 공학자",
    },
    header: {
      profile: "프로필 사진",
      name: "권도한",
      bio: "컴퓨터 공학자",
      department: "@연세대학교 미래캠퍼스",
      department_url: "https://mirae.yonsei.ac.kr/wj/index.do",
    },
    nav: {
      theme: "테마 변경",
      index: "찾기",
    },
    footer: {
      home: "홈",
      blog: "블로그",
      rss: "/ko/rss.xml",
      pdf: "PDF로 저장",
    },
    greeting: {
      header: "안녕하세요",
    },
  },
  en: {
    head: {
      title: "Dohan Kwon :: Computer Engineer",
    },
    header: {
      profile: "Profile Image",
      name: "Dohan Kwon",
      bio: "Computer Engineer",
      department: "@Yonsei University Mirae Campus",
      department_url: "https://mirae.yonsei.ac.kr/sites/en_wj/index.do",
    },
    nav: {
      theme: "Toggle Color Theme",
      index: "Index",
    },
    footer: {
      home: "Home",
      blog: "Blog",
      rss: "/en/rss.xml",
      pdf: "Save to PDF",
    },
    greeting: {
      header: "Hello",
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
