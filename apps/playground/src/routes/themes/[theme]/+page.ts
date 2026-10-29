import { error } from '@sveltejs/kit';
import { themeNames, type ThemeName } from '@codecora/tokens';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => themeNames.map((theme) => ({ theme }));

export const load: PageLoad = ({ params }) => {
  if (!themeNames.includes(params.theme as ThemeName)) error(404, 'Unknown theme');
  return { theme: params.theme as ThemeName };
};
