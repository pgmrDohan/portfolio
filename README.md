# Portfolio

Serverless. Like, actually serverless. (Cloudflare Workers + GitHub Actions & Pages)

Just vanilla HTML, CSS & JS - no frameworks, no drama.

Says it in your language: multilingual support included.

## CMS

```json
[
  {
    "period": ["(start)YYYY-MM-DD", "(end)YYYY-MM-DD"],
    "title": "",
    "major": "",
    "status": "enrolled|graduated",
    "gpa": "",
    "lang": ""
  }
]
```

```json
[
  {
    "type": "research|publication",
    "title": "",
    "subtitle": "",
    "date": "YYYY-MM-DD",
    "identifiers": [
      {
        "title": "",
        "URL": ""
      },
      {
        "title": "",
        "isbn": "only number"
      },
      {
        "title": "",
        "issn": "only number"
      }
    ],
    "country": "",
    "pinned": true,
    "lang": ""
  }
]
```

```markdown
---
title: "My Awesome Project"
date: " 2026-04-21"
lang: "en"
contribution: "Personal"
cover: "/images/projects/my-awesome-projects.jpg"
url: "https://cbns.dohan.in/"
repository: "https://github.com/pgmrDohan/react.ts"
skills: ["APL", "LISP", "Fortran"]
platform: ["In My Mind"]
description: "TTTTEEEESSSSSSTTTTT"
---

...
```

```json
[
  {
    "company": "",
    "department": "",
    "position": "",
    "period": ["(start)YYYY-MM-DD", "(end)YYYY-MM-DD"],
    "responsibilities": ["", ""],
    "type": "full|contract|internship|freelance",
    "status": "employed|resigned",
    "country": "",
    "pinned": true,
    "lang": ""
  }
]
```

```json
[
  {
    "title": "",
    "type": "course|completion|award|participation",
    "year": "YYYY",
    "organization": ["", ""],
    "achievement": ["", ""],
    "links": [
      {
        "type": "github|figma|article",
        "URL": ""
      },
      {
        "type": "github|figma|article",
        "URL": ""
      }
    ],
    "country": "",
    "pinned": true,
    "lang": ""
  }
]
```

```json
[
  {
    "title": "",
    "type": "certification|license",
    "year": "YYYY",
    "organization": "",
    "description": "",
    "country": "",
    "pinned": true,
    "lang": ""
  }
]
```

```markdown
---
title: "Hello, World 2"
date: "2026-04-19"
edited: "2026-04-22"
tags: ["Actually Second", "Init"]
lang: "en"
author: ["Dohan Kwon"]
description: "TTTTEEEESSSSSSTTTTT"
---

...
```

## TODO

global js

- [ ] Link text (and alternate text for images, when used as links) that is discernible, unique, and focusable improves the navigation experience for screen reader users. Learn how to make links accessible. 엑티비티

posts.html projects.html

- [ ] When a button doesn't have an accessible name, screen readers announce it as "button", making it unusable for users who rely on screen readers. Learn how to make buttons more accessible. 뷰어 백버튼

고민

- [ ] Lists do not contain only <li> elements and script supporting elements (<script> and <template>). 태그

\*.html

- [ ] 메타테그
- [x] 커맨드 버튼
- [ ] noscript 안내문
