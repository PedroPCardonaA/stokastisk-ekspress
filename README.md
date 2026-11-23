# 🚂 Stokastisk Ekspress

A train-trip exam-practice game for **ISTT1003 – Statistikk** at NTNU (the shared ISTx100y exam for ISTT/ISTA/ISTG 1001–1003 and VB6044). It is bilingual (🇳🇴 / 🇬🇧), a single offline HTML file, and has no tracking.

**▶ Play:** https://pedropcardonaa.github.io/stokastisk-ekspress/

## What's inside
- **486 questions along a line of 10 stations**, 383 of them calculations. Each station is a part of the syllabus (Løvås, weeks 1–9):

  | # | Station | Topic |
  |---|---|---|
  | 1 | 📊 Medianvik | Descriptive statistics |
  | 2 | 🎲 Utfallsrom stasjon | Events, combinatorics and probability |
  | 3 | 🔀 Bayesmoen | Conditional probability, Bayes and independence |
  | 4 | ⚖️ Forventningsdal | Random variables, expectation and variance |
  | 5 | 🪙 Binomdal | Binomial, geometric and hypergeometric |
  | 6 | ⏳ Poissonfjord | Poisson, exponential and Weibull (lifetimes) |
  | 7 | 🔔 Normalhaugen | The normal distribution and the CLT |
  | 8 | 🎯 Konfidensøy | Estimation and confidence intervals |
  | 9 | 🧪 Hypotesmo | Hypothesis testing |
  | 10 | 📈 Regresjonsund | Simple linear regression and correlation |

  - Every sub-question from the ISTx100y exams 2020–2025: ordinary exams, August resits and practice exams.
  - New practice questions in the same style.
  - Not covered: ISTT1003's 2.5 sp specialisation part (multiple linear regression, classification and cluster analysis). It has not appeared on any ISTx100y exam from 2020–2025, so use the course compendium for it.
- **Question types:**
  - single choice (6 options, as on the exam);
  - true/false;
  - "select all that are true";
  - **type-the-number** calculations.
- **Explanations everywhere:** the full calculation for the correct answer, plus which mistake produces each wrong option.
- **📋 Formula sheet & tables.** You can open them any time, including during the exam, as on the real Inspera exam. They contain:
  - the formula sheet, re-typeset;
  - binomial and Poisson cumulative tables;
  - Φ(z);
  - z and t critical values.

  The tables are computed in the app.
- **🧭 Conductor's handbook.** Every formula in the syllabus, grouped by station. Each comes with what the symbols mean, when to use it, typical mistakes and a worked example. It is searchable.
- **Figures drawn live:** histograms, box plots, pmf/pdf curves with shaded tail areas, scatter plots with regression lines, residual and QQ plots, Venn diagrams, probability trees and reliability diagrams.
- **🧪 Practice mode.** Pick 1–40 questions (default 7), spread along the line. You get an explanation after each answer and can browse back.
- **🧮 Calculation mode.** Only the calculation questions, each with its 📐 formula box. Tap a station to drill just that station.
- **📝 Exam mode.** 4–40 questions (default 22, like the real exam), in station order like task 1, 2, 3 …. There is no feedback until you submit.
  - The optional timer uses the real pace: 3 h for 22 questions.
  - The result is graded on the NTNU percentage scale.
  - The per-question formula box is hidden; use the formula sheet instead.
  - As on the real exam, you can switch an answer but not clear it.
- **📄 Export PDF.** A full trip report: score, grade, every question, your answer and all explanations.
- **The scenery reacts to how you're doing:**
  - The train speeds up as your score grows.
  - A streak turns on the express.
  - A wrong answer takes you into a tunnel past a red signal.
  - In night mode, the northern lights appear when you do well.
  - Stations you master light up along the line.
- Spaced-repetition question picking, a day/night/auto theme and keyboard shortcuts.

Progress is stored only in your browser's `localStorage`.

## Scoring
As on the ISTx100y exam, there are **no negative points**:

| Type | Correct | Wrong | Blank |
|---|---|---|---|
| Single choice / true-false | +1 | 0 | 0 |
| Select all (exact set) | +1 | 0 | 0 |
| Type the number (within tolerance) | +1 | 0 | 0 |

## Building from source
`index.html` is generated. Edit the files in `src/`, then run:

```bash
python3 src/build.py index.html      # template + figures + question banks + guide + KaTeX -> one file
cd src && node validate.js           # schema, KaTeX, figure rendering and scoring checks
```

| File | Contents |
|---|---|
| `src/template.html` | The engine: UI, scoring, modes, train scenery, formula sheet and tables, PDF report |
| `src/figs.js` | Figure catalog (`hist`, `box`, `bars`, `pmf`, `pdf`, `cdf`, `xy`, `resid`, `qq`, `venn`, `ptree`, `sys`, `line`, `dot`) |
| `src/qe_<TERM>.js` | Real exam questions, one file per exam (`H25` = December 2025, `K25` = August 2025, `P21` = practice exam 2021, …) |
| `src/qn_<station>.js` | New practice questions per station |
| `src/guide.js` | The Conductor's handbook (`GUIDE`) and the re-typeset formula sheet (`FORMELARK`) |
| `src/SPEC.md` | Content format: question schema, stations and figure kinds |
| `src/vendor/` | KaTeX 0.16.22 (MIT, `KATEX-LICENSE.txt`), inlined so formulas render offline |

## Disclaimer
This is an unofficial study tool, not affiliated with NTNU. Questions are based on the ISTx100y exams (2020–2025) and their solutions, the formula sheet and the course material; all course material is © NTNU and the course staff. Mistakes are possible: when in doubt, trust the official solutions.
