/// <reference types="vite/client" />
import corinAppleTouchIconPng from './assets/corin/apple-touch-icon.png?url';
import corinFavicon16Png from './assets/corin/favicon-16.png?url';
import corinFavicon32Png from './assets/corin/favicon-32.png?url';
import corinFavicon48Png from './assets/corin/favicon-48.png?url';
import corinFaviconIco from './assets/corin/favicon.ico?url';
import corinIcon192Png from './assets/corin/icon-192.png?url';
import corinMarkPng from './assets/corin/mark.png?url';
import gatehouseAppleTouchIconPng from './assets/gatehouse/apple-touch-icon.png?url';
import gatehouseFavicon16Png from './assets/gatehouse/favicon-16.png?url';
import gatehouseFavicon32Png from './assets/gatehouse/favicon-32.png?url';
import gatehouseFavicon48Png from './assets/gatehouse/favicon-48.png?url';
import gatehouseFaviconIco from './assets/gatehouse/favicon.ico?url';
import gatehouseIcon192Png from './assets/gatehouse/icon-192.png?url';
import gatehouseIcon512Png from './assets/gatehouse/icon-512.png?url';
import gatehouseMarkSvg from './assets/gatehouse/mark.svg?url';
import utekeAppleTouchIconPng from './assets/uteke/apple-touch-icon.png?url';
import utekeFavicon16Png from './assets/uteke/favicon-16.png?url';
import utekeFavicon32Png from './assets/uteke/favicon-32.png?url';
import utekeFavicon48Png from './assets/uteke/favicon-48.png?url';
import utekeFaviconIco from './assets/uteke/favicon.ico?url';
import utekeFaviconSvg from './assets/uteke/favicon.svg?url';
import utekeIcon192Png from './assets/uteke/icon-192.png?url';
import utekeIcon512Png from './assets/uteke/icon-512.png?url';
import utekeMarkSvg from './assets/uteke/mark.svg?url';

/** Products that have a mark in this package. */
export type ProductName = 'uteke' | 'corin' | 'gatehouse';

export interface FaviconSet {
  /** SVG favicon for browsers that support it; absent when the artwork is raster only. */
  svg?: string;
  ico: string;
  png16: string;
  png32: string;
  png48: string;
  /** 180 px, for iOS home screens. */
  appleTouch: string;
  /** 192 px, for Android and web app manifests. */
  icon192: string;
  /** 512 px; only where the artwork is vector. */
  icon512?: string;
}

export interface ProductMark {
  name: ProductName;
  label: string;
  /** The artwork on a transparent background. */
  mark: string;
  /** "svg" is a vector master; "png" is a raster master (see the README). */
  kind: 'svg' | 'png';
  /** Pixel size of a raster master, or undefined for vector. */
  rasterSize?: number;
  favicons: FaviconSet;
}

// Vite asset imports: the bundler emits each file with a hashed name (or inlines a
// small one as a data URI) and the same URL works in SSR and in the browser.
export const marks: Record<ProductName, ProductMark> = {
  uteke: {
    name: 'uteke',
    label: 'Uteke',
    mark: utekeMarkSvg,
    kind: 'svg',
    favicons: {
      svg: utekeFaviconSvg,
      ico: utekeFaviconIco,
      png16: utekeFavicon16Png,
      png32: utekeFavicon32Png,
      png48: utekeFavicon48Png,
      appleTouch: utekeAppleTouchIconPng,
      icon192: utekeIcon192Png,
      icon512: utekeIcon512Png,
    },
  },
  corin: {
    name: 'corin',
    label: 'Corin',
    mark: corinMarkPng,
    kind: 'png',
    rasterSize: 256,
    favicons: {
      ico: corinFaviconIco,
      png16: corinFavicon16Png,
      png32: corinFavicon32Png,
      png48: corinFavicon48Png,
      appleTouch: corinAppleTouchIconPng,
      icon192: corinIcon192Png,
    },
  },
  gatehouse: {
    name: 'gatehouse',
    label: 'Gatehouse',
    mark: gatehouseMarkSvg,
    kind: 'svg',
    favicons: {
      svg: gatehouseMarkSvg,
      ico: gatehouseFaviconIco,
      png16: gatehouseFavicon16Png,
      png32: gatehouseFavicon32Png,
      png48: gatehouseFavicon48Png,
      appleTouch: gatehouseAppleTouchIconPng,
      icon192: gatehouseIcon192Png,
      icon512: gatehouseIcon512Png,
    },
  },
};

export const productNames = Object.keys(marks) as ProductName[];
