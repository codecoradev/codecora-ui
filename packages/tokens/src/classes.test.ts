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

/** Bracket-aware: the index of the last `ch` outside [...] and (...), or -1. */
function lastOutside(t: string, ch: string): number {
  let depth = 0;
  let found = -1;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth--;
    else if (c === ch && depth === 0) found = i;
  }
  return found;
}

/**
 * Class-bearing string literals in a piece of code. Template literals give
 * their static text and are searched again inside `${…}`. A literal used as an
 * object VALUE (`size: 'sm'`, recipe arguments, compoundVariants conditions,
 * defaultVariants) is a variant name, not a class; a quoted object KEY
 * (`{ 'font-bold': on }`) is a class.
 */
function literals(code: string, objectValuesAreClasses = false): string[] {
  const out: string[] = [];
  const re = /'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g;
  for (const m of code.matchAll(re)) {
    const before = code.slice(0, m.index).trimEnd();
    if (
      !objectValuesAreClasses &&
      /[\w$\]'"]\s*:$/.test(before) &&
      !/\?\s*[^:]*:$/.test(before.slice(-60))
    )
      continue;
    if (m[3] !== undefined) {
      out.push(m[3].replace(/\$\{[^}]*\}/g, ' '));
      for (const e of m[3].matchAll(/\$\{([^}]*)\}/g)) out.push(...literals(e[1]!));
    } else out.push(m[1] ?? m[2] ?? '');
  }
  return out;
}

/** In a tv() config, values under variants/base/slots are classes; the rest are names. */
function tvLiterals(body: string): string[] {
  const names = body
    .replace(/defaultVariants\s*:\s*\{[^}]*\}/g, '')
    // compoundVariants: [{ variant: 'primary', size: 'sm', class: '…' }]: keep only class/className
    .replace(/\{([^{}]*\b(?:class|className)\s*:[^{}]*)\}/g, (_, inner: string) =>
      inner.replace(/\b(?!class\b|className\b)[\w$]+\s*:\s*('[^']*'|"[^"]*"|\[[^\]]*\])/g, ''),
    );
  return literals(names, true);
}

/**
 * Class expressions: each static `class="…"`/`class='…'` (with the literals in
 * its `{…}` parts), each `class={…}`, `cn(…)` and `tv(…)`, and each
 * `class:name` directive. One group is one element's class list, so the
 * transition rule sees `cn('transition-colors', 'duration-fast ease-enter')`
 * as a whole.
 */
export function classGroups(source: string): string[][] {
  const markup = source.replace(/<script[\s\S]*?<\/script>/g, (s) => ' '.repeat(s.length));
  const groups: string[][] = [];
  for (const m of markup.matchAll(/\bclass=("([^"]*)"|'([^']*)')/g)) {
    const value = m[2] ?? m[3] ?? '';
    const group = [value.replace(/\{[^}]*\}/g, ' ')];
    for (const e of value.matchAll(/\{([^}]*)\}/g)) group.push(...literals(e[1]!));
    groups.push(group);
  }
  for (const m of markup.matchAll(/\bclass:([^\s=>/]+)/g)) groups.push([m[1]!]);
  for (const m of source.matchAll(/\bclass=\{|\bcn\(|\btv\(/g)) {
    const body = balanced(source, m.index! + m[0].length);
    groups.push(m[0] === 'tv(' ? tvLiterals(body) : literals(body));
  }
  return groups.map((g) => g.filter((s) => s.trim() !== '')).filter((g) => g.length > 0);
}

/** All class strings, for tests and the unknown-class check. */
export const classStrings = (source: string): string[] => [...new Set(classGroups(source).flat())];

const tokens = (s: string) => s.split(/\s+/).filter(Boolean);
/** Hook classes (`cc-button`) and group/peer markers carry no style of their own. */
const hook = (t: string) => /^cc-[\w-]+$/.test(t) || /^(group|peer)(\/[\w-]+)?$/.test(t);
/** The utility without its variants (`hover:`, `data-[state=open]:`) and `!`. */
const utility = (t: string) => t.slice(lastOutside(t, ':') + 1).replace(/^!|!$/g, '');

const palette =
  /^-?(bg|text|border(-[xytblrse])?|ring|ring-offset|inset-ring|outline|fill|stroke|from|via|to|shadow|inset-shadow|drop-shadow|decoration|accent|caret|divide|placeholder)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(\/\d+)?$|^-?(bg|text|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|divide)-(black|white)(\/\d+)?$/;

/** A transition-[…] value that only lists properties, which is not a value to tokenise. */
const propertyList = /^transition-\[[a-z-]+(,[a-z-]+)*\]$/;
const springOnly =
  /^transition-(transform|\[(transform|translate|scale|rotate)(,(transform|translate|scale|rotate))*\])$/;

/** Rule violations in one element's class list (a group of strings); `file` is relative to the repo. */
export function violations(classList: string | string[], file: string): string[] {
  const out: string[] = [];
  const list = tokens([classList].flat().join(' '));
  const utilities = list.map(utility);
  for (const t of list) {
    const u = utility(t);
    if (palette.test(u))
      out.push(`${t}: palette colour, use a theme role (bg-primary, text-muted-foreground)`);
    const value = u.match(/-\[(.*)\]$/) ?? u.match(/^\[(.*)\]$/);
    if (value && !value[1]!.includes('var(--') && !propertyList.test(u))
      out.push(`${t}: arbitrary value without a token, use a theme key or [prop:var(--token)]`);
    if (/^(duration|delay)-\d+$/.test(u))
      out.push(`${t}: literal duration, use duration-instant|fast|normal|slow`);
    if (/^ease-(linear|in|out|in-out)$/.test(u))
      out.push(`${t}: Tailwind curve, use ease-enter|exit|move|spring`);
    if (/(^|:)dark:/.test(`:${t}`) && noDark.some((p) => file.startsWith(p)))
      out.push(`${t}: dark: in shared code, rely on the theme roles`);
  }
  // transition-none (also under motion-reduce:) stops motion, so it needs no timing.
  const motion = utilities.filter((u) => /^transition(-|$)/.test(u) && u !== 'transition-none');
  if (motion.length > 0) {
    if (!utilities.some((u) => /^duration-(instant|fast|normal|slow)$/.test(u)))
      out.push(`${motion.join(' ')}: transition without a duration token`);
    if (!utilities.some((u) => /^ease-(enter|exit|move|spring)$/.test(u)))
      out.push(`${motion.join(' ')}: transition without an easing token`);
  }
  if (utilities.includes('ease-spring') && motion.some((u) => !springOnly.test(u)))
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
    ['[color:#fff]', 'arbitrary'],
    ['hover:bg-[color:#fff]', 'arbitrary'],
  ])('rejects %s', (s, reason) => {
    expect(violations(s, 'packages/ui/src/lib/X.svelte').join('\n')).toContain(reason);
  });

  it.each([
    'bg-primary text-primary-foreground hover:bg-primary-hover',
    '[stroke-width:var(--cc-icon-stroke)] size-icon',
    'data-[state=open]:bg-accent',
    'transition-colors duration-fast ease-enter',
    'transition-transform duration-slow ease-spring',
    'motion-reduce:transition-none',
    'transition-[background-color,border-color] duration-fast ease-enter',
    'data-[state=open]:[&_svg]:rotate-180',
  ])('accepts %s', (s) => {
    expect(violations(s, 'packages/ui/src/lib/X.svelte')).toEqual([]);
  });

  it('allows dark: in app code', () => {
    expect(violations('dark:bg-card', 'apps/playground/src/lib/X.svelte')).toEqual([]);
  });

  it('finds class strings in markup, cn() and tv(), not variant names', () => {
    const src = `<script>const b = tv({ base: 'px-4', variants: { v: { a: 'bg-primary' } }, compoundVariants: [{ v: 'a', class: 'font-medium' }], defaultVariants: { v: 'a' } });</script>
<div class="flex gap-2 {on ? 'bg-blue-500' : 'bg-card'}"><span class={cn(b({ v: 'icon-sm' }), 'text-sm', on && 'font-bold', \`p-2 \${on ? 'mt-1' : ''}\`, className)}></span></div>
<p class='italic' class:underline={on}></p>`;
    expect(classStrings(src).sort()).toEqual(
      [
        'bg-blue-500',
        'bg-card',
        'bg-primary',
        'flex gap-2  ',
        'font-bold',
        'font-medium',
        'italic',
        'mt-1',
        'p-2  ',
        'px-4',
        'text-sm',
        'underline',
      ].sort(),
    );
  });

  it("checks the transition rule across one element's class list", () => {
    expect(
      violations(['transition-colors', 'duration-fast ease-enter'], 'packages/ui/src/lib/X.svelte'),
    ).toEqual([]);
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
      const groups = classGroups(readFileSync(file, 'utf8'));
      const strings = groups.flat();
      const found = groups.flatMap((g) => violations(g, name));
      const unknown = strings
        .flatMap(tokens)
        .filter((t) => !hook(t) && /[-:[/]/.test(t) && !known(t))
        .map((t) => `${t}: not a Tailwind or theme class`);
      expect([...found, ...unknown]).toEqual([]);
    });
  }
});
