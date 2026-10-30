// The uteke and corin themes name web fonts that apps load themselves; the
// playground loads them so each theme renders as it ships. Latin subset only.
import geist from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url';
import jetbrainsMono from '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2?url';
import spaceGrotesk from '@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2?url';

const face = (family: string, url: string, weight: string) =>
  `@font-face { font-family: '${family}'; src: url('${url}') format('woff2'); ` +
  `font-weight: ${weight}; font-style: normal; font-display: swap; }`;

export const fontFaces = [
  face('Geist', geist, '100 900'),
  face('Space Grotesk', spaceGrotesk, '300 700'),
  face('JetBrains Mono', jetbrainsMono, '100 800'),
].join('\n');
