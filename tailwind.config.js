const c = (v) => `rgb(var(--${v}) / <alpha-value>)`;
const names = ["canvas","page","surface","surface-2","ink","muted","line","brand","brand-ink","brand-soft","brand-text",
  "cta","cta-hover","cta-text","on-cta","weft","housing","lamp-off","crit","crit-dot","crit-soft","mid","mid-dot","mid-soft",
  "low","low-dot","low-soft","chrome","chrome-2","scrim"];
module.exports = {
  content: ["./src/**/*.jsx"],
  theme: {
    extend: {
      colors: Object.fromEntries(names.map((n) => [n, c(n)])),
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        frame: "0 1px 2px rgb(var(--shadow) / 0.06), 0 24px 60px -18px rgb(var(--shadow) / 0.35)",
        drawer: "0 0 0 1px rgb(var(--shadow) / 0.04), 0 18px 50px -12px rgb(var(--shadow) / 0.35)",
        cta: "0 1px 0 rgb(255 255 255 / 0.18) inset, 0 8px 20px -8px rgb(var(--cta) / 0.7)",
      },
      keyframes: {
        slide: { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        fade: { from: { opacity: "0" }, to: { opacity: "1" } },
        toast: { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pop: { "0%": { transform: "scale(.6)", opacity: "0" }, "70%": { transform: "scale(1.06)", opacity: "1" }, "100%": { transform: "scale(1)" } },
        load: { from: { width: "0%" }, to: { width: "100%" } },
        enter: { from: { opacity: "0", transform: "translateY(-8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        flash: {
          "0%": { boxShadow: "0 0 0 0 rgb(var(--cta) / 0.55)" },
          "70%": { boxShadow: "0 0 0 12px rgb(var(--cta) / 0)" },
          "100%": { boxShadow: "0 0 0 0 rgb(var(--cta) / 0)" },
        },
      },
      animation: {
        slide: "slide 320ms cubic-bezier(.2,.8,.2,1)",
        fade: "fade 200ms ease-out",
        toast: "toast 260ms cubic-bezier(.2,.8,.2,1)",
        pop: "pop 420ms cubic-bezier(.2,.8,.2,1)",
        load: "load 750ms ease-out forwards",
        enter: "enter 380ms ease-out",
        flash: "flash 1.3s ease-out 3",
      },
    },
  },
  plugins: [],
};
