export function applyTheme(themeVars: Record<string, string>) {
  const root = document.documentElement;

  Object.entries(themeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
