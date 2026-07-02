import React from 'react';
import { MemoryRouter } from 'react-router';
import { withThemeByClassName } from '@storybook/addon-themes';
import '../src/styles/index.css';

const FIGMA_FILE_URL =
  'https://www.figma.com/design/oGbyq96g9IQCvH6oTUgn7o/Reglantern?node-id=0-1';

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app',         value: '#f9fafb' },
        { name: 'app (dark)',  value: '#111318' },
        { name: 'sidebar',     value: '#f4f4f5' },
        { name: 'sidebar (dark)', value: '#1c1f26' },
        { name: 'header',      value: '#32383e' },
        { name: 'white',       value: '#ffffff' },
      ],
    },
    a11y: { test: 'todo' },
    design: {
      type: 'figma',
      url: FIGMA_FILE_URL,
    },
  },
  decorators: [
    // Dark mode: toggles `.dark` on the <html> element, which is what
    // the app uses (Tailwind `dark:` variant via `@custom-variant dark`).
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;
