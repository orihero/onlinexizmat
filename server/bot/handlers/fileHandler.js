import { supabase } from '../../lib/supabase.js';
import { getQuestionKeyboard } from '../keyboards/questionKeyboard.js';
import axios from 'axios';

export async function handleFile(bot, msg) {
  try {
    // Get the file from the message (handle both documents and photos)
    const file = msg.document || msg.photo?.[msg.photo?.length - 1];
    if (!file) {
      console.log('No file found in message');
      return;
    }

    console.log('Processing file:', {
      file_id: file.file_id,
      file_size: file.file_size,
      mime_type: file.mime_type
    });

    // Get user's current state
    const { data: state, error: stateError } = await supabase
      .from('user_service_state')
      .select('*')
      .eq('telegram_user_id', msg.from.id)
      .single();

    if (stateError || !state) {
      console.error('Error fetching state:', stateError);
      await bot.sendMessage(msg.chat.id, 'Please start the service selection process first.');
      return;
    }

    // Get current question details
    const { data: questions } = await supabase
      .from('questions')
      .select('*')
      .eq('service_id', state.service_id)
      .order('order');

    const currentQuestion = questions[state.current_question_index];
    
    // Validate file type if extensions are specified
    if (currentQuestion.file_extensions?.length > 0) {
      const fileExt = msg.document?.file_name?.split('.').pop()?.toLowerCase();
      if (!fileExt || !currentQuestion.file_extensions.includes(fileExt)) {
        await bot.sendMessage(
          msg.chat.id, 
          `Please send a file with one of these extensions: ${currentQuestion.file_extensions.join(', ')}`
        );
        return;
      }
    }

    // Get file from Telegram
    const fileInfo = await bot.getFile(file.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${fileInfo.file_path}`;

    // Download file with timeout and error handling
    const response = await axios.get(fileUrl, { 
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
      maxContentLength: 20 * 1024 * 1024 // 20MB max
    });

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = msg.document?.file_name || fileInfo.file_path.split('/').pop();
    const filename = `${msg.from.id}_${timestamp}_${originalName}`;

    // Upload to Supabase Storage with proper content type
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filename, response.data, {
        contentType: file.mime_type || 'application/octet-stream',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL of uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename);

    // Update state with answer including file metadata
    const answers = [...(state.answers || []), {
      question_index: state.current_question_index,
      answer: publicUrl,
      file_type: file.mime_type,
      original_name: originalName,
      file_size: file.file_size
    }];

    // Get user language
    const { data: user } = await supabase
      .from('telegram_users')
      .select('language')
      .eq('telegram_id', msg.from.id)
      .single();

    const language = user?.language || 'uz';

    // Check if there are more questions
    const nextIndex = state.current_question_index + 1;
    const nextQuestion = questions[nextIndex];

    if (nextQuestion) {
      // Update state for next question
      await supabase
        .from('user_service_state')
        .update({
          current_question_index: nextIndex,
          answers: answers,
          updated_at: new Date().toISOString()
        })
        .eq('telegram_user_id', msg.from.id);

      // Send next question
      await bot.sendMessage(msg.chat.id, nextQuestion[`question_${language}`], {
        reply_markup: getQuestionKeyboard(nextQuestion.type, language)
      });
    } else {
      // Create order with file information
      await supabase
        .from('orders')
        .insert([{
          telegram_user_id: msg.from.id,
          service_id: state.service_id,
          answers: answers,
          status: 'pending',
          files: answers.filter(a => a.file_type) // Store file metadata separately
        }]);

      // Clear user state
      await supabase
        .from('user_service_state')
        .delete()
        .eq('telegram_user_id', msg.from.id);

      // Send completion message
      const completionMessage = language === 'uz' 
        ? 'Buyurtmangiz qabul qilindi! Tez orada siz bilan bog\'lanamiz.'
        : 'Ваш заказ принят! Мы свяжемся с вами в ближайшее время.';

      await bot.sendMessage(msg.chat.id, completionMessage);
    }
  } catch (error) {
    console.error('Error handling file:', error);
    
    // Send appropriate error message based on error type
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