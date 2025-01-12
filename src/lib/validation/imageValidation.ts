import { serviceImageSchema } from './serviceSchema';

export async function validateServiceImage(file: File) {
  try {
    await serviceImageSchema.parseAsync({ file });
    return { isValid: true, error: null };
  } catch (error) {
    return { 
      isValid: false, 
      error: error.errors?.[0]?.message || 'Invalid image file'
    };
  }
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}