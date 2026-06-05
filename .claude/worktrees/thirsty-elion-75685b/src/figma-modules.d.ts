// Vite plugin in vite.config.ts rewrites `figma:asset/<filename>` imports to
// `/src/assets/<filename>`. TS doesn't see that, so declare the module
// shape here.
declare module 'figma:asset/*' {
  const src: string;
  export default src;
}
