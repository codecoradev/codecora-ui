// What the playground shows, shared by the overview and the Components page.

import type { ThemeName } from '@codecora/tokens';

/** One section of the Components page and the components it demonstrates. */
export interface CatalogueSection {
  id: string;
  title: string;
  components: string[];
}

export interface CatalogueGroup {
  group: string;
  sections: CatalogueSection[];
}

/** The Components page, grouped like the README. AppShell and Sidebar live on the dashboard. */
export const catalogue: CatalogueGroup[] = [
  {
    group: 'Actions',
    sections: [
      {
        id: 'c-buttons',
        title: 'Buttons',
        components: ['Button', 'IconButton', 'Tooltip', 'Spinner'],
      },
    ],
  },
  {
    group: 'Forms',
    sections: [
      { id: 'c-forms', title: 'Form fields', components: ['Field', 'Input', 'Textarea', 'Select'] },
      { id: 'c-choice', title: 'Choices', components: ['Checkbox', 'Switch', 'RadioGroup'] },
      {
        id: 'c-inputs',
        title: 'Rich inputs',
        components: ['Combobox', 'Slider', 'FieldGroup'],
      },
    ],
  },
  {
    group: 'Overlays',
    sections: [
      {
        id: 'c-overlays',
        title: 'Dialogs and toasts',
        components: ['Dialog', 'ConfirmDialog', 'Sheet', 'Toast'],
      },
    ],
  },
  {
    group: 'Navigation',
    sections: [
      {
        id: 'c-nav',
        title: 'Menus and disclosure',
        components: [
          'Breadcrumb',
          'Accordion',
          'ToggleGroup',
          'Pagination',
          'Popover',
          'DropdownMenu',
          'CommandPalette',
        ],
      },
      { id: 'c-tabs', title: 'Tabs and Table', components: ['Tabs', 'Table'] },
    ],
  },
  {
    group: 'Data display',
    sections: [
      { id: 'c-datatable', title: 'DataTable', components: ['DataTable'] },
      {
        id: 'c-display',
        title: 'Cards and content',
        components: [
          'Card',
          'Alert',
          'Avatar',
          'Progress',
          'Separator',
          'Kbd',
          'Link',
          'CodeBlock',
        ],
      },
    ],
  },
  {
    group: 'Feedback',
    sections: [
      { id: 'c-status', title: 'Status', components: ['Badge', 'Skeleton', 'EmptyState'] },
    ],
  },
];

/** Each theme's North Star, from its file in docs/design. */
export const northStars: Record<ThemeName, string> = {
  neutral: 'The Plain Workbench',
  uteke: 'The Field Notebook',
  corin: 'The Night Console',
  'neutral-dark': 'The Plain Workbench after dark',
  'uteke-dark': 'The Field Notebook by lamplight',
  sepia: 'The Reading Room',
  contrast: 'High Beam',
  dimmed: 'Low Light',
  slab: 'The Proof Sheet',
  soft: 'The Pebble',
  'neutral-cvd': 'The Plain Workbench, colour-blind safe',
};

export const repoUrl = 'https://github.com/codecoradev/codecora-ui';
