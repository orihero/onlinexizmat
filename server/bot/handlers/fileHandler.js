import { supabase } from '../../lib/supabase.js';
import axios from 'axios';

export async function handleFile(bot, msg) {
  try {
    // Get user's current state
    const { data: state } = await supabase
      .from('user_service_state')
      .select('*')
      .eq('telegram_user_id', msg.from.id)
      .single();

    if (!state) return;

    let fileData;

    // Handle different types of messages
    if (msg.photo) {
      // Get the highest quality photo
      const photo = msg.photo[msg.photo.length - 1];
      fileData = {
        file_id: photo.file_id,
        file_type: 'image/jpeg',
        file_size: photo.file_size
      };
    } else if (msg.video) {
      fileData = {
        file_id: msg.video.file_id,
        file_type: 'video/mp4',
        file_size: msg.video.file_size,
        original_name: msg.video.file_name
      };
    } else if (msg.video_note) {
      // Handle circular video messages
      fileData = {
        file_id: msg.video_note.file_id,
        file_type: 'video/mp4',
        file_size: msg.video_note.file_size,
        original_name: `video_note_${Date.now()}.mp4`
      };
    } else if (msg.voice) {
      // Handle voice messages
      fileData = {
        file_id: msg.voice.file_id,
        file_type: 'audio/ogg',
        file_size: msg.voice.file_size,
        original_name: `voice_message_${Date.now()}.ogg`
      };
    } else if (msg.audio) {
      fileData = {
        file_id: msg.audio.file_id,
        file_type: msg.audio.mime_type,
        file_size: msg.audio.file_size,
        original_name: msg.audio.file_name || `audio_${Date.now()}.${msg.audio.mime_type.split('/')[1]}`
      };
    } else if (msg.document) {
      fileData = {
        file_id: msg.document.file_id,
        file_type: msg.document.mime_type,
        file_size: msg.document.file_size,
        original_name: msg.document.file_name
      };
    } else if (msg.location) {
      // Handle location directly without file upload
      const answers = [...(state.answers || []), {
        question_index: state.current_question_index,
        answer: `Location: ${msg.location.latitude},${msg.location.longitude}`,
        location: msg.location
      }];

      await supabase
        .from('user_service_state')
        .update({ answers })
        .eq('telegram_user_id', msg.from.id);

      // Send confirmation message
      const { data: user } = await supabase
        .from('telegram_users')
        .select('language')
        .eq('telegram_id', msg.from.id)
        .single();

      const language = user?.language || 'uz';
      const confirmMessage = language === 'uz'
        ? 'Javob saqlandi! Yana biror narsa yuborishingiz yoki tasdiqlash tugmasini bosishingiz mumkin.'
        : 'Ответ сохранен! Вы можете отправить что-то еще или нажать кнопку подтверждения.';

      await bot.sendMessage(msg.chat.id, confirmMessage);
      return;
    } else if (msg.contact) {
      // Handle contact directly without file upload
      const answers = [...(state.answers || []), {
        question_index: state.current_question_index,
        answer: `Contact: ${msg.contact.phone_number}`,
        contact: msg.contact
      }];

      await supabase
        .from('user_service_state')
        .update({ answers })
        .eq('telegram_user_id', msg.from.id);

      // Send confirmation message
      const { data: user } = await supabase
        .from('telegram_users')
        .select('language')
        .eq('telegram_id', msg.from.id)
        .single();

      const language = user?.language || 'uz';
      const confirmMessage = language === 'uz'
        ? 'Javob saqlandi! Yana biror narsa yuborishingiz yoki tasdiqlash tugmasini bosishingiz mumkin.'
        : 'Ответ сохранен! Вы можете отправить что-то еще или нажать кнопку подтверждения.';

      await bot.sendMessage(msg.chat.id, confirmMessage);
      return;
    }

    if (!fileData) {
      console.log('No supported file type found in message');
      return;
    }

    // Get file from Telegram
    const fileInfo = await bot.getFile(fileData.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;

    // Download file
    const response = await axios.get(fileUrl, { 
      responseType: 'arraybuffer',
      timeout: 30000,
      maxContentLength: 20 * 1024 * 1024
    });

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = fileData.original_name || fileInfo.file_path.split('/').pop();
    const filename = `${msg.from.id}_${timestamp}_${originalName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filename, response.data, {
        contentType: fileData.file_type,
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename);

    // Update state with answer
    const answers = [...(state.answers || []), {
      question_index: state.current_question_index,
      answer: publicUrl,
      file_type: fileData.file_type,
      original_name: fileData.original_name,
      file_size: fileData.file_size
    }];

    await supabase
      .from('user_service_state')
      .update({ answers })
      .eq('telegram_user_id', msg.from.id);

    // Send confirmation message
    const { data: user } = await supabase
      .from('telegram_users')
      .select('language')
      .eq('telegram_id', msg.from.id)
      .single();

    const language = user?.language || 'uz';
    const confirmMessage = language === 'uz'
      ? 'Javob saqlandi! Yana biror narsa yuborishingiz yoki tasdiqlash tugmasini bosishingiz mumkin.'
      : 'Ответ сохранен! Вы можете отправить что-то еще или нажать кнопку подтверждения.';

    await bot.sendMessage(msg.chat.id, confirmMessage);

  } catch (error) {
    console.error('Error handling file:', error);
    
    let errorMessage;
    if (error.response?.status === 413) {
      errorMessage = 'File is too large. Please send a smaller file.';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Upload timed out. Please try again.';
    } else {
      errorMessage = 'An error occurred while processing your file. Please try again.';
    }
    
    await bot.sendMessage(msg.chat.id, errorMessage);
  }
}