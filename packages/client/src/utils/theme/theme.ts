import { m } from "@compose/ts";
import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import * as localStorage from "~/utils/localStorage";

const SCHEME_PREFERENCE = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark",
  MANUAL: "manual",
} as const;
type SchemePreference =
  (typeof SCHEME_PREFERENCE)[keyof typeof SCHEME_PREFERENCE];

function isLightColor(hexColorInput: `#${string}`): boolean {
  // Remove the # if it's there
  const hexColor = hexColorInput.replace(/^#/, "");

  // Parse the hex color to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if light, false if dark
  return luminance > 0.5;
}

function lightenColor(hexColor: string, percentage: number): string {
  return adjustColor(hexColor, percentage);
}

function darkenColor(hexColor: string, percentage: number): string {
  return adjustColor(hexColor, -percentage);
}

function adjustColor(hexColor: string, percentage: number): string {
  // Remove the # if it's there
  hexColor = hexColor.replace(/^#/, "");

  // Parse the hex color to RGB
  let r = parseInt(hexColor.substr(0, 2), 16);
  let g = parseInt(hexColor.substr(2, 2), 16);
  let b = parseInt(hexColor.substr(4, 2), 16);

  // Convert to HSL
  const [h, s, l] = rgbToHsl(r, g, b);

  // Adjust lightness
  const adjustedL = Math.max(0, Math.min(1, l + percentage / 100));

  // Convert back to RGB
  [r, g, b] = hslToRgb(h, s, adjustedL);

  // Convert to hex and return
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function useSystemTheme(): SchemePreference {
  const [isLight, setIsLight] = useState(
    () => window.matchMedia("(prefers-color-scheme: light)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

    // Update state when system preference changes
    const handleChange = (e: MediaQueryListEvent) => setIsLight(e.matches);

    // Add listener
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup listener on unmount
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isLight ? SCHEME_PREFERENCE.LIGHT : SCHEME_PREFERENCE.DARK;
}

function useTheme() {
  const system = useSystemTheme();
  const systemRef = useRef(system);

  const manualThemeRef = useRef<m.Environment.DB["theme"]>(null);

  function calculatePreferred() {
    const localValue = localStorage.get(localStorage.KEYS.COLOR_SCHEME);

    if (localValue) {
      return localValue as SchemePreference;
    }

    if (manualThemeRef.current) {
      return SCHEME_PREFERENCE.MANUAL;
    }

    return SCHEME_PREFERENCE.SYSTEM;
  }
  const preferredRef = useRef<SchemePreference>(calculatePreferred());

  const updateTheme = useCallback(() => {
    function calculateIsLight() {
      if (preferredRef.current === SCHEME_PREFERENCE.MANUAL) {
        if (!manualThemeRef.current || !manualThemeRef.current.backgroundColor)
          return true;

        return isLightColor(manualThemeRef.current.backgroundColor);
      }

      if (preferredRef.current === SCHEME_PREFERENCE.LIGHT) return true;
      if (preferredRef.current === SCHEME_PREFERENCE.DARK) return false;
      return systemRef.current === SCHEME_PREFERENCE.LIGHT;
    }

    const isLightBackground = calculateIsLight();

    const root = getComputedStyle(document.documentElement);
    function setThemeColor(suffix: string, manualColor?: string | null) {
      if (preferredRef.current === SCHEME_PREFERENCE.MANUAL && manualColor) {
        document.documentElement.style.setProperty(suffix, manualColor);
        return;
      }

      if (isLightBackground) {
        document.documentElement.style.setProperty(
          suffix,
          root.getPropertyValue(`--LIGHT${suffix}`).trim()
        );
      } else {
        document.documentElement.style.setProperty(
          suffix,
          root.getPropertyValue(`--DARK${suffix}`).trim()
        );
      }
    }

    if (isLightBackground) {
      document.documentElement.style.setProperty("--color-scheme", "light");
      document.body.classList.add("theme-light", "light");
      document.body.classList.remove("theme-dark", "dark");
    } else {
      document.documentElement.style.setProperty("--color-scheme", "dark");
      document.body.classList.add("theme-dark", "dark");
      document.body.classList.remove("theme-light", "light");
    }

    const manualTheme = manualThemeRef.current;

    setThemeColor("--brand-bg-page", manualTheme?.backgroundColor);
    setThemeColor(
      "--brand-bg-io",
      manualTheme && manualTheme.backgroundColor
        ? isLightBackground
          ? lightenColor(manualTheme.backgroundColor, 0.8)
          : lightenColor(manualTheme.backgroundColor, 5)
        : undefined
    );
    setThemeColor(
      "--brand-bg-card",
      manualTheme && manualTheme.backgroundColor
        ? isLightBackground
          ? manualTheme.backgroundColor
          : lightenColor(manualTheme.backgroundColor, 1)
        : undefined
    );
    setThemeColor(
      "--brand-bg-overlay",
      manualTheme && manualTheme.backgroundColor
        ? isLightBackground
          ? darkenColor(manualTheme.backgroundColor, 3)
          : lightenColor(manualTheme.backgroundColor, 8)
        : undefined
    );
    setThemeColor(
      "--brand-bg-overlay-2",
      manualTheme && manualTheme.backgroundColor
        ? isLightBackground
          ? darkenColor(manualTheme.backgroundColor, 6)
          : lightenColor(manualTheme.backgroundColor, 16)
        : undefined
    );
    setThemeColor(
      "--brand-bg-overlay-3",
      manualTheme && manualTheme.backgroundColor
        ? isLightBackground
          ? darkenColor(manualTheme.backgroundColor, 12)
          : lightenColor(manualTheme.backgroundColor, 24)
        : undefined
    );
    setThemeColor(
      "--brand-neutral-border",
      manualTheme && manualTheme.backgroundColor
        ? isLightBackground
          ? darkenColor(manualTheme.backgroundColor, 14)
          : lightenColor(manualTheme.backgroundColor, 14)
        : undefined
    );

    setThemeColor("--brand-neutral-text", manualTheme?.textColor);
    setThemeColor(
      "--brand-bg-page-inverted-5",
      manualTheme && manualTheme.textColor
        ? `${manualTheme.textColor}0d`
        : undefined
    );
    setThemeColor(
      "--brand-neutral-text-2",
      manualTheme && manualTheme.textColor
        ? isLightBackground
          ? lightenColor(manualTheme.textColor, 30)
          : darkenColor(manualTheme.textColor, 10)
        : undefined
    );
    setThemeColor(
      "--brand-neutral-text-button",
      manualTheme && manualTheme.textColor
        ? isLightBackground
          ? lightenColor(manualTheme.textColor, 5)
          : darkenColor(manualTheme.textColor, 5)
        : undefined
    );

    setThemeColor("--brand-primary", manualTheme?.primaryColor);
    setThemeColor(
      "--brand-primary-heavy",
      manualTheme && manualTheme.primaryColor
        ? isLightBackground
          ? darkenColor(manualTheme.primaryColor, 15)
          : lightenColor(manualTheme.primaryColor, 15)
        : undefined
    );
    setThemeColor(
      "--brand-primary-btn-bg",
      manualTheme && manualTheme.primaryColor
        ? isLightBackground
          ? lightenColor(manualTheme.primaryColor, 5)
          : darkenColor(manualTheme.primaryColor, 5)
        : undefined
    );
    setThemeColor(
      "--brand-primary-btn-bg-hover",
      manualTheme && manualTheme.primaryColor
        ? isLightBackground
          ? manualTheme.primaryColor
          : manualTheme.primaryColor
        : undefined
    );

    setThemeColor("--brand-error-btn-bg");
    setThemeColor("--brand-success-btn-bg");
    setThemeColor("--brand-warning-btn-bg");

    setThemeColor("--brand-error-btn-bg-hover");
    setThemeColor("--brand-success-btn-bg-hover");
    setThemeColor("--brand-warning-btn-bg-hover");

    setThemeColor("--brand-error");
    setThemeColor("--brand-success");
    setThemeColor("--brand-warning");

    setThemeColor("--brand-error-heavy");
    setThemeColor("--brand-success-heavy");
    setThemeColor("--brand-warning-heavy");

    setThemeColor("--brand-error-border");
    setThemeColor("--brand-success-border");
    setThemeColor("--brand-warning-border");

    setThemeColor("--brand-green-tag-text");
    setThemeColor("--brand-red-tag-text");
  }, []);

  const updatePreference = useCallback(
    (value: SchemePreference, save: boolean = true) => {
      if (save) {
        localStorage.set(localStorage.KEYS.COLOR_SCHEME, value);
      }
      preferredRef.current = value;
      updateTheme();
    },
    [updateTheme]
  );

  const updateManualTheme = useCallback(
    (theme: m.Environment.DB["theme"]) => {
      manualThemeRef.current =
        theme && Object.keys(theme).length > 0 ? theme : null;
      preferredRef.current = calculatePreferred();
      updateTheme();
    },
    [updateTheme]
  );

  useEffect(() => {
    systemRef.current = system;
    preferredRef.current = calculatePreferred();
    updateTheme();
  }, [system, updateTheme]);

  return {
    refreshTheme: updateTheme,
    updatePreference,
    updateManualTheme,
  };
}

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    document.body.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.body.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
}

export {
  isLightColor as isLight,
  useTheme as use,
  useIsDarkMode as useIsDarkMode,
  SCHEME_PREFERENCE,
  type SchemePreference,
};
