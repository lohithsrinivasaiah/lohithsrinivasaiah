# Portfolio Data

All portfolio content is loaded from `portfolio.json`. Edit this single file to update your experience, about me, feature projects, technical skills, and contact info across the entire site.

## Schema Overview

### `profile`
- `name` – Display name
- `username` – Username for nav paths (e.g. `lohithsrinivasaiah`)
- `title` – Job title
- `avatar` – Single character or emoji for avatar

### `experience`
Array of work/education entries:
- `company` – Company or institution name
- `companyDuration` – Total tenure (e.g. `"2 yrs 6 mos"`)
- `type` – `"work"` or `"education"`
- `roles` – Array of positions:
  - `title`, `timeline` (e.g. `"Jan 2023 - Present"`), `duration`, `location`, `summary`, `achievements`, `technologies`

### `about`
- `bio` – Array of paragraph strings
- `highlights` – Array of `{ icon, title, description }` (icons: Award, BookOpen, Coffee, etc.)
- `skills` – Array of `{ category, icon, items }` (icons: Code2, Terminal, Zap, Award)

### `projects`
Array of `{ id, name, description, techStack, link?, status }` where `status` is `"active"`, `"completed"`, or `"archived"`.

### `projectStats`
- `totalProjects`, `githubStars`, `contributions`, `openSource`

### `contact`
- `availability` – `{ status, location, timezone }`
- `methods` – Array of `{ icon, label, value, link, primary? }` (icons: Mail, Github, Linkedin, Twitter)
- `cta` – `{ title, description }`
- `responseTime`, `responseDescription`
