/**
 * HoneyChain Design System Tokens
 * Tailored for Rural Beekeepers with Low Digital Literacy
 */

export const honeyChainTheme = {
  colors: {
    bg: '#FDFBF7',             // Primary background (Milky White)
    text: '#3A2E26',           // Primary text (Dark Brown / Charcoal)
    textMuted: '#6B5E55',      // Secondary text (Soft dark brown)
    accent: '#E8892B',         // Single accent (Warm Orange)
    accentHover: '#D4781E',    // Button pressed/active
    accentContrast: '#FFFFFF', // High-contrast text on accent
    borderInput: '#D9D2C9',    // Functional borders only
    borderFocus: '#E8892B',
    inputBg: '#FFFFFF',
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    sizes: {
      sm: '18px',              // Minimum allowed body/caption size
      base: '20px',            // Standard readable body
      lg: '24px',              // Subheading
      h2: '28px',              // Minimum heading size (28px+)
      h1: '36px',              // Primary screen header
      display: '56px',         // Large weight / numeric readouts
    },
    lineHeights: {
      heading: 1.35,
      body: 1.65,
    },
    weights: {
      regular: 400,
      medium: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '40px',
    xl: '64px',
    xxl: '96px',
  },
  components: {
    button: {
      minHeight: '64px',       // Large touch target for field usage
      borderRadius: '20px',
      fontSize: '20px',
      fontWeight: 700,
      width: '100%',
    },
    input: {
      minHeight: '60px',
      borderRadius: '16px',
      fontSize: '20px',
      borderWidth: '2px',
    },
    container: {
      maxWidth: '520px',
      padding: '40px 24px',
    },
  },
  rules: {
    singlePrimaryActionPerScreen: true,
    noCardsNoBoxesNoShadows: true,
    iconsMustHaveTextLabels: true,
    singleAccentColorOnly: true,
  },
};

export default honeyChainTheme;
