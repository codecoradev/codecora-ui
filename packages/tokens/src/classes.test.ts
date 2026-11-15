// @vitest-environment node
// Class lint (D13, #159): the DESIGN.md rules, checked on Tailwind class
// strings in every file already written with utilities (a .svelte file
// without a <style> block, and its tv()/cn() calls, plus the variables and
// prop defaults those read). Strings built elsewhere (imported constants,
// .ts modules) are not followed. A file with a <style> block is skipped:
// every component, block and page is on utilities, so only a file whose
// markup holds a "<style>" string (the playground layout's {@html}) is left out.
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';
import { parse } from 'svelte/compiler';
import { compile } from 'tailwindcss';
import { beforeAll, describe, expect, it } from 'vitest';
import { tailwindKeys, tailwindThemeCss, tailwindUtilities } from './tailwind.js';

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

// The extraction walks the Svelte AST (svelte/compiler), so ternaries,
// template literals, comparisons and nested calls are read as code, not text.
type Node = { type: string; [key: string]: unknown };
const isNode = (v: unknown): v is Node =>
  typeof v === 'object' && v !== null && typeof (v as Node).type === 'string';
const SKIP = new Set([
  'parent',
  'loc',
  'start',
  'end',
  'metadata',
  'leadingComments',
  'trailingComments',
]);
const keyName = (p: Node): string | undefined => {
  const key = p.key as Node | undefined;
  if (!key || p.computed) return undefined;
  return key.type === 'Identifier'
    ? (key.name as string)
    : key.type === 'Literal'
      ? String(key.value)
      : undefined;
};
const isClassCall = (n: Node) =>
  n.type === 'CallExpression' &&
  (n.callee as Node).type === 'Identifier' &&
  ['cn', 'clsx'].includes((n.callee as Node).name as string);

/**
 * Strings an expression can put into a class list. Branches of ternaries and
 * logical operators, array items, clsx object keys and cn()/clsx() arguments
 * count; conditions, comparison operands and the arguments of other calls
 * (recipe options such as `size: 'sm'`) do not.
 */
function classLiterals(n: unknown): string[] {
  if (!isNode(n)) return [];
  switch (n.type) {
    case 'Literal':
      return typeof n.value === 'string' ? [n.value] : [];
    case 'TemplateLiteral':
      return [
        (n.quasis as Node[]).map((q) => (q.value as { cooked: string }).cooked).join(' '),
        ...(n.expressions as Node[]).flatMap(classLiterals),
      ];
    case 'ConditionalExpression':
      return [...classLiterals(n.consequent), ...classLiterals(n.alternate)];
    case 'LogicalExpression':
      return n.operator === '&&'
        ? classLiterals(n.right)
        : [...classLiterals(n.left), ...classLiterals(n.right)];
    case 'BinaryExpression':
      return n.operator === '+' ? [...classLiterals(n.left), ...classLiterals(n.right)] : [];
    case 'ArrayExpression':
      return (n.elements as unknown[]).flatMap(classLiterals);
    case 'ObjectExpression':
      return (n.properties as Node[]).flatMap((p) => {
        const k = p.type === 'Property' ? keyName(p) : undefined;
        return k === undefined ? [] : [k];
      });
    case 'CallExpression':
      return isClassCall(n) ? (n.arguments as unknown[]).flatMap(classLiterals) : [];
    case 'SpreadElement':
      return classLiterals(n.argument);
    case 'ChainExpression':
    case 'TSSatisfiesExpression':
    case 'TSAsExpression':
    case 'TSNonNullExpression':
      return classLiterals(n.expression);
    default:
      return [];
  }
}

/**
 * Class lists in a tv() config, one per slot (each slot styles its own
 * element): base, slots, variant values and compound class/className, each
 * filed under the slot it targets (`base` without slots).
 */
function tvGroups(config: unknown): string[][] {
  if (!isNode(config) || config.type !== 'ObjectExpression') return [];
  const bySlot = new Map<string, string[]>();
  const add = (slot: string, v: unknown) =>
    bySlot.set(slot, [...(bySlot.get(slot) ?? []), ...classLiterals(v)]);
  const props = (obj: unknown): Node[] =>
    isNode(obj) && obj.type === 'ObjectExpression'
      ? (obj.properties as Node[]).filter((p) => p.type === 'Property')
      : [];
  /** A class value or a { slot: classes } map. */
  const file = (v: unknown) =>
    isNode(v) && v.type === 'ObjectExpression'
      ? props(v).forEach((p) => add(keyName(p) ?? 'base', p.value))
      : add('base', v);
  for (const p of props(config)) {
    switch (keyName(p)) {
      case 'base':
        add('base', p.value);
        break;
      case 'slots':
        file(p.value);
        break;
      case 'variants':
        for (const variant of props(p.value))
          for (const option of props(variant.value)) file(option.value);
        break;
      case 'compoundVariants':
      case 'compoundSlots':
        if (isNode(p.value) && p.value.type === 'ArrayExpression')
          for (const entry of p.value.elements as unknown[])
            for (const q of props(entry))
              if (['class', 'className'].includes(keyName(q) ?? '')) file(q.value);
        break;
      default: // defaultVariants, extend, …: names and options, not classes
    }
  }
  return [...bySlot.values()];
}

/**
 * Identifiers in class-value positions (the same places classLiterals reads
 * strings from), to follow `class={cls}` back to `cls`. Identifiers used as
 * conditions or recipe options (`button({ variant })`) are not followed.
 */
function identifiers(n: unknown, into = new Set<string>()): Set<string> {
  if (Array.isArray(n)) n.forEach((x) => identifiers(x, into));
  else if (isNode(n))
    switch (n.type) {
      case 'Identifier':
        into.add(n.name as string);
        break;
      case 'ExpressionTag':
        identifiers(n.expression, into);
        break;
      case 'ConditionalExpression':
        identifiers([n.consequent, n.alternate], into);
        break;
      case 'LogicalExpression':
        identifiers(n.operator === '&&' ? [n.right] : [n.left, n.right], into);
        break;
      case 'BinaryExpression':
        if (n.operator === '+') identifiers([n.left, n.right], into);
        break;
      case 'ArrayExpression':
        identifiers(n.elements, into);
        break;
      case 'SpreadElement':
        identifiers(n.argument, into);
        break;
      case 'TemplateLiteral':
        identifiers(n.expressions, into);
        break;
      case 'CallExpression':
        if (isClassCall(n)) identifiers(n.arguments, into);
        break;
      default:
    }
  return into;
}

/** `$derived(x)` is x; other initialisers stay as they are. */
const unwrap = (n: unknown): unknown =>
  isNode(n) &&
  n.type === 'CallExpression' &&
  (n.callee as Node).type === 'Identifier' &&
  (n.callee as Node).name === '$derived'
    ? (n.arguments as unknown[])[0]
    : n;

/**
 * Class expressions: each `class` attribute (static text plus its `{…}`
 * parts, or `class={…}`), each `class:name` directive, each cn()/clsx() call,
 * each tv() slot, and the value of any variable or prop default that a class
 * expression reads (`const cls = $derived(…)`, `class: className = '…'`).
 * One group is one class list, so the transition rule sees
 * `cn('transition-colors', 'duration-fast ease-enter')` as a whole.
 */
function extract(source: string): { groups: string[][]; followed: string[] } {
  const ast = parse(source, { modern: true }) as unknown as Node;
  const groups: string[][] = [];
  const read = new Set<string>();
  const walk = (n: unknown): void => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!isNode(n)) return;
    if (n.type === 'Attribute' && n.name === 'class') {
      const parts = Array.isArray(n.value) ? (n.value as Node[]) : [n.value as Node];
      groups.push(
        parts.flatMap((part) =>
          part?.type === 'Text'
            ? [part.data as string]
            : part?.type === 'ExpressionTag'
              ? classLiterals(part.expression)
              : [],
        ),
      );
      identifiers(
        parts.filter((part) => part?.type === 'ExpressionTag'),
        read,
      );
      return;
    }
    if (n.type === 'ClassDirective') groups.push([n.name as string]);
    if (n.type === 'CallExpression' && isClassCall(n)) {
      groups.push((n.arguments as unknown[]).flatMap(classLiterals));
      identifiers(n.arguments, read);
      return;
    }
    if (
      n.type === 'CallExpression' &&
      (n.callee as Node).type === 'Identifier' &&
      (n.callee as Node).name === 'tv'
    ) {
      groups.push(...tvGroups((n.arguments as unknown[])[0]));
      return;
    }
    for (const [k, v] of Object.entries(n)) if (!SKIP.has(k)) walk(v);
  };
  walk(ast);
  // Second pass: values of the variables and prop defaults those expressions read.
  const follow = (n: unknown): void => {
    if (Array.isArray(n)) return n.forEach(follow);
    if (!isNode(n)) return;
    const id = (x: unknown) => (isNode(x) && x.type === 'Identifier' ? (x.name as string) : '');
    if (n.type === 'VariableDeclarator' && read.has(id(n.id)))
      followed.push(...classLiterals(unwrap(n.init)));
    if (n.type === 'AssignmentPattern' && read.has(id(n.left)))
      followed.push(...classLiterals(n.right));
    for (const [k, v] of Object.entries(n)) if (!SKIP.has(k)) follow(v);
  };
  const followed: string[] = [];
  follow(ast);
  return {
    groups: groups.map((g) => g.filter((s) => s.trim() !== '')).filter((g) => g.length > 0),
    followed: followed.filter((s) => s.trim() !== ''),
  };
}

/** Class lists written in place: attributes, directives, cn()/clsx() calls, tv() slots. */
export const classGroups = (source: string): string[][] => extract(source).groups;

/**
 * Strings followed from `class={x}` to the variable or prop default `x`.
 * Names are matched by name, not scope, and the value is not joined to the
 * element that reads it, so these get the per-class rules only (no timing
 * rule, no unknown-class check). `$state()`/`$derived.by()` values and
 * identifiers inside a followed value are not followed.
 */
export const followedStrings = (source: string): string[] => extract(source).followed;

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

/** All class strings, for tests and the unknown-class check. */
export const classStrings = (source: string): string[] => {
  const { groups, followed } = extract(source);
  return [...new Set([...groups.flat(), ...followed])];
};

const tokens = (s: string) => s.split(/\s+/).filter(Boolean);
/** Hook classes (`cc-button`) and group/peer markers carry no style of their own. */
const hook = (t: string) => /^cc-[\w-]+$/.test(t) || /^(group|peer)(\/[\w-]+)?$/.test(t);
/** The utility without its variants (`hover:`, `data-[state=open]:`) and `!`. */
const utility = (t: string) => t.slice(lastOutside(t, ':') + 1).replace(/^!|!$/g, '');

const palette =
  /^-?(bg|text|border(-[xytblrse])?|ring|ring-offset|inset-ring|outline|fill|stroke|from|via|to|shadow|inset-shadow|drop-shadow|decoration|accent|caret|divide|placeholder)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}(\/\d+)?$|^-?(bg|text|border|ring|outline|fill|stroke|from|via|to|shadow|decoration|divide)-(black|white)(\/\d+)?$/;

/** A transition-[…] value that only lists properties, which is not a value to tokenise. */
const propertyList = /^transition-\[[a-z-]+(,[a-z-]+)*\]$/;
/**
 * Arbitrary values that are layout, not design decisions. CSS-wide keywords
 * (`font-[inherit]`, `max-h-[none]`) are fine anywhere; lengths relative to
 * the viewport or the parent (`max-h-[85dvh]`, `w-[50%]`) only on sizing and
 * position utilities. Type, spacing, radius, colour and time still need a token.
 */
const keywordValue = /^(inherit|initial|unset|revert|auto|none|currentcolor)$/i;
const relativeLength = /^\d+(\.\d+)?(dvh|svh|lvh|vh|dvw|svw|lvw|vw|%)$/;
const layoutUtility =
  /^-?(w|h|min-w|min-h|max-w|max-h|size|inset|inset-x|inset-y|top|right|bottom|left|start|end|translate|translate-x|translate-y|basis)-\[/;
const layoutProperty =
  /^\[(width|height|min-width|min-height|max-width|max-height|inset|top|right|bottom|left|translate|flex-basis):/;

const springOnly =
  /^transition-(transform|\[(transform|translate|scale|rotate)(,(transform|translate|scale|rotate))*\])$/;

/** The utility prefix of each Tailwind theme namespace `tailwindKeys` fills. */
const namespacePrefix: Record<string, string> = {
  radius: 'rounded',
  font: 'font',
  tracking: 'tracking',
  spacing: 'h',
  shadow: 'shadow',
  ease: 'ease',
  leading: 'leading',
  container: 'max-w',
};

/**
 * A variable that a named utility reads, and that utility: `--cc-focus-width`
 * is `outline-focus`, `--cc-badge-radius` is `rounded-badge`. Reading one of
 * these through an arbitrary value (`outline-[length:var(--cc-focus-width)]`)
 * is the long way round, so the lint asks for the name.
 */
export const namedUtility = new Map<string, string>([
  ...Object.entries(tailwindKeys).flatMap(([key, value]) => {
    const v = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
    const ns = key.slice(0, key.indexOf('-'));
    return v ? [[v, `${namespacePrefix[ns] ?? ns}-${key.slice(ns.length + 1)}`] as const] : [];
  }),
  // Each declaration that only reads a variable (outline-focus also sets
  // outline-style, which is not such a read).
  ...Object.entries(tailwindUtilities).flatMap(([name, decls]) =>
    Object.values(decls).flatMap((value) => {
      const v = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
      return v ? [[v, name] as const] : [];
    }),
  ),
]);

/** True when an arbitrary value needs no token by the rules above. */
function layoutValue(u: string, inner: string): boolean {
  // A typed value (`length:85dvh`) or an arbitrary property (`[font:inherit]`);
  // a custom property (`[--cc-radius:50%]`) keeps its name, so it never matches.
  const value = inner.startsWith('--') ? inner : inner.replace(/^[a-z-]+:/, '');
  if (keywordValue.test(value)) return true;
  return relativeLength.test(value) && (layoutUtility.test(u) || layoutProperty.test(u));
}

/** Rule violations in one element's class list (a group of strings); `file` is relative to the repo. */
export function violations(classList: string | string[], file: string, timing = true): string[] {
  const out: string[] = [];
  const list = tokens([classList].flat().join(' '));
  const utilities = list.map(utility);
  for (const t of list) {
    const u = utility(t);
    if (palette.test(u))
      out.push(`${t}: palette colour, use a theme role (bg-primary, text-muted-foreground)`);
    const value = u.match(/-\[(.*)\]$/) ?? u.match(/^\[(.*)\]$/);
    if (
      value &&
      !value[1]!.includes('var(--') &&
      !propertyList.test(u) &&
      !layoutValue(u, value[1]!)
    )
      out.push(`${t}: arbitrary value without a token, use a theme key or [prop:var(--token)]`);
    // A value that only reads a variable a named utility covers; a custom
    // property being set (`[--cc-icon-size:var(--text-sm)]`) is not a read.
    const read =
      value && !value[1]!.startsWith('--')
        ? /^(?:[a-z-]+:)?var\((--[\w-]+)\)$/.exec(value[1]!)?.[1]
        : undefined;
    if (read && namedUtility.has(read))
      out.push(`${t}: reads ${read}, use ${namedUtility.get(read)}`);
    if (/^(duration|delay)-\d+$/.test(u))
      out.push(`${t}: literal duration, use duration-instant|fast|normal|slow`);
    if (/^ease-(linear|in|out|in-out)$/.test(u))
      out.push(`${t}: Tailwind curve, use ease-enter|exit|move|spring`);
    if (/(^|:)dark:/.test(`:${t}`) && noDark.some((p) => file.startsWith(p)))
      out.push(`${t}: dark: in shared code, rely on the theme roles`);
  }
  // transition-none (also under motion-reduce:) stops motion, so it needs no timing.
  const motion = !timing
    ? []
    : utilities.filter((u) => /^transition(-|$)/.test(u) && u !== 'transition-none');
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
    ['mt-[0.4em]', 'arbitrary'],
    ['bg-[rgb(0_0_0)]', 'arbitrary'],
    ['text-[2vw]', 'arbitrary'],
    ['p-[5vw]', 'arbitrary'],
    ['rounded-[50%]', 'arbitrary'],
    ['leading-[150%]', 'arbitrary'],
    ['[font-size:2vw]', 'arbitrary'],
    ['[--cc-radius:50%]', 'arbitrary'],
    ['duration-150 ease-enter transition-colors', 'literal duration'],
    ['transition-colors duration-fast ease-out', 'Tailwind curve'],
    ['transition-colors duration-fast', 'easing token'],
    ['transition-opacity duration-fast ease-spring', 'ease-spring'],
    ['dark:bg-card', 'dark:'],
    ['[color:#fff]', 'arbitrary'],
    ['hover:bg-[color:#fff]', 'arbitrary'],
    ['focus-visible:outline-[length:var(--cc-focus-width)]', 'use outline-focus'],
    ['outline-offset-[var(--cc-focus-offset)]', 'use outline-offset-focus'],
    ['[stroke-width:var(--cc-icon-stroke)]', 'use stroke-icon'],
    ['active:[scale:var(--cc-press-scale)]', 'use scale-press'],
    ['rounded-[var(--cc-badge-radius)]', 'use rounded-badge'],
    ['font-[family-name:var(--cc-badge-font)]', 'use font-badge'],
    ['h-[var(--spacing-control)]', 'use h-control'],
  ])('rejects %s', (s, reason) => {
    expect(violations(s, 'packages/ui/src/lib/X.svelte').join('\n')).toContain(reason);
  });

  it.each([
    'bg-primary text-primary-foreground hover:bg-primary-hover',
    'stroke-icon size-icon outline-focus outline-offset-focus scale-press case-badge',
    '[--cc-icon-size:var(--text-sm)] origin-[var(--bits-popover-content-transform-origin)]',
    'data-[state=open]:bg-accent',
    'transition-colors duration-fast ease-enter',
    'transition-transform duration-slow ease-spring',
    'motion-reduce:transition-none',
    'transition-[background-color,border-color] duration-fast ease-enter',
    'data-[state=open]:[&_svg]:rotate-180',
    'max-h-[85dvh] font-[inherit] w-[50%] [font:inherit] text-[currentcolor] top-[50%] -translate-x-[50%] [max-height:85dvh]',
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
    expect([...new Set(classStrings(src).flatMap(tokens))].sort()).toEqual(
      [
        'bg-blue-500',
        'bg-card',
        'bg-primary',
        'flex',
        'font-bold',
        'font-medium',
        'gap-2',
        'italic',
        'mt-1',
        'p-2',
        'px-4',
        'text-sm',
        'underline',
      ].sort(),
    );
  });

  it('reads ternaries, comparisons, nested templates and slot compounds as code', () => {
    const src = `<script>
  const r = tv({ slots: { root: 'p-2' }, variants: { size: { sm: { root: 'h-8' } } }, compoundVariants: [{ size: 'sm', class: { root: 'gap-1' } }] });
</script>
<a class={cn('x', on ? 'hover:bg-accent [&_svg]:size-4 data-[state=open]:bg-card px-control-x py-control-y' : 'bg-blue-500')}></a>
<a class={href === '/docs/x' ? 'text-primary' : on ? recipe({ size: 'icon-sm' }) : ''}></a>
<a class={\`a \${on ? \`b \${x ? 'bg-red-500' : '}'}\` : ''}\`}></a>`;
    const found = [...new Set(classStrings(src).flatMap(tokens))];
    for (const t of ['bg-blue-500', 'bg-red-500', 'gap-1', 'h-8', 'p-2', 'text-primary'])
      expect(found).toContain(t);
    for (const t of ['/docs/x', 'icon-sm', 'sm']) expect(found).not.toContain(t);
  });

  it('checks each tv() slot as its own class list', () => {
    const ok = `<script>const s = tv({ slots: { track: 'transition-colors duration-fast ease-enter', thumb: 'transition-transform duration-normal ease-spring' } });</script>`;
    expect(classGroups(ok).flatMap((g) => violations(g, 'packages/ui/src/lib/X.svelte'))).toEqual(
      [],
    );
    const bare = `<script>const s = tv({ slots: { track: 'transition-colors', thumb: 'transition-transform duration-normal ease-spring' } });</script>`;
    expect(
      classGroups(bare)
        .flatMap((g) => violations(g, 'packages/ui/src/lib/X.svelte'))
        .join(),
    ).toContain('without a duration token');
  });

  it('follows class={x} to the variable or prop default it reads', () => {
    const src = `<script>let { class: className = 'bg-blue-500' } = $props(); const cls = $derived(on ? 'text-red-500' : 'p-2'); const other = 'not-a-class';</script>
<div class={cn(cls, className)}></div>`;
    const found = classStrings(src).flatMap(tokens);
    for (const t of ['bg-blue-500', 'text-red-500', 'p-2']) expect(found).toContain(t);
    expect(found).not.toContain('not-a-class');
    const split = `<script>const t = 'transition-colors';</script><i class="duration-fast ease-enter {t}"></i>`;
    expect(
      followedStrings(split).flatMap((f) => violations(f, 'packages/ui/src/lib/X.svelte', false)),
    ).toEqual([]);
    const recipe = `<script>let { size = 'icon-sm' } = $props();</script><b class={cn(button({ size }))}></b>`;
    expect(classStrings(recipe)).toEqual([]);
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

  it('reads only variables that something declares', () => {
    // theme.css, Tailwind's own theme and internals, bits-ui, the playground's
    // own --pg-* globals and properties a file declares itself.
    const require = createRequire(import.meta.url);
    const tw = dirname(require.resolve('tailwindcss/package.json'));
    const declaredIn = (css: string) => [...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]!);
    const playgroundCss = join(root, 'apps/playground/src/lib/playground.css');
    const declared = new Set([
      ...declaredIn(tailwindThemeCss()),
      ...declaredIn(readFileSync(join(tw, 'theme.css'), 'utf8')),
      ...declaredIn(readFileSync(playgroundCss, 'utf8')),
    ]);
    const allowed = (name: string) => declared.has(name) || /^--(tw-|bits-)/.test(name);
    const unknown = files.flatMap((file) => {
      const source = readFileSync(file, 'utf8');
      const own = new Set(declaredIn(source));
      return (
        [...source.matchAll(/var\((--[\w-]+)/g)]
          .map((m) => m[1]!)
          // A name built at run time (`var(--radius-${size})`) ends in `-`: not checkable here.
          .filter((name) => !name.endsWith('-') && !allowed(name) && !own.has(name))
          .map((name) => `${relative(root, file)}: ${name}`)
      );
    });
    expect(unknown).toEqual([]);
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
      const source = readFileSync(file, 'utf8');
      const groups = classGroups(source);
      const strings = groups.flat();
      const found = [
        ...groups.flatMap((g) => violations(g, name)),
        ...followedStrings(source).flatMap((f) => violations(f, name, false)),
      ];
      const unknown = strings
        .flatMap(tokens)
        .filter((t) => !hook(t) && /[-:[/]/.test(t) && !known(t))
        .map((t) => `${t}: not a Tailwind or theme class`);
      expect([...found, ...unknown]).toEqual([]);
    });
  }
});
