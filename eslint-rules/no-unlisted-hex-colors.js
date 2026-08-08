import { APPROVED_COLORS } from './approved-colors.js';

const APPROVED = new Set(APPROVED_COLORS);
const HEX_RE = /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g;

/**
 * Flags any #hex color literal (in a string or template literal) that isn't
 * in eslint-rules/approved-colors.js. This is the enforcement half of the
 * app's color system — see that file's header comment, and the "Colors"
 * table in CLAUDE.md, for the human-readable half.
 *
 * A genuinely new color needs a design decision, not just a new hex value:
 * add it to approved-colors.js AND CLAUDE.md's table, with a note on why an
 * existing token didn't cover the need.
 */
function checkText(context, node, text) {
  const matches = text.match(HEX_RE);
  if (!matches) return;
  for (const raw of matches) {
    const hex = raw.toLowerCase();
    if (!APPROVED.has(hex)) {
      context.report({
        node,
        message:
          `"{{hex}}" is not in the approved color palette (eslint-rules/approved-colors.js). ` +
          `Reuse an existing token if one is close enough, or add it deliberately to ` +
          `approved-colors.js and CLAUDE.md's color table if it's a genuinely new need.`,
        data: { hex: raw },
      });
    }
  }
}

const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow hex color literals outside the approved palette',
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string') checkText(context, node, node.value);
      },
      TemplateElement(node) {
        checkText(context, node, node.value.raw);
      },
    };
  },
};

export default rule;
