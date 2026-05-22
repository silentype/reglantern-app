import React from 'react';
import { MemoryRouter } from 'react-router';
import '../src/styles/index.css';

// Source-of-truth Figma file: the Reglantern shadcn-style design kit (the
// file the design-system primitives are authored in). Every story shows
// this in the "Design" tab by default; individual stories override with a
// deep link to a specific frame by adding
//   parameters: { design: { type: 'figma', url: '...?node-id=X' } }
// Grab a frame URL by right-clicking the frame in Figma -> Copy/paste as ->
// Copy link to selection. Strip the trailing &t=... session token before pasting.
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
        { name: 'app', value: '#f9fafb' },
        { name: 'sidebar', value: '#f4f4f5' },
        { name: 'header', value: '#32383e' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    a11y: { test: 'todo' },
    design: {
      type: 'figma',
      url: FIGMA_FILE_URL,
    },
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
