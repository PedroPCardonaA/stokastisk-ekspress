"""Build the single-file app: template + figures + question banks + guide (+ KaTeX inlined).
Usage: python3 src/build.py index.html
Content files are picked up by glob, in this order: qe_*.js (real exams), qn_*.js (new practice), fix*.js, guide.js.
"""
import sys, os, glob
targets = [os.path.abspath(a) for a in sys.argv[1:]]
here = os.path.dirname(os.path.abspath(__file__))
os.chdir(here)

def content_files():
    return sorted(glob.glob('qe_*.js')) + sorted(glob.glob('qn_*.js')) + sorted(glob.glob('fix*.js')) + (['guide.js'] if os.path.exists('guide.js') else [])

if __name__ == '__main__':
    t = open('template.html').read()
    FILES = content_files()
    qs = "\n".join("// ---- %s ----\n" % f + open(f).read() for f in FILES)
    assert t.count('/*__QUESTIONS__*/') == 1 and t.count('/*__FIGS__*/') == 1
    out = t.replace('/*__FIGS__*/', open('figs.js').read()).replace('/*__QUESTIONS__*/', qs)
    assert out.count('/*__KATEX_CSS__*/') == 1 and out.count('/*__KATEX_JS__*/') == 1
    # KaTeX (MIT, see vendor/KATEX-LICENSE.txt) is inlined with base64 woff2 fonts so the app stays a single offline file
    out = out.replace('/*__KATEX_CSS__*/', open('vendor/katex.inline.css').read()).replace('/*__KATEX_JS__*/', '/*! KaTeX v0.16.22 | MIT License | https://katex.org */\n' + open('vendor/katex.min.js').read())
    for target in targets:
        open(target, 'w').write(out)
    open('app.js', 'w').write(out.split('<script>\n"use strict";')[1].split('</script>')[0])
    print(len(out), "bytes ->", ", ".join(targets), "| files:", len(FILES))
