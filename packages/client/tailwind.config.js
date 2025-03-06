/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      mono: [
        "JetBrains Mono",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    screens: {
      xs: "300px",
    },
    extend: {
      borderColor: {
        "brand-neutral": "var(--brand-neutral-border)",
        "brand-error": "var(--brand-error-border)",
        "brand-success": "var(--brand-success-border)",
        "brand-warning": "var(--brand-warning-border)",
      },
      outlineColor: {
        "brand-neutral": "var(--brand-neutral-border)",
        "brand-error": "var(--brand-error-border)",
        "brand-success": "var(--brand-success-border)",
        "brand-warning": "var(--brand-warning-border)",
      },
      borderRadius: {
        brand: "0.25rem",
      },
      borderWidth: {
        brand: "1px",
      },
      colors: {
        "brand-neutral": {
          DEFAULT: "var(--brand-neutral-text)",
          2: "var(--brand-neutral-text-2)",
          3: "var(--brand-bg-overlay-3)",
          button: "var(--brand-neutral-text-button)",
        },
        "brand-primary": {
          DEFAULT: "var(--brand-primary)",
          heavy: "var(--brand-primary-heavy)",
        },
        "brand-error": {
          DEFAULT: "var(--brand-error)",
          heavy: "var(--brand-error-heavy)",
        },
        "brand-warning": {
          DEFAULT: "var(--brand-warning)",
          heavy: "var(--brand-warning-heavy)",
        },
        "brand-success": {
          DEFAULT: "var(--brand-success)",
          heavy: "var(--brand-success-heavy)",
        },
        "brand-bg": {
          DEFAULT: "var(--brand-bg-page)",
        },
      },
      backgroundColor: {
        "brand-page": {
          DEFAULT: "var(--brand-bg-page)",
          "inverted-5": "var(--brand-bg-page-inverted-5)",
        },
        "brand-card": {
          DEFAULT: "var(--brand-bg-card)",
        },
        "brand-overlay": {
          DEFAULT: "var(--brand-bg-overlay)",
          2: "var(--brand-bg-overlay-2)",
          3: "var(--brand-bg-overlay-3)",
        },
        "brand-io": {
          DEFAULT: "var(--brand-bg-io)",
          disabled: "var(--brand-bg-overlay)",
        },
        "brand-btn": {
          primary: "var(--brand-primary-btn-bg)",
          error: "var(--brand-error-btn-bg)",
          warning: "var(--brand-warning-btn-bg)",
          success: "var(--brand-success-btn-bg)",
          "primary-hover": "var(--brand-primary-btn-bg-hover)",
          "error-hover": "var(--brand-error-btn-bg-hover)",
          "warning-hover": "var(--brand-warning-btn-bg-hover)",
          "success-hover": "var(--brand-success-btn-bg-hover)",
        },
      },
      keyframes: {
        "pulse-75": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.75 },
        },
        "slide-fade-in": {
          "0%": { transform: "translateY(.25rem)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "slide-fade-in-loading-indicator": {
          "0%": { transform: "translateY(2rem)", opacity: 0, display: "none" },
          "100%": { transform: "translateY(0)", opacity: 1, display: "flex" },
        },
        "slide-fade-out-loading-indicator": {
          "0%": { transform: "translateY(0)", opacity: 1, display: "flex" },
          "100%": {
            transform: "translateY(2rem)",
            opacity: 0,
            display: "none",
          },
        },
        "slide-fade-in-modal": {
          "0%": { transform: "translateY(1rem)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        "grow-in": {
          "0%": { transform: "scale(.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        "opacity-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        "pulse-75": "pulse-75 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-fade-in":
          "slide-fade-in 0.15s cubic-bezier(0.4, 0, 0.6, 1) forwards",
        "slide-fade-in-loading-indicator":
          "slide-fade-in-loading-indicator 0.15s cubic-bezier(0.4, 0, 0.6, 1) forwards",
        "slide-fade-out-loading-indicator":
          "slide-fade-out-loading-indicator 0.15s cubic-bezier(0.4, 0, 0.6, 1) forwards",
        "slide-fade-in-modal":
          "slide-fade-in-modal 0.15s cubic-bezier(0.4, 0, 0.6, 1) forwards",
        "grow-in": "grow-in 0.15s cubic-bezier(0.4, 0, 0.6, 1) forwards",
        "opacity-in": "opacity-in 0.1s cubic-bezier(0.4, 0, 0.6, 1) forwards",
      },
    },
  },
  plugins: [],
};
