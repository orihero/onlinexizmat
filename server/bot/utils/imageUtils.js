import axios from 'axios';
import { supabase } from '../../lib/supabase.js';
import { isValidUrl, isValidImageType } from './validation.js';

const IMAGE_DOWNLOAD_CONFIG = {
  responseType: 'arraybuffer',
  timeout: 15000,
  maxContentLength: 10 * 1024 * 1024,
  headers: {
    'Accept': 'image/*'
  }
};

export async function downloadImage(url) {
  try {
    if (!isValidUrl(url)) {
      console.error('Invalid image URL:', url);
      return null;
    }

    // Extract file path from URL - now looking for 'uploads' bucket
    const urlParts = url.split('/uploads/');
    if (urlParts.length !== 2) {
      console.error('Invalid storage URL format');
      return null;
    }

    const filePath = urlParts[1];
    const { data: { signedUrl }, error: signedUrlError } = await supabase.storage
      .from('uploads')
      .createSignedUrl(filePath, 60); // 60 seconds expiry

    if (signedUrlError) {
      console.error('Failed to get signed URL:', signedUrlError);
      return null;
    }

    console.log('Downloading image from signed URL:', signedUrl);
    const response = await axios.get(signedUrl, IMAGE_DOWNLOAD_CONFIG);

    const contentType = response.headers['content-type'];
    if (!isValidImageType(contentType)) {
      console.error('Invalid content type:', contentType);
      return null;
    }

    return Buffer.from(response.data);
  } catch (error) {
    console.error('Image download error:', {
      url,
      message: error.message,
      status: error.response?.status,
      contentType: error.response?.headers?.['content-type']
    });
    return null;
  }
}