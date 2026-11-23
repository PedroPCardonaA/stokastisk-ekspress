# Content spec: Stokastisk Ekspress (ISTT1003 Statistikk exam-practice game)

This is a single-file HTML quiz game, train-themed, for the NTNU statistics exam ISTx100y (ISTT1003 and siblings). The engine is `src/template.html`. Content lives in plain JS files that `build.py` concatenates. **Only create or edit the files you were assigned.** Do not run `build.py`: other agents build in parallel and the output is shared. Check your work with:

```bash
cd "/home/pedroc/Downloads/raisa assigmen/stat exam/stokastisk-ekspress/src" && node validate.js <your files>
```

It must print `OK` before you finish. Warnings are acceptable if you have looked at them.

## Exam facts (what the real exam looks like)
- Digital Inspera exam, 3 h, about 22 equally weighted sub-questions. Most are **single choice with 6 options**. Some are numeric entry or true/false. **No negative points.**
- The exam provides a formula sheet and tables: binomial cdf, Poisson cdf, standard normal cdf, z and t critical values. The game has the same tables.
- Pensum is weeks 1–9 of Løvås, *Statistikk for universiteter og høgskoler*: kap. 1, 2.1–2.5, 3.1–3.6, 4, 5.1–5.2, 5.4–5.8, 5.9.2, 6.1–6.5 (not 6.2.6 or 6.3.4), 7.1–7.3. Design of experiments and quality control are NOT on the exam.
- Sources:
  - Exams and solutions: `../sources/ISTx100yEksamen<TERM>.pdf` and `../sources/ISTx100yLF<TERM>.pdf`.
  - Formula sheet: `../sources/formelark.pdf`.
  - Lecture notes: `~/Downloads/stat/slides/*.pdf`.
  - Formulas and figures in the PDFs are often images, and `pdftotext` drops them. **Read the pages visually** with the Read tool's `pages` parameter (max 20 pages per call), and use `pdftotext -layout` only as a helper.

## Stations (field `t`)
| t | Station | Topic |
|---|---|---|
| 0 | Medianvik | Descriptive statistics: mean, median, quartiles, IQR, empirical variance/sd, box plots, histograms, empirical correlation/covariance, data types |
| 1 | Utfallsrom stasjon | Sample spaces, events, set operations, Venn, axioms, addition rule, combinatorics (permutations, combinations, ordered/unordered, with/without replacement), urn models, classical probability |
| 2 | Bayesmoen | Conditional probability, multiplication rule, law of total probability, Bayes' rule, probability trees, independence (incl. reliability of independent components when framed as events) |
| 3 | Forventningsdal | Discrete and continuous random variables, pmf/pdf/cdf, expectation, variance, rules for E and Var of linear combinations, joint (simultaneous) distributions, marginal distributions, covariance, correlation, independence of RVs |
| 4 | Binomdal | Binomial experiments, binomial distribution (and table use), geometric distribution (Y = number of trials up to and including the first success), hypergeometric/urn model |
| 5 | Poissonfjord | Poisson process, Poisson distribution (and table use), exponential distribution (memorylessness), Weibull distribution, lifetimes and reliability, series/parallel systems, failure rate |
| 6 | Normalhaugen | Normal distribution, standardisation, table use, quantiles, linear combinations of normal variables, the distribution of the sample mean, the central limit theorem, normal approximation to binomial/Poisson |
| 7 | Konfidensøy | Point estimators, unbiasedness, variance/efficiency of estimators, MLE if present, confidence intervals for μ (σ known: z; σ unknown: t), for p, for differences/variance if present, interval width and sample size |
| 8 | Hypotesmo | Hypotheses, test statistic, rejection region, p-value, significance level, type I/II errors, power, one- and two-sided z and t tests, tests for p |
| 9 | Regresjonsund | Simple linear regression: least squares β̂₀ and β̂₁, s², residuals, R², interpreting output, CI and tests for β₁, prediction, correlation and regression |

Python questions (scipy.stats / numpy code) go in the station whose maths they test.

## Question schema
Each content file is plain JS that pushes into the global array `QB`:

```js
QB.push(
{id:"H24-2a", t:2, s:"H24", kind:"single",
 q:["<Norwegian question text>", "<English question text>"],
 o:[["0,080","0.080"], ["0,340","0.340"], …],          // options as [no, en]
 a:0,                                                   // index of the correct option
 w:["<why the answer is correct, with the calculation>", "<English>"],
 x:[null, ["<why this wrong option is wrong / which mistake gives it>","<English>"], …],  // one per option, null at a
 f:["$P(A\\cap B)=P(B\\mid A)P(A)$", "$P(A\\cap B)=P(B\\mid A)P(A)$"], // formula box (optional, see below)
 fig:{k:"ptree", …}                                     // optional figure, see "Figures"
},
…
);
```

Fields:
- `id`: a unique string.
  - Real exams: `<TERM>-<task><letter>`, e.g. `H24-2a`, `K23-6c`. If a task has no letters, use `H21-4` (or `H21-4a` if it has several parts).
  - New practice questions: `n<t>-<number>`, e.g. `n6-07`.
- `t`: station 0–9.
- `s`: the source.
  - Exams: `"H20" … "H25"` (December), `"K21" … "K25"` (August resit).
  - Practice exams: `"P21"` (ProveEksamenH21), `"P20a"` (Prove1EksamenH20), `"P20b"` (Prove2EksamenH20).
  - Other: `"notes"` (from lecture notes), `"new"` (your own new practice question).
- `kind`:
  - `"single"`: one correct option. This is the default and the real exam's main type. Use **6 options** when the original had 6. Keep the original options for real exam questions.
  - `"tf"`: true/false. `o` must be exactly `[["Sant","True"],["Usant","False"]]`, `a` is 0 (true) or 1 (false), and `x` has `null` at `a` and an explanation for the other.
  - `"multi"`: select all that are true. `a` is an array of indices. **Every** `x[i]` is `[no,en]` and says why that statement is true or false.
  - `"num"`: type the number. Use `ans` (a number) and `tol` (> 0, absolute). Use a tolerance that accepts correct rounding of the stated precision, e.g. "answer with 3 decimals" → `tol: 0.0015`; a probability given to 3 decimals → `tol: 0.002`. Add `unit:["timer","hours"]` if needed. There are no `o`, `a` or `x`.
- `q`: bilingual question text (HTML allowed: `<b>`, `<br>`, `<i>`, `<sub>`, `<sup>`, and tables with `class="cm"`, e.g. `<table class="cm"><tr><th>x</th><th>0</th></tr>…</table>`).
  - **Every question must be self-contained.** Repeat the scenario, data and earlier givens in each sub-question, because questions are shown alone and in random order. Example: H24-2b must restate the shipping scenario from 2a.
  - Norwegian is bokmål, as close to the original exam wording as possible. English is a natural translation.
- Maths: write it as LaTeX between `$…$` (KaTeX, rendered everywhere: q, o, w, x, f, unit). In JS strings, backslashes must be doubled: `"$\\bar{x}$"`.
  - **Never** use a literal `$` for anything else (write "kr" or "USD").
  - Use a decimal comma in Norwegian text and a decimal point in English where practical. Inside LaTeX use `{,}` for a decimal comma, e.g. `$0{,}914$`. Plain text like "0,914" is also fine.
  - Use `\\cdot`, `\\frac`, `\\sqrt`, `\\binom{n}{k}`, `\\bar{x}`, `\\hat{\\beta}_1`, `\\sigma`, `\\mu`, `\\Phi`, `\\mid`, `\\leq`, `\\geq`, `\\neq`, `\\approx`, `\\sum_{i=1}^{n}`, `\\overline{A}`, `A^{c}`, `\\cap`, `\\cup`.
- `w`: the explanation of the correct answer. Show the full calculation step by step, as in the solution (LF), with brief intuition. For real exam questions, check it against the LF.
- `x`: per-option explanations of wrong choices. Name the specific mistake that produces each wrong number where you can, e.g. "Forgot to divide by n−1", "Used P(B|A) instead of P(A|B)", "Used the z quantile instead of t". For a distractor with no clear story, write why the value is impossible or doesn't fit.
- `f` (optional): bilingual formula box with the formula(s) needed, in LaTeX. Rules:
  - **Required for every `kind:"num"` question with `s:"new"`.**
  - Recommended for every calculation question, including real-exam calculation questions; they then appear in 🧮 Calculation mode.
  - Leave it out for purely conceptual questions.
  - It is hidden in exam mode, where the formula sheet is used instead.
- `c` (optional): a code string shown as a code block, for Python questions. Plain text, not HTML.
- `fig` (optional): a figure object, see below. Re-create graphs from the exam (box plots, histograms, scatter plots with regression lines, pdf curves …) with these kinds. If a figure cannot be expressed, describe it in text or use an HTML table.

## Figures (`fig`)
The figure engine in `figs.js` draws SVG that adapts to light and dark themes. Shared conventions:
- Every figure accepts `xLabel`, `yLabel` (string or `[no,en]`), `title` (optional), and an optional `w`/`h` size hint.
- Numbers are data values, not pixels.
- Bilingual labels may be `[no,en]`.

| kind | Fields | Use |
|---|---|---|
| `hist` | `bins:[[from,to,count],…]` **or** `data:[…]` with `binWidth` (and optional `start`); `density:true` to plot densities; `curve:{dist:"norm",mu,sigma}` to overlay a pdf | histograms |
| `box` | `groups:[{name, data:[…]}]` **or** `groups:[{name, min,q1,med,q3,max, out:[…]}]`; `horizontal:true` (default) or false | box plots, one or several side by side |
| `bars` | `items:[[label,value],…]` | bar charts of counts or proportions |
| `pmf` | `xs:[…], ps:[…]`; `hl:[x,…]` to highlight bars; `cum:true` to draw the cdf instead | discrete distributions |
| `pdf` | `curves:[{dist:"norm",mu,sigma} \| {dist:"exp",lambda} \| {dist:"t",df} \| {dist:"weibull",k,lambda} \| {dist:"unif",a,b} \| {dist:"chisq",df} \| {dist:"custom",xs:[…],ys:[…]} , name?}]`; `range:[xmin,xmax]`; `shade:[[a,b],…]` (use null for ±∞) shaded under the first curve; `marks:[x,…]` vertical dashed lines; `labels:[[x,"text"],…]` | densities, tail areas, rejection regions, p-values |
| `cdf` | Same `curves`/`range` as `pdf` for continuous, or `xs`,`ps` for a step cdf | cumulative distribution functions |
| `xy` | `pts:[[x,y],…]`; `line:{b0,b1}` draws y = b0 + b1·x; `xRange`, `yRange` optional; `series:[{pts,name}]` for several groups | scatter plots, regression lines |
| `resid` | `pts:[[fitted,residual],…]` (or `x` on the first axis) | residual plots |
| `qq` | `data:[…]` (normal QQ plot computed internally) **or** `pts:[[theoretical,sample],…]` | normal probability plots |
| `venn` | `sets:["A","B"]` or `["A","B","C"]`; `vals:{"A":0.2,"AB":0.1,"B":0.3,"none":0.4}` region labels (keys: A, B, C, AB, AC, BC, ABC, none, meaning the region *only* in those sets); `shade:["AB",…]` | Venn diagrams |
| `ptree` | `root:[{l:"A", p:"0.6", kids:[{l:"B", p:"0.99"},{l:"B'", p:"0.01"}]}, …]` (p as display strings, can be LaTeX-free text like "0,6") | probability trees, 2–3 levels |
| `sys` | `sys:["s", "A", ["p","B","C"], "D"]`: nested series ("s") / parallel ("p") blocks of component labels | reliability block diagrams |
| `line` | `xs:[…], series:[{name, ys:[…]}]` | generic line charts |
| `dot` | `data:[…]` | dot plots for small data sets |

(For `weibull` use `{dist:"weibull", k, lambda}` with $F(x)=1-e^{-(x/\lambda)^k}$. If an exam uses another parametrisation, convert it.)

## Quality bar
- **Correctness first.** For real exam questions, the correct option and every number must match the official LF. Recompute numbers yourself, e.g. with `python3 -c` (scipy is not guaranteed, so use math/statistics or write the formula). If the LF and your calculation disagree, trust the LF, but say so in `w`.
- New questions: realistic engineering contexts in the same style as the exams (production, lifetimes, measurements, logistics, aquaculture, construction). Use clean numbers, and include table-based questions (e.g. "use the binomial table") where natural.
- Six options for single choice where possible, with plausible distractors made from common mistakes.
- Never put the answer in the question text. Keep HTML well-formed.
