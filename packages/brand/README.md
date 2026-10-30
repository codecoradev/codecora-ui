# @codecora/brand

Product marks and favicon sets for CodeCora products, as files and as Svelte
components. Dependencies: none beyond Svelte; assets are imported with Vite's
`?url`, so use it in a Vite-based app (SvelteKit 2 or 3, plain Vite).

| Product   | Mark                       | Favicon set                                                    |
| --------- | -------------------------- | -------------------------------------------------------------- |
| Uteke     | vector (SVG), transparent  | `favicon.svg`, 16/32/48 PNG, `favicon.ico`, 180, 192, 512 PNG  |
| Corin     | raster (PNG, 256 px)       | 16/32/48 PNG, `favicon.ico`, 180 and 192 PNG on the night base |
| Gatehouse | vector (SVG), rounded tile | `mark.svg`, 16/32/48 PNG, `favicon.ico`, 180, 192, 512 PNG     |

```svelte
<script>
  import { Favicons, Mark } from '@codecora/brand';
</script>

<Favicons product="uteke" />
<Mark product="uteke" size={32} label="Uteke" />
```

- `Favicons` puts the product's `<link>` tags in the document head.
- `Mark` renders the mark as an image; it is decorative (empty `alt`) unless you
  pass `label`.
- `marks` is a map of every URL, and the raw files are importable from
  `@codecora/brand/assets/<product>/<file>`.

## Where the marks come from

The artwork is the products' own. Gatehouse already had an SVG. Uteke and Corin
only had PNG masters (a 512 px owl and a 256 px robot), so both were run through
[covecto](https://docs.rs/crate/covecto/0.1.2) 0.1.2 (`covecto vectorize`) and
the result was compared with the PNG: the traced fidelity against the original
at its own size (mean absolute RGB error, lower is better), the file size, and
a side-by-side at 256, 96, 48, 32 and 16 px with a 4x zoom.

| Master        | Variant                  |   Size | Mean error | Verdict                                                            |
| ------------- | ------------------------ | -----: | ---------: | ------------------------------------------------------------------ |
| Uteke 512 px  | PNG original             | 159 KB |          - | reference                                                          |
| Uteke         | covecto auto (spline)    |  29 KB |       2.94 | **used**: smooth curves, scales cleanly, a fifth of the PNG's size |
| Uteke         | spline, high colours     | 108 KB |       3.08 | wobblier edges                                                     |
| Uteke         | pixel-exact              | 1.6 MB |          0 | a raster in disguise, blocky when scaled                           |
| Corin 256 px  | PNG original             |  25 KB |          - | **used**                                                           |
| Corin         | covecto logo (spline)    |  64 KB |       6.97 | distorts the face: thick outlines, lost eye detail                 |
| Corin         | covecto auto (pixel)     | 132 KB |          0 | exact, but pixel stairs when scaled, so not a real vector          |
| Corin         | 4x upscale, then spline  | ~1 MB  |          - | far too large for a mark                                           |

So Uteke ships as vector and Corin stays a PNG. The Corin PNG is never scaled
past 256 px, which is why it has no 512 px icon. A vector master from the
artist would replace it; the component and file names would not change.

The Uteke SVG has the dark background path removed (a transparent mark with its
cream outline); `favicon.svg` and the PNG icons keep the dark tile. The Corin
touch icons put the mark on the Corin night base colour with 10% padding.
