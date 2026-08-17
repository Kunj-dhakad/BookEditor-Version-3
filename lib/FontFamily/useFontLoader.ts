
const loadedFonts = new Set<string>();
const fontPromises = new Map<string, Promise<void>>();

export function loadGoogleFont(fontFamily: string): Promise<void> {
  if (!fontFamily) return Promise.resolve();

  if (fontPromises.has(fontFamily)) return fontPromises.get(fontFamily)!;

  const slug = fontFamily.trim().replace(/ /g, "+");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${slug}:ital,wght@0,400;0,700;1,400&display=swap`;
  document.head.appendChild(link);
  loadedFonts.add(fontFamily);

  const promise = new Promise<void>((resolve) => {
    link.onload = () => {
      document.fonts.load(`400 16px "${fontFamily}"`)
        .then(() => resolve())
        .catch(() => resolve());
    };
    link.onerror = () => resolve(); 
  });

  fontPromises.set(fontFamily, promise);
  return promise;
}

export function useLoadFontOnMount(fontFamily: string | undefined) {
  if (typeof window !== "undefined" && fontFamily) {
    loadGoogleFont(fontFamily);
  }
}