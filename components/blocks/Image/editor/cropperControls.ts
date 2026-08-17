/**
 * Imperative handle into the mounted crop overlay.
 *
 * This lives in its own module so that panels which only need to *drive* the
 * cropper (ImageCropePanel) don't have to import ImageCropOverlay — importing
 * that pulls react-cropper + cropperjs (~600KB) into the initial bundle.
 * ImageCropOverlay assigns real implementations when it mounts.
 */
export const cropperControls = {
  setRatio: (_ratio: number) => {},
  getCroppedBlob: (): Promise<Blob | null> => Promise.resolve(null),
};
