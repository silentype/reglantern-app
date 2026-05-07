import React from 'react';
import { MemoryRouter } from 'react-router';
import '../src/styles/index.css';

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
        { name: 'app', value: '#f9fafb' },
        { name: 'sidebar', value: '#f4f4f5' },
        { name: 'header', value: '#32383e' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    a11y: { test: 'todo' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;
