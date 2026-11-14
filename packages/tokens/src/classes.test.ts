// @vitest-environment node
// Class lint (D13, #159): the DESIGN.md rules, checked on Tailwind class
// strings in every file already written with utilities (a .svelte file
// without a <style> block, and its tv()/cn() calls). Files still on plain CSS
// are covered by usage.test.ts until they migrate.
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';
import { compile } from 'tailwindcss';
import { beforeAll, describe, expect, it } from 'vitest';
import { tailwindThemeCss } from './tailwind.js';

const root = join(import.meta.dirname, '../../..');
const roots = [
  'packages/ui/src/lib',
  'packages/memory/src/lib',
  'registry/blocks',
  'apps/playground/src',
];
/** dark: follows the nearest theme only two levels deep, so shared code never uses it. */
const noDark = ['packages/', 'registry/'];

function svelteFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'fixtures' ? [] : svelteFiles(path);
    return entry.name.endsWith('.svelte') ? [path] : [];
  });
}

/** Text from `start` up to the bracket that closes the one at `start - 1`. */
function balanced(source: string, start: number): string {
  let depth = 1;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (c === '(' || c === '{' || c === '[') depth++;
    else if (c === ')' || c === '}' || c === ']') depth--;
    if (depth === 0) return source.slice(start, i);
  }
  return source.slice(start);
}

/** String literals in a piece of code, with template expressions removed. */
function literals(code: string): string[] {
  return [...code.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)].map((m) =>
    (m[1] ?? m[2] ?? m[3] ?? '').replace(/\$\{[^}]*\}/g, ' '),
  );
}

/** Class strings: static class="…", and literals in class={…}, cn(…) and tv(…). */
export function classStrings(source: string): string[] {
  const markup = source.replace(/<script[\s\S]*?<\/script>/g, (s) => ' '.repeat(s.length));
  const found: string[] = [];
  for (const m of markup.matchAll(/\bclass="([^"]*)"/g))
    found.push(m[1]!.replace(/\{[^}]*\}/g, ' '));
  for (const m of source.matchAll(/\bclass=\{|\bcn\(|\btv\(/g)) {
    const body = balanced(source, m.index! + m[0].length);
    // tv({ defaultVariants: { variant: 'primary' } }) holds variant names, not classes.
    const classes = body.replace(/defaultVariants\s*:\s*\{[^}]*\}/g, '');
    found.push(...literals(classes));
  }
  return [...new Set(found.filter((s) => s.trim() !== ''))];
}

const tokens = (s: string) => s.split(/\s+/).filter(Boolean);
/** Hook classes (`cc-button`) and group/peer markers carry no style of their own. */
const hook = (t: string) => /^cc-[\w-]+$/.test(t) || /^(group|peer)(\/[\w-]+)?$/.test(t);
const utility = (t: string) => t.split(':').at(-1)!.replace(/^!|!$/g, '');

const palette =
  /^-?(bg|text|border(-[xytblrse])?|ring|ring-offset|inset-ring|outline|fill|stroke|from|via|to|shadow|inset-shadow|drop-shadow|decoration|accent|caret|divide|placeholder)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(\/\d+)?$|^-?(bg|text|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|divide)-(black|white)(\/\d+)?$/;

/** Rule violations in one class string; `file` is relative to the repo. */
export function violations(classString: string, file: string): string[] {
  const out: string[] = [];
  const list = tokens(classString);
  for (const t of list) {
    const u = utility(t);
    if (palette.test(u))
      out.push(`${t}: palette colour, use a theme role (bg-primary, text-muted-foreground)`);
    const value = u.match(/-\[(.*)\]$/) ?? u.match(/^\[(.*)\]$/);
    if (value && !value[1]!.includes('var(--'))
      out.push(`${t}: arbitrary value without a token, use a theme key or [prop:var(--token)]`);
    if (/^(duration|delay)-\d+$/.test(u))
      out.push(`${t}: literal duration, use duration-instant|fast|normal|slow`);
    if (/^ease-(linear|in|out|in-out)$/.test(u))
      out.push(`${t}: Tailwind curve, use ease-enter|exit|move|spring`);
    if (/(^|:)dark:/.test(`:${t}`) && noDark.some((p) => file.startsWith(p)))
      out.push(`${t}: dark: in shared code, rely on the theme roles`);
  }
  const motion = list.map(utility).filter((u) => /^transition(-|$)/.test(u));
  if (motion.length > 0) {
    if (!list.map(utility).some((u) => /^duration-(instant|fast|normal|slow)$/.test(u)))
      out.push(`${motion.join(' ')}: transition without a duration token`);
    if (!list.map(utility).some((u) => /^ease-(enter|exit|move|spring)$/.test(u)))
      out.push(`${motion.join(' ')}: transition without an easing token`);
  }
  if (
    list.map(utility).includes('ease-spring') &&
    motion.some(
      (u) =>
        !/^transition-(transform|\[(transform|translate|scale|rotate)(,(transform|translate|scale|rotate))*\])$/.test(
          u,
        ),
    )
  )
    out.push('ease-spring on a transition that is not transform, translate, scale or rotate');
  return out;
}

const files = roots
  .flatMap((r) => svelteFiles(join(root, r)))
  .filter((f) => !/<style[\s>]/.test(readFileSync(f, 'utf8')));

describe('class lint rules', () => {
  it.each([
    ['bg-blue-500', 'palette'],
    ['hover:text-white', 'palette'],
    ['bg-[#fff]', 'arbitrary'],
    ['w-[13px]', 'arbitrary'],
    ['duration-150 ease-enter transition-colors', 'literal duration'],
    ['transition-colors duration-fast ease-out', 'Tailwind curve'],
    ['transition-colors duration-fast', 'easing token'],
    ['transition-opacity duration-fast ease-spring', 'ease-spring'],
    ['dark:bg-card', 'dark:'],
  ])('rejects %s', (s, reason) => {
    expect(violations(s, 'packages/ui/src/lib/X.svelte').join('\n')).toContain(reason);
  });

  it.each([
    'bg-primary text-primary-foreground hover:bg-primary-hover',
    '[stroke-width:var(--cc-icon-stroke)] size-icon',
    'data-[state=open]:bg-accent',
    'transition-colors duration-fast ease-enter',
    'transition-transform duration-slow ease-spring',
  ])('accepts %s', (s) => {
    expect(violations(s, 'packages/ui/src/lib/X.svelte')).toEqual([]);
  });

  it('allows dark: in app code', () => {
    expect(violations('dark:bg-card', 'apps/playground/src/lib/X.svelte')).toEqual([]);
  });

  it('finds class strings in markup, cn() and tv(), not variant names', () => {
    const src = `<script>const b = tv({ base: 'px-4', variants: { v: { a: 'bg-primary' } }, defaultVariants: { v: 'a' } });</script>
<div class="flex gap-2 {x}"><span class={cn('text-sm', on && 'font-bold', className)}></span></div>`;
    expect(classStrings(src).sort()).toEqual([
      'bg-primary',
      'flex gap-2  ',
      'font-bold',
      'px-4',
      'text-sm',
    ]);
  });
});

describe('migrated files', () => {
  let known: (t: string) => boolean;

  beforeAll(async () => {
    const require = createRequire(import.meta.url);
    const tw = dirname(require.resolve('tailwindcss/package.json'));
    const compiler = await compile(`@import 'tailwindcss';\n${tailwindThemeCss()}`, {
      base: tw,
      loadStylesheet: async (id: string) => {
        const path =
          id === 'tailwindcss' ? join(tw, 'index.css') : join(tw, id.replace(/^tailwindcss\//, ''));
        return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
      },
    });
    let size = compiler.build([]).length;
    const seen = new Map<string, boolean>();
    known = (t) => {
      if (!seen.has(t)) {
        const next = compiler.build([t]).length;
        seen.set(t, next > size);
        size = next;
      }
      return seen.get(t)!;
    };
  });

  it('knows Tailwind and theme classes and rejects a typo', () => {
    for (const t of [
      'p-4',
      'text-sm',
      'bg-primary',
      'h-control',
      'duration-fast',
      'ease-spring',
      'hover:bg-accent',
      'data-[state=open]:opacity-100',
    ])
      expect(known(t), t).toBe(true);
    for (const t of ['bg-primry', 'h-contrl', 'duration-quick']) expect(known(t), t).toBe(false);
  });

  for (const file of files) {
    const name = relative(root, file);
    it(`${name} follows the class rules`, () => {
      const strings = classStrings(readFileSync(file, 'utf8'));
      const found = strings.flatMap((s) => violations(s, name));
      const unknown = strings
        .flatMap(tokens)
        .filter((t) => !hook(t) && /[-:[/]/.test(t) && !known(t))
        .map((t) => `${t}: not a Tailwind or theme class`);
      expect([...found, ...unknown]).toEqual([]);
    });
  }
});
