import { supabase } from '../../lib/supabase.js';
import { getQuestionKeyboard } from '../keyboards/questionKeyboard.js';
import { messages } from '../utils/messages.js';
import axios from 'axios';

export async function handleFile(bot, msg, isReply = false) {
  try {
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
      fileData = {
        file_id: msg.video_note.file_id,
        file_type: 'video/mp4',
        file_size: msg.video_note.file_size,
        original_name: `video_note_${Date.now()}.mp4`
      };
    } else if (msg.voice) {
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
    }

    if (!fileData) {
      console.log('No supported file type found in message');
      return;
    }

    if (isReply && msg.reply_to_message) {
      // For replies, just forward the file directly
      await supabase
        .from('messages')
        .insert([{
          telegram_user_id: msg.from.id,
          content: fileData.file_id,
          type: 'user',
          status: 'sent',
          reply_to_message_id: msg.reply_to_message.message_id,
          file_type: fileData.file_type,
          original_name: fileData.original_name,
          file_size: fileData.file_size
        }]);
    } else {
      // Handle regular service question file upload
      const { data: state } = await supabase
        .from('user_service_state')
        .select('*')
        .eq('telegram_user_id', msg.from.id)
        .single();

      if (!state) return;

      // Get current question details
      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('service_id', state.service_id)
        .order('order');

      const currentQuestion = questions[state.current_question_index];

      // Update state with answer including file_id
      const answers = [...(state.answers || []), {
        question_index: state.current_question_index,
        answer: fileData.file_id,
        file_type: fileData.file_type,
        original_name: fileData.original_name,
        file_size: fileData.file_size
      }];

      await supabase
        .from('user_service_state')
        .update({ answers })
        .eq('telegram_user_id', msg.from.id);

      // Get user language
      const { data: user } = await supabase
        .from('telegram_users')
        .select('language')
        .eq('telegram_id', msg.from.id)
        .single();

      const language = user?.language || 'uz';

      // Send confirmation message
      await bot.sendMessage(msg.chat.id, messages.answerSaved[language], {
        reply_markup: getQuestionKeyboard(currentQuestion.type, language)
      });
    }
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