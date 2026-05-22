// Reglantern Tokens — Figma Plugin
// Creates native Variable collections from the design token definitions.

const TOKENS = {
  core: {
    "color/zinc/50":  { type: "COLOR", value: "#fafafa" },
    "color/zinc/100": { type: "COLOR", value: "#f4f4f5" },
    "color/zinc/200": { type: "COLOR", value: "#e4e4e7" },
    "color/zinc/300": { type: "COLOR", value: "#d4d4d8" },
    "color/zinc/400": { type: "COLOR", value: "#a1a1aa" },
    "color/zinc/500": { type: "COLOR", value: "#71717a" },
    "color/zinc/600": { type: "COLOR", value: "#52525b" },
    "color/zinc/700": { type: "COLOR", value: "#3f3f46" },
    "color/zinc/800": { type: "COLOR", value: "#27272a" },
    "color/zinc/900": { type: "COLOR", value: "#18181b" },
    "color/zinc/950": { type: "COLOR", value: "#09090b" },
    "color/yellow/300": { type: "COLOR", value: "#ffcc66" },
    "color/yellow/400": { type: "COLOR", value: "#ffcc77" },
    "color/yellow/500": { type: "COLOR", value: "#eab308" },
    "color/yellow/600": { type: "COLOR", value: "#ca8a04" },
    "color/green/600":  { type: "COLOR", value: "#16a34a" },
    "color/red/600":    { type: "COLOR", value: "#dc2626" },
    "color/blue/500":   { type: "COLOR", value: "#3b82f6" },
    "color/purple/600": { type: "COLOR", value: "#8745ae" },
    "color/slate/200":  { type: "COLOR", value: "#cdd7e1" },
    "color/slate/700":  { type: "COLOR", value: "#47515b" },
    "color/slate/800":  { type: "COLOR", value: "#32383e" },
    "radius/sm": { type: "FLOAT", value: 6 },
    "radius/md": { type: "FLOAT", value: 8 },
    "radius/lg": { type: "FLOAT", value: 10 },
    "radius/xl": { type: "FLOAT", value: 14 },
    "fontWeight/normal":   { type: "FLOAT", value: 400 },
    "fontWeight/medium":   { type: "FLOAT", value: 500 },
    "fontWeight/semibold": { type: "FLOAT", value: 600 },
    "fontWeight/bold":     { type: "FLOAT", value: 700 },
    "fontSize/xs":   { type: "FLOAT", value: 12 },
    "fontSize/sm":   { type: "FLOAT", value: 14 },
    "fontSize/base": { type: "FLOAT", value: 16 },
    "fontSize/lg":   { type: "FLOAT", value: 18 },
    "fontSize/xl":   { type: "FLOAT", value: 20 },
    "fontSize/2xl":  { type: "FLOAT", value: 24 },
    "fontSize/3xl":  { type: "FLOAT", value: 30 },
    "spacing/1":  { type: "FLOAT", value: 4 },
    "spacing/2":  { type: "FLOAT", value: 8 },
    "spacing/3":  { type: "FLOAT", value: 12 },
    "spacing/4":  { type: "FLOAT", value: 16 },
    "spacing/5":  { type: "FLOAT", value: 20 },
    "spacing/6":  { type: "FLOAT", value: 24 },
    "spacing/8":  { type: "FLOAT", value: 32 },
    "spacing/10": { type: "FLOAT", value: 40 },
    "spacing/12": { type: "FLOAT", value: 48 },
    "spacing/16": { type: "FLOAT", value: 64 },
  },
  semantic: {
    "brand/primary":        { type: "COLOR", value: "#ffcc66" },
    "brand/primaryHover":   { type: "COLOR", value: "#eab308" },
    "brand/primaryActive":  { type: "COLOR", value: "#ca8a04" },
    "brand/header":         { type: "COLOR", value: "#32383e" },
    "brand/headerSelected": { type: "COLOR", value: "#47515b" },
    "text/primary":         { type: "COLOR", value: "#18181b" },
    "text/secondary":       { type: "COLOR", value: "#71717a" },
    "text/muted":           { type: "COLOR", value: "#9ca3af" },
    "text/onBrand":         { type: "COLOR", value: "#18181b" },
    "text/onDark":          { type: "COLOR", value: "#ffffff" },
    "surface/page":         { type: "COLOR", value: "#f9fafb" },
    "surface/sidebar":      { type: "COLOR", value: "#f4f4f5" },
    "surface/card":         { type: "COLOR", value: "#ffffff" },
    "surface/hover":        { type: "COLOR", value: "#f5f5f5" },
    "surface/input":        { type: "COLOR", value: "#f3f3f5" },
    "surface/muted":        { type: "COLOR", value: "#ececf0" },
    "border/default":       { type: "COLOR", value: "#e4e4e7" },
    "border/strong":        { type: "COLOR", value: "#cdd7e1" },
    "border/focus":         { type: "COLOR", value: "#ffcc66" },
    "border/subtle":        { type: "COLOR", value: "#d4d4d8" },
    "status/success":        { type: "COLOR", value: "#16a34a" },
    "status/successSurface": { type: "COLOR", value: "#dcfce7" },
    "status/danger":         { type: "COLOR", value: "#dc2626" },
    "status/dangerSurface":  { type: "COLOR", value: "#fee2e2" },
    "status/info":           { type: "COLOR", value: "#3b82f6" },
    "status/infoSurface":    { type: "COLOR", value: "#dbeafe" },
    "status/purple":         { type: "COLOR", value: "#8745ae" },
    "status/purpleSurface":  { type: "COLOR", value: "#f3e8ff" },
    "radius/component": { type: "FLOAT", value: 8 },
    "radius/card":      { type: "FLOAT", value: 10 },
    "radius/input":     { type: "FLOAT", value: 8 },
    "radius/pill":      { type: "FLOAT", value: 999 },
    "spacing/pagePaddingX":      { type: "FLOAT", value: 24 },
    "spacing/pagePaddingTop":    { type: "FLOAT", value: 22 },
    "spacing/pagePaddingBottom": { type: "FLOAT", value: 16 },
  },
  component: {
    "button/primary/bg":         { type: "COLOR", value: "#ffcc66" },
    "button/primary/bgHover":    { type: "COLOR", value: "#eab308" },
    "button/primary/text":       { type: "COLOR", value: "#18181b" },
    "button/primary/radius":     { type: "FLOAT", value: 8 },
    "button/primary/paddingX":   { type: "FLOAT", value: 16 },
    "button/primary/paddingY":   { type: "FLOAT", value: 8 },
    "button/primary/fontSize":   { type: "FLOAT", value: 14 },
    "button/primary/fontWeight": { type: "FLOAT", value: 500 },
    "button/secondary/bg":       { type: "COLOR", value: "#ffffff" },
    "button/secondary/border":   { type: "COLOR", value: "#e4e4e7" },
    "button/secondary/text":     { type: "COLOR", value: "#18181b" },
    "button/secondary/radius":   { type: "FLOAT", value: 8 },
    "button/secondary/paddingX": { type: "FLOAT", value: 16 },
    "button/secondary/paddingY": { type: "FLOAT", value: 8 },
    "button/danger/bg":          { type: "COLOR", value: "#dc2626" },
    "button/danger/text":        { type: "COLOR", value: "#ffffff" },
    "button/danger/radius":      { type: "FLOAT", value: 8 },
    "card/bg":          { type: "COLOR", value: "#ffffff" },
    "card/border":      { type: "COLOR", value: "#e4e4e7" },
    "card/borderHover": { type: "COLOR", value: "#ffcc66" },
    "card/radius":      { type: "FLOAT", value: 10 },
    "card/padding":     { type: "FLOAT", value: 20 },
    "nav/topbar/bg":             { type: "COLOR", value: "#32383e" },
    "nav/topbar/height":         { type: "FLOAT", value: 80 },
    "nav/topbar/itemText":       { type: "COLOR", value: "#ffffff" },
    "nav/topbar/itemTextActive": { type: "COLOR", value: "#ffcc66" },
    "nav/sidebar/bg":             { type: "COLOR", value: "#f4f4f5" },
    "nav/sidebar/widthOpen":      { type: "FLOAT", value: 280 },
    "nav/sidebar/widthCollapsed": { type: "FLOAT", value: 66 },
    "nav/sidebar/itemSelected":   { type: "COLOR", value: "#cdd7e1" },
    "nav/sidebar/itemHover":      { type: "COLOR", value: "#e4e4e7" },
    "nav/sidebar/itemHeight":     { type: "FLOAT", value: 40 },
    "nav/sidebar/itemRadius":     { type: "FLOAT", value: 6 },
    "badge/radius":     { type: "FLOAT", value: 999 },
    "badge/paddingX":   { type: "FLOAT", value: 12 },
    "badge/paddingY":   { type: "FLOAT", value: 4 },
    "badge/fontSize":   { type: "FLOAT", value: 12 },
    "badge/fontWeight": { type: "FLOAT", value: 500 },
    "input/bg":          { type: "COLOR", value: "#f3f3f5" },
    "input/border":      { type: "COLOR", value: "#e4e4e7" },
    "input/borderFocus": { type: "COLOR", value: "#ffcc66" },
    "input/text":        { type: "COLOR", value: "#18181b" },
    "input/placeholder": { type: "COLOR", value: "#9ca3af" },
    "input/radius":      { type: "FLOAT", value: 8 },
    "input/height":      { type: "FLOAT", value: 36 },
    "pageHeader/paddingX":      { type: "FLOAT", value: 24 },
    "pageHeader/paddingTop":    { type: "FLOAT", value: 22 },
    "pageHeader/paddingBottom": { type: "FLOAT", value: 16 },
    "pageHeader/borderColor":   { type: "COLOR", value: "#e4e4e7" },
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: 1,
  };
}

const COLLECTION_NAMES = {
  core:      '🎨 Core',
  semantic:  '🔤 Semantic',
  component: '🧩 Component',
};

// ─── Main ─────────────────────────────────────────────────────────────────────

figma.showUI(__html__, { width: 320, height: 280 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create') {
    try {
      let total = 0;

      for (const [setKey, tokenMap] of Object.entries(TOKENS)) {
        const collection = figma.variables.createVariableCollection(COLLECTION_NAMES[setKey]);
        const modeId     = collection.defaultModeId;
        collection.renameMode(modeId, 'Default');

        for (const [name, { type, value }] of Object.entries(tokenMap)) {
          const variable = figma.variables.createVariable(name, collection, type);
          const figmaVal = type === 'COLOR' ? hexToRgb(value) : value;
          variable.setValueForMode(modeId, figmaVal);
          total++;
        }
      }

      figma.ui.postMessage({ type: 'done', message: `✅ ${total} variables created across 3 collections!` });
    } catch (err) {
      figma.ui.postMessage({ type: 'error', message: `❌ ${err.message}` });
    }
  }

  if (msg.type === 'clean-styles') {
    try {
      const paint  = figma.getLocalPaintStyles();
      const text   = figma.getLocalTextStyles();
      const effect = figma.getLocalEffectStyles();
      const grid   = figma.getLocalGridStyles();

      [...paint, ...text, ...effect, ...grid].forEach(s => s.remove());

      const total = paint.length + text.length + effect.length + grid.length;
      figma.ui.postMessage({ type: 'done', message: `✅ ${total} styles deleted.` });
    } catch (err) {
      figma.ui.postMessage({ type: 'error', message: `❌ ${err.message}` });
    }
  }
};
