import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import type { PageLoad } from './$types';

/**
 * /themes has no page of its own: the theme index is the "Theme pages" section
 * on /tokens, which the nav and the theme pages' breadcrumb already point at.
 * Prerendered, the redirect becomes a page with a meta refresh, so it works on
 * GitHub Pages without a server or JavaScript. The folder themes/ also holds
 * the theme pages, so the redirect is written as themes/index.html: GitHub
 * Pages answers /themes with /themes/, and the relative URL holds from there.
 */
export const trailingSlash = 'always';

export const load: PageLoad = () => {
  redirect(308, `${resolve('/tokens')}#index-title`);
};
