---
target: @codecora/ui primitives on /components
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "url:http://localhost:4173/components"
timestamp: 2026-10-30T02-35-31Z
slug: localhost-components
---
Method: dual-agent (A: design review, B: detector and browser evidence). Target: @codecora/ui primitives on /components, three themes, desktop and 375 px.

Design Health Score: 27/40 (all ten heuristics applicable).
1 status 3 | 2 real world 3 | 3 control 3 | 4 consistency 3 | 5 error prevention 2 | 6 recognition 3 | 7 flexibility 2 | 8 minimalist 3 | 9 error recovery 2 | 10 documentation 2.

Design specificity: well built but derivative; identity lives in tokens, not structure. Detector: source scan clean; live pages 0 findings on /components, one advisory per theme page (em-dash-overuse, likely false positive), one on /dashboard (flat-type-hierarchy 1.22 vs 1.25). Contrast: 56 pairs per theme pass AA (lowest 4.82). Focus: 30 stops, all visible. No overflow at 375 px.

Priority issues
- [P1] Theme identity is paint-only (bolder, polish): badge shape per theme, row hover/selection style, focus ring shape.
- [P1] Invalid and error states weak and undemonstrated (harden): icon and hidden "Error:" prefix, stronger border, show invalid controls in the playground, forward `required`.
- [P2] ConfirmDialog not designed for high stakes (clarify): emphasise the irreversible sentence, focus Cancel first for danger, optional confirmText, end with a toast.
- [P2] Playground page does not document (layout, adapt): compact switcher toolbar, state matrix per component, table scroll hint at 375 px.
- [P3] Disabled looks too close to enabled in Corin (polish).
Bug: ConfirmDialog does not forward `theme` to Modal.

Questions: could anyone tell the products apart without colour; can "no structural change" keep identity; why is the first thing a switcher bar instead of one real screen.
