import JSZip from "jszip";
import { saveAs } from "file-saver";
import { generateImages } from "./generateImages";
import useEditorUIStore from "@/app/Store/useEditorUIStore";

export async function generateSlidesZip() {
    const { setImageExportMode } = useEditorUIStore.getState();

  try {
    console.log("ZIP generation started");
    setImageExportMode(true);
    const images = await generateImages();
    console.log("Images generated:", images.length);

    const zip = new JSZip();

    for (const img of images) {
      const blob = await fetch(img.dataUrl).then((r) => r.blob());
      zip.file(`slide-${img.index + 1}.png`, blob);
    }

    console.log("Zipping files...");

    const zipBlob = await zip.generateAsync({ type: "blob" });

    console.log("ZIP ready, size:", zipBlob.size);

    // 🔽 DOWNLOAD TRIGGER
    saveAs(zipBlob, "slides.zip");
    setImageExportMode(false);

    console.log("Download triggered ✅");
  } catch (err) {
    setImageExportMode(false);
    console.error("ZIP EXPORT FAILED ❌", err);
    alert("Export failed. Check console.");
  }
}
