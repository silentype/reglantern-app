// Reglantern Tokens — Figma Plugin
// Creates native Variable collections from the design token definitions.

const TOKENS = {
  core: {
    "brand/yellow": { type: "COLOR", value: "#fc6" },
    "brand/yellowHover": { type: "COLOR", value: "#eab308" },
    "brand/yellowActive": { type: "COLOR", value: "#ca8a04" },
    "text/primary": { type: "COLOR", value: "#18181b" },
    "text/primaryDark": { type: "COLOR", value: "#f4f4f5" },
    "text/secondaryMuted": { type: "COLOR", value: "#6b7280" },
    "text/secondaryMutedDark": { type: "COLOR", value: "#a1a1aa" },
    "text/mutedLighter": { type: "COLOR", value: "#9ca3af" },
    "text/greyMockDoc": { type: "COLOR", value: "#404040" },
    "text/topNavInactive": { type: "COLOR", value: "#b8bcc2" },
    "border/default": { type: "COLOR", value: "#e4e4e7" },
    "border/defaultDark": { type: "COLOR", value: "#2a2f3a" },
    "border/strong": { type: "COLOR", value: "#cdd7e1" },
    "border/strongHoverDark": { type: "COLOR", value: "#3a4455" },
    "border/defaultHover": { type: "COLOR", value: "#d4d4d8" },
    "border/defaultHoverDark": { type: "COLOR", value: "#3f4756" },
    "border/topNavDropdown": { type: "COLOR", value: "#3d444b" },
    "border/selectedGray": { type: "COLOR", value: "#47515b" },
    "border/selectedGrayDark": { type: "COLOR", value: "#5a7a9a" },
    "surface/page": { type: "COLOR", value: "#f9fafb" },
    "surface/pageDark": { type: "COLOR", value: "#111318" },
    "surface/sidebar": { type: "COLOR", value: "#f4f4f5" },
    "surface/sidebarDark": { type: "COLOR", value: "#1c1f26" },
    "surface/elevatedCardDark": { type: "COLOR", value: "#1e2129" },
    "surface/headerDark": { type: "COLOR", value: "#32383e" },
    "surface/topNavDropdownDark": { type: "COLOR", value: "#232a30" },
    "surface/selectedNavDark": { type: "COLOR", value: "#2a3a4a" },
    "surface/successTintDark": { type: "COLOR", value: "#2a3a2a" },
    "surface/white": { type: "COLOR", value: "#ffffff" },
    "status/danger": { type: "COLOR", value: "#dc2626" },
    "status/dangerTextOnTint": { type: "COLOR", value: "#b91c1c" },
    "status/dangerActive": { type: "COLOR", value: "#991b1b" },
    "status/dangerBgTint": { type: "COLOR", value: "#fef2f2" },
    "status/dangerBgTintDark": { type: "COLOR", value: "#2d1010" },
    "status/dangerBorderTint": { type: "COLOR", value: "#fecaca" },
    "status/dangerBorderTintDark": { type: "COLOR", value: "#7f1d1d" },
    "status/success": { type: "COLOR", value: "#16a34a" },
    "status/infoLink": { type: "COLOR", value: "#3b82f6" },
    "status/purple": { type: "COLOR", value: "#8745ae" },
    "status/paleYellowHighlight": { type: "COLOR", value: "#fffbe5" },
    "pill/neutralBg": { type: "COLOR", value: "#f4f4f5" },
    "pill/neutralText": { type: "COLOR", value: "#18181b" },
    "pill/yellowBg": { type: "COLOR", value: "#fef3c7" },
    "pill/yellowText": { type: "COLOR", value: "#92400e" },
    "pill/greenBg": { type: "COLOR", value: "#dcfce7" },
    "pill/greenText": { type: "COLOR", value: "#166534" },
    "pill/blueBg": { type: "COLOR", value: "#dbeafe" },
    "pill/blueText": { type: "COLOR", value: "#1e40af" },
    "pill/redBg": { type: "COLOR", value: "#fee2e2" },
    "pill/redText": { type: "COLOR", value: "#b91c1c" },
    "pill/purpleBg": { type: "COLOR", value: "#ede9fe" },
    "pill/purpleText": { type: "COLOR", value: "#7c3aed" },
    "categoryTag/clinicalBg": { type: "COLOR", value: "#dbeafe" },
    "categoryTag/clinicalText": { type: "COLOR", value: "#1e40af" },
    "categoryTag/fiscalBg": { type: "COLOR", value: "#fecdd3" },
    "categoryTag/fiscalText": { type: "COLOR", value: "#b91c1c" },
    "categoryTag/governanceBg": { type: "COLOR", value: "#d1fae5" },
    "categoryTag/governanceText": { type: "COLOR", value: "#065f46" },
    "categoryTag/complianceBg": { type: "COLOR", value: "#fef3c7" },
    "categoryTag/complianceText": { type: "COLOR", value: "#92400e" },
    "categoryTag/operationalBg": { type: "COLOR", value: "#f3e8ff" },
    "categoryTag/operationalText": { type: "COLOR", value: "#6b21a8" },
    "categoryTag/fallbackBg": { type: "COLOR", value: "#f3f4f6" },
    "categoryTag/fallbackText": { type: "COLOR", value: "#6b7280" },
    "avatar/1": { type: "COLOR", value: "#fde68a" },
    "avatar/2": { type: "COLOR", value: "#fecaca" },
    "avatar/3": { type: "COLOR", value: "#bfdbfe" },
    "avatar/4": { type: "COLOR", value: "#bbf7d0" },
    "avatar/5": { type: "COLOR", value: "#fbcfe8" },
    "avatar/6": { type: "COLOR", value: "#ddd6fe" },
    "avatar/7": { type: "COLOR", value: "#fed7aa" },
    "avatar/8": { type: "COLOR", value: "#a5f3fc" },
    "avatar/9": { type: "COLOR", value: "#e9d5ff" },
    "avatar/10": { type: "COLOR", value: "#fef9c3" },
    "gradient/greyStart": { type: "COLOR", value: "#f0f0f0" },
    "gradient/greyEnd": { type: "COLOR", value: "#e0e0e0" },
    "gradient/blueStart": { type: "COLOR", value: "#e8f4f8" },
    "gradient/blueEnd": { type: "COLOR", value: "#d0e8f0" },
    "radius/sm": { type: "FLOAT", value: 6 },
    "radius/md": { type: "FLOAT", value: 8 },
    "radius/lg": { type: "FLOAT", value: 10 },
    "radius/xl": { type: "FLOAT", value: 14 },
    "fontWeight/normal": { type: "FLOAT", value: 400 },
    "fontWeight/medium": { type: "FLOAT", value: 500 },
    "fontWeight/semibold": { type: "FLOAT", value: 600 },
    "fontWeight/bold": { type: "FLOAT", value: 700 },
    "fontSize/xs": { type: "FLOAT", value: 12 },
    "fontSize/sm": { type: "FLOAT", value: 14 },
    "fontSize/base": { type: "FLOAT", value: 16 },
    "fontSize/lg": { type: "FLOAT", value: 18 },
    "fontSize/xl": { type: "FLOAT", value: 20 },
    "fontSize/2xl": { type: "FLOAT", value: 24 },
    "fontSize/3xl": { type: "FLOAT", value: 30 },
    "spacing/1": { type: "FLOAT", value: 4 },
    "spacing/2": { type: "FLOAT", value: 8 },
    "spacing/3": { type: "FLOAT", value: 12 },
    "spacing/4": { type: "FLOAT", value: 16 },
    "spacing/5": { type: "FLOAT", value: 20 },
    "spacing/6": { type: "FLOAT", value: 24 },
    "spacing/8": { type: "FLOAT", value: 32 },
    "spacing/10": { type: "FLOAT", value: 40 },
    "spacing/12": { type: "FLOAT", value: 48 },
    "spacing/16": { type: "FLOAT", value: 64 },
  },
  semantic: {
    "brand/primary": { type: "COLOR", value: "#fc6" },
    "brand/primaryHover": { type: "COLOR", value: "#eab308" },
    "brand/primaryActive": { type: "COLOR", value: "#ca8a04" },
    "brand/header": { type: "COLOR", value: "#32383e" },
    "brand/headerSelected": { type: "COLOR", value: "#47515b" },
    "text/primary": { type: "COLOR", value: "#18181b" },
    "text/secondary": { type: "COLOR", value: "#6b7280" },
    "text/muted": { type: "COLOR", value: "#9ca3af" },
    "text/onBrand": { type: "COLOR", value: "#18181b" },
    "text/onDark": { type: "COLOR", value: "#ffffff" },
    "text/onDarkMuted": { type: "COLOR", value: "#b8bcc2" },
    "surface/page": { type: "COLOR", value: "#f9fafb" },
    "surface/sidebar": { type: "COLOR", value: "#f4f4f5" },
    "surface/card": { type: "COLOR", value: "#ffffff" },
    "surface/hover": { type: "COLOR", value: "#e4e4e7" },
    "surface/input": { type: "COLOR", value: "#f4f4f5" },
    "border/default": { type: "COLOR", value: "#e4e4e7" },
    "border/strong": { type: "COLOR", value: "#cdd7e1" },
    "border/focus": { type: "COLOR", value: "#fc6" },
    "border/subtle": { type: "COLOR", value: "#d4d4d8" },
    "status/success": { type: "COLOR", value: "#16a34a" },
    "status/successSurface": { type: "COLOR", value: "#dcfce7" },
    "status/danger": { type: "COLOR", value: "#dc2626" },
    "status/dangerSurface": { type: "COLOR", value: "#fee2e2" },
    "status/info": { type: "COLOR", value: "#3b82f6" },
    "status/infoSurface": { type: "COLOR", value: "#dbeafe" },
    "status/purple": { type: "COLOR", value: "#8745ae" },
    "status/purpleSurface": { type: "COLOR", value: "#ede9fe" },
    "radius/component": { type: "FLOAT", value: 8 },
    "radius/card": { type: "FLOAT", value: 10 },
    "radius/input": { type: "FLOAT", value: 8 },
    "radius/pill": { type: "FLOAT", value: 999 },
    "spacing/pagePaddingX": { type: "FLOAT", value: 24 },
    "spacing/pagePaddingTop": { type: "FLOAT", value: 22 },
    "spacing/pagePaddingBottom": { type: "FLOAT", value: 16 },
  },
  component: {
    "button/primary/bg": { type: "COLOR", value: "#fc6" },
    "button/primary/bgHover": { type: "COLOR", value: "#eab308" },
    "button/primary/text": { type: "COLOR", value: "#18181b" },
    "button/primary/radius": { type: "FLOAT", value: 8 },
    "button/primary/paddingX": { type: "FLOAT", value: 16 },
    "button/primary/paddingY": { type: "FLOAT", value: 8 },
    "button/primary/fontSize": { type: "FLOAT", value: 14 },
    "button/primary/fontWeight": { type: "FLOAT", value: 500 },
    "button/secondary/bg": { type: "COLOR", value: "#ffffff" },
    "button/secondary/border": { type: "COLOR", value: "#e4e4e7" },
    "button/secondary/text": { type: "COLOR", value: "#18181b" },
    "button/secondary/radius": { type: "FLOAT", value: 8 },
    "button/secondary/paddingX": { type: "FLOAT", value: 16 },
    "button/secondary/paddingY": { type: "FLOAT", value: 8 },
    "button/danger/bg": { type: "COLOR", value: "#dc2626" },
    "button/danger/text": { type: "COLOR", value: "#ffffff" },
    "button/danger/radius": { type: "FLOAT", value: 8 },
    "card/bg": { type: "COLOR", value: "#ffffff" },
    "card/border": { type: "COLOR", value: "#e4e4e7" },
    "card/borderHover": { type: "COLOR", value: "#fc6" },
    "card/radius": { type: "FLOAT", value: 10 },
    "card/padding": { type: "FLOAT", value: 20 },
    "nav/topbar/bg": { type: "COLOR", value: "#32383e" },
    "nav/topbar/height": { type: "FLOAT", value: 80 },
    "nav/topbar/itemText": { type: "COLOR", value: "#b8bcc2" },
    "nav/topbar/itemTextActive": { type: "COLOR", value: "#ffffff" },
    "nav/sidebar/bg": { type: "COLOR", value: "#f4f4f5" },
    "nav/sidebar/border": { type: "COLOR", value: "#e4e4e7" },
    "nav/sidebar/widthOpen": { type: "FLOAT", value: 280 },
    "nav/sidebar/widthCollapsed": { type: "FLOAT", value: 66 },
    "nav/sidebar/itemText": { type: "COLOR", value: "#18181b" },
    "nav/sidebar/itemSelected": { type: "COLOR", value: "#cdd7e1" },
    "nav/sidebar/itemHover": { type: "COLOR", value: "#e4e4e7" },
    "nav/sidebar/itemHeight": { type: "FLOAT", value: 40 },
    "nav/sidebar/itemRadius": { type: "FLOAT", value: 6 },
    "badge/radius": { type: "FLOAT", value: 999 },
    "badge/paddingX": { type: "FLOAT", value: 12 },
    "badge/paddingY": { type: "FLOAT", value: 4 },
    "badge/fontSize": { type: "FLOAT", value: 12 },
    "badge/fontWeight": { type: "FLOAT", value: 500 },
    "input/bg": { type: "COLOR", value: "#f4f4f5" },
    "input/border": { type: "COLOR", value: "#e4e4e7" },
    "input/borderFocus": { type: "COLOR", value: "#fc6" },
    "input/text": { type: "COLOR", value: "#18181b" },
    "input/placeholder": { type: "COLOR", value: "#9ca3af" },
    "input/radius": { type: "FLOAT", value: 8 },
    "input/height": { type: "FLOAT", value: 36 },
    "pageHeader/paddingX": { type: "FLOAT", value: 24 },
    "pageHeader/paddingTop": { type: "FLOAT", value: 22 },
    "pageHeader/paddingBottom": { type: "FLOAT", value: 16 },
    "pageHeader/borderColor": { type: "COLOR", value: "#e4e4e7" },
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
      // Safe replace: only remove collections THIS plugin created (matched by
      // exact name). Any other variable collections in the file — for
      // unrelated work — are left untouched.
      const ourNames = new Set(Object.values(COLLECTION_NAMES));
      const allCollections = await figma.variables.getLocalVariableCollectionsAsync();
      const existing = allCollections.filter((c) => ourNames.has(c.name));
      const replaced = existing.length;
      existing.forEach((c) => c.remove());

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

      const replacedNote = replaced ? ` (replaced ${replaced} existing collection${replaced === 1 ? '' : 's'})` : '';
      figma.ui.postMessage({ type: 'done', message: `✅ ${total} variables created across 3 collections${replacedNote}!` });
    } catch (err) {
      figma.ui.postMessage({ type: 'error', message: `❌ ${err.message}` });
    }
  }

  if (msg.type === 'clean-styles') {
    try {
      const paint  = await figma.getLocalPaintStylesAsync();
      const text   = await figma.getLocalTextStylesAsync();
      const effect = await figma.getLocalEffectStylesAsync();
      const grid   = await figma.getLocalGridStylesAsync();

      [...paint, ...text, ...effect, ...grid].forEach(s => s.remove());

      const total = paint.length + text.length + effect.length + grid.length;
      figma.ui.postMessage({ type: 'done', message: `✅ ${total} styles deleted.` });
    } catch (err) {
      figma.ui.postMessage({ type: 'error', message: `❌ ${err.message}` });
    }
  }
};
