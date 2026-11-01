---
'@codecora/ui': minor
---

Dialog, ConfirmDialog, Sheet, Popover and Toast now animate out as well as in, with exits one step shorter than entries. The centred Dialog and Toast move on `--cc-ease-spring` while their opacity eases. Popover gains an entry animation. Needs the matching `@codecora/tokens` release; with older tokens the new animations are skipped.
