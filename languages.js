window.__LANG__ = {
  ko: {
    locale: "ko-KR",
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
      content:
        "<strong>Legacy 위에서 Latest를 설계하는 컴퓨터 공학자</strong>, 권도한입니다.<br /><br />무어의 법칙이 물리적 한계에 다다를 만큼 컴퓨터 공학의 발전 속도는 비약적이며, AI의 등장으로 추상화 레이어를 지탱하는 Legacy 기술은 점차 조명받지 못하고 있습니다.<br /><br />Kubernetes도 Cgroups과 Namespaces를 기반으로 동작하며, 클라우드 인프라 또한 VirtIO를 기반으로 동작합니다.<br /><br /><strong>Legacy는</strong> 단순히 '오래된 기술'이 아니라, <strong>Latest가 작동하는 원리를 담고 있습니다.</strong> 원리를 이해하지 못한 채 새로운 기술을 설계하는 것은, 기초 없이 건물을 쌓아 올리는 것과 다르지 않습니다.<br /><br />Latest만 좇으면 유행을 탈 수는 있지만 깊이를 잃습니다. Legacy에만 머무르면 견고하지만 시대에 뒤처집니다. 저는 그 가운데에서 <strong>이론과 기반이 되는 기술을 바탕으로 새로운 기술의 가능성을 설계하는 공학자</strong>로서 성장하고자 합니다.",
    },
    posts: {
      header: "게시글",
      error: "게시글 로드에 실패하였습니다.",
      edited: "수정됨",
    },
    rss: {
      title: "도한로그",
      description: "Legacy 위에서 Latest를 설계하는 컴퓨터 공학자",
    },
  },
  en: {
    locale: "en-US",
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
      content:
        "<strong>A computer engineer designing the 'Latest' on top of 'Legacy'</strong>, Dohan Kwon here.<br /><br />As Moore's Law approaches its physical limits, the pace of progress in computer engineering has become dramatically rapid, and with the emergence of AI, the 'Legacy' technologies that underpin abstraction layers are gradually receiving less attention.<br /><br />Kubernetes also operates based on cgroups and namespaces, and cloud infrastructure is also built upon VirtIO.<br /><br /><strong>'Legacy'</strong> is not simply 'old technology', it contains the underlying principles that make the <strong>'Latest'</strong> work. Designing new systems without understanding those principles is no different from building a structure without a foundation.<br /><br />Chasing only the 'Latest' may allow you to ride trends, but it comes at the cost of depth. Staying only within 'Legacy' makes systems robust, but leaves them behind the times. I aim to grow in between those two, <strong>as an engineer who designs new technological possibilities grounded in theory and foundational technologies</strong>.",
    },
    posts: {
      header: "Posts",
      error: "Failed to load Posts",
      edited: "edited",
    },
    rss: {
      title: "dohan.k.log",
      description:
        "Computer engineer who designs the 'Latest' atop the 'Legacy'",
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
        el.innerHTML = text;
      }
    });
  });

  document.documentElement.lang = lang;
};
