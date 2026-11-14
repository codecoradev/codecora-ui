// @vitest-environment node
// Class lint (D13, #159): the DESIGN.md rules, checked on Tailwind class
// strings in every file already written with utilities (a .svelte file
// without a <style> block, and its tv()/cn() calls). Files still on plain CSS
// are covered by usage.test.ts until they migrate.
import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative } from 'node:path';
import { parse } from 'svelte/compiler';
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
    case 'ChainExpression':
    case 'TSAsExpression':
    case 'TSNonNullExpression':
      return classLiterals(n.expression);
    default:
      return [];
  }
}

/** Classes in a tv() config: base, slots, variant values, compound class/className. */
function tvLiterals(config: unknown): string[] {
  if (!isNode(config) || config.type !== 'ObjectExpression') return [];
  const values = (obj: unknown): unknown[] =>
    isNode(obj) && obj.type === 'ObjectExpression'
      ? (obj.properties as Node[]).filter((p) => p.type === 'Property').map((p) => p.value)
      : [obj];
  const slotValues = (v: unknown) => values(v).flatMap(classLiterals);
  return (config.properties as Node[]).flatMap((p) => {
    if (p.type !== 'Property') return [];
    switch (keyName(p)) {
      case 'base':
        return classLiterals(p.value);
      case 'slots':
        return slotValues(p.value);
      case 'variants':
        return values(p.value).flatMap((variant) => values(variant).flatMap(slotValues));
      case 'compoundVariants':
      case 'compoundSlots':
        return isNode(p.value) && p.value.type === 'ArrayExpression'
          ? (p.value.elements as unknown[]).flatMap((entry) =>
              isNode(entry) && entry.type === 'ObjectExpression'
                ? (entry.properties as Node[])
                    .filter(
                      (q) =>
                        q.type === 'Property' && ['class', 'className'].includes(keyName(q) ?? ''),
                    )
                    .flatMap((q) => slotValues(q.value))
                : [],
            )
          : [];
      default:
        return []; // defaultVariants, extend, …: names and options, not classes
    }
  });
}

/**
 * Class expressions: each `class` attribute (static text plus its `{…}`
 * parts, or `class={…}`), each `class:name` directive, each cn()/clsx() call
 * and each tv() config. One group is one class list, so the transition rule
 * sees `cn('transition-colors', 'duration-fast ease-enter')` as a whole.
 */
export function classGroups(source: string): string[][] {
  const ast = parse(source, { modern: true }) as unknown as Node;
  const groups: string[][] = [];
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
      return;
    }
    if (n.type === 'ClassDirective') groups.push([n.name as string]);
    if (n.type === 'CallExpression' && isClassCall(n)) {
      groups.push((n.arguments as unknown[]).flatMap(classLiterals));
      return;
    }
    if (
      n.type === 'CallExpression' &&
      (n.callee as Node).type === 'Identifier' &&
      (n.callee as Node).name === 'tv'
    ) {
      groups.push(tvLiterals((n.arguments as unknown[])[0]));
      return;
    }
    for (const [k, v] of Object.entries(n)) if (!SKIP.has(k)) walk(v);
  };
  walk(ast);
  return groups.map((g) => g.filter((s) => s.trim() !== '')).filter((g) => g.length > 0);
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
