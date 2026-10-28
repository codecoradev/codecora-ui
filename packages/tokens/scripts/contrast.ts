// Prints the WCAG contrast report for every theme and accent; exits 1 on a failure.
// The same check runs as a unit test (src/contrast.test.ts).
import { checkAllAccents } from '../src/contrast.js';
import { themeNames } from '../src/schema.js';
import { themes } from '../src/themes.js';

let failures = 0;
for (const name of themeNames) {
  for (const { accent, results } of checkAllAccents(themes[name])) {
    const worst = results.reduce((a, b) => (b.ratio / b.min < a.ratio / a.min ? b : a));
    const failed = results.filter((r) => !r.pass);
    failures += failed.length;
    console.log(
      `${failed.length ? 'FAIL' : 'ok  '} ${name}/${accent}: ${results.length} pairs, tightest ` +
        `${worst.fg} on ${worst.bg} ${worst.ratio.toFixed(2)}:1 (min ${worst.min})`,
    );
    for (const r of failed)
      console.log(`     ${r.fg} on ${r.bg} ${r.ratio.toFixed(2)}:1, needs ${r.min}`);
  }
}
if (failures) {
  console.error(`\n${failures} pair(s) below WCAG AA`);
  process.exit(1);
}
