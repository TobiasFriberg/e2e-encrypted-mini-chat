export const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const compressImage = async (
  srcFile: File | string,
  maxSize: number,
  blur: boolean = false,
  watermark: boolean = false
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const watermarkImage = new Image();
    const image = new Image();

    if (!ctx) {
      return;
    }

    image.onload = () => {
      let imgWidth = image.naturalWidth;
      let imgHeight = image.naturalHeight;
      let ratio = maxSize / imgHeight;

      if (imgWidth > imgHeight && imgWidth > maxSize) {
        ratio = maxSize / imgWidth;
      }

      if (imgHeight > imgWidth && imgHeight > maxSize) {
        ratio = maxSize / imgHeight;
      }

      imgWidth = imgWidth * ratio;
      imgHeight = imgHeight * ratio;

      canvas.width = imgWidth;
      canvas.height = imgHeight;

      ctx.drawImage(image, 0, 0, imgWidth, imgHeight);

      if (blur) {
        ctx.filter = 'blur(10px)';
      }

      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };

    (async () => {
      if (typeof srcFile === 'string') {
        image.src = srcFile;
        return;
      }
      image.src = await getBase64(srcFile);
    })();
  });
};
