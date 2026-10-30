import { render } from '@testing-library/svelte';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import Favicons from './Favicons.svelte';
import Mark from './Mark.svelte';
import { marks, productNames } from './marks.js';

const assets = join(process.cwd(), 'src/lib/assets');
const onDisk = (name: string, file: string) => join(assets, name, file);
const pngSize = (file: string) => {
  const b = readFileSync(file);
  expect(b.subarray(1, 4).toString()).toBe('PNG');
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};

// Bundlers inline small assets as data: URIs, so URLs are checked by shape and
// the files themselves are read from disk.
const FILES = {
  png16: 'favicon-16.png',
  png32: 'favicon-32.png',
  png48: 'favicon-48.png',
  appleTouch: 'apple-touch-icon.png',
  icon192: 'icon-192.png',
  icon512: 'icon-512.png',
  ico: 'favicon.ico',
  svg: 'favicon.svg',
} as const;

describe('marks manifest', () => {
  it('has a mark for every product, each URL a string pointing at its file', () => {
    expect(productNames).toEqual(['uteke', 'corin', 'gatehouse']);
    for (const name of productNames) {
      const { mark, favicons } = marks[name];
      for (const href of [mark, ...Object.values(favicons)]) {
        expect(typeof href).toBe('string');
        expect(href.startsWith('data:') || href.includes('/assets/')).toBe(true);
      }
    }
  });

  it('every file the manifest names exists on disk', () => {
    for (const name of productNames) {
      const set = marks[name].favicons;
      expect(existsSync(onDisk(name, marks[name].kind === 'svg' ? 'mark.svg' : 'mark.png'))).toBe(
        true,
      );
      for (const key of Object.keys(set) as (keyof typeof FILES)[]) {
        const file = key === 'svg' && name === 'gatehouse' ? 'mark.svg' : FILES[key];
        expect(existsSync(onDisk(name, file)), `${name}/${file}`).toBe(true);
      }
    }
  });

  it('vector marks are SVG with a viewBox and no raster inside', () => {
    for (const name of productNames) {
      if (marks[name].kind !== 'svg') continue;
      const svg = readFileSync(onDisk(name, 'mark.svg'), 'utf8');
      expect(svg).toMatch(/<svg[^>]*viewBox="0 0 \d+ \d+"/);
      expect(svg).not.toMatch(/<image\b|data:image/);
    }
  });

  it('raster marks are never scaled past their master', () => {
    expect(pngSize(onDisk('corin', 'mark.png'))).toEqual([256, 256]);
    expect(marks.corin.favicons.icon512).toBeUndefined();
  });

  it('PNG favicons have the sizes their names promise', () => {
    for (const name of productNames) {
      expect(pngSize(onDisk(name, FILES.png16))).toEqual([16, 16]);
      expect(pngSize(onDisk(name, FILES.png32))).toEqual([32, 32]);
      expect(pngSize(onDisk(name, FILES.png48))).toEqual([48, 48]);
      expect(pngSize(onDisk(name, FILES.appleTouch))).toEqual([180, 180]);
      expect(pngSize(onDisk(name, FILES.icon192))).toEqual([192, 192]);
      if (marks[name].favicons.icon512)
        expect(pngSize(onDisk(name, FILES.icon512))).toEqual([512, 512]);
    }
  });

  it('ICO files hold the 16, 32 and 48 px images', () => {
    for (const name of productNames) {
      const b = readFileSync(onDisk(name, FILES.ico));
      expect(b.readUInt16LE(2)).toBe(1);
      expect(b.readUInt16LE(4)).toBe(3);
      expect([0, 1, 2].map((i) => b[6 + i * 16])).toEqual([16, 32, 48]);
    }
  });
});

describe('Mark', () => {
  it('is decorative without a label', () => {
    const { container } = render(Mark, { product: 'uteke' });
    const img = container.querySelector('img')!;
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('src', marks.uteke.mark);
  });

  it('has a name and size when asked', () => {
    const { getByRole } = render(Mark, { product: 'corin', label: 'Corin', size: 48 });
    const img = getByRole('img', { name: 'Corin' });
    expect(img).toHaveAttribute('width', '48');
    expect(img).toHaveAttribute('height', '48');
  });
});

describe('Favicons', () => {
  it('adds the set to the document head, with SVG only for vector marks', () => {
    const a = render(Favicons, { product: 'uteke' });
    expect(document.head.querySelector('link[type="image/svg+xml"]')).not.toBeNull();
    expect(document.head.querySelector('link[rel="apple-touch-icon"]')).toHaveAttribute(
      'href',
      marks.uteke.favicons.appleTouch,
    );
    a.unmount();
    render(Favicons, { product: 'corin' });
    expect(document.head.querySelector('link[type="image/svg+xml"]')).toBeNull();
    expect(document.head.querySelector('link[rel="icon"][sizes="32x32"]')).toHaveAttribute(
      'href',
      marks.corin.favicons.png32,
    );
  });
});
