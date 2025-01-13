import { supabase } from '../../lib/supabase.js';
import { getAnswerKeyboard } from '../keyboards/mainKeyboard.js';

export async function handleQuestions(bot, query) {
  try {
    const chatId = query.message.chat.id;
    
    // Get user language
    const { data: user } = await supabase
      .from('telegram_users')
      .select('language')
      .eq('telegram_id', query.from.id)
      .single();
    
    const language = user?.language || 'uz';

    if (query.data.startsWith('start_service_')) {
      const serviceId = query.data.replace('start_service_', '');
      
      // Get questions for the service
      const { data: questions } = await supabase
        .from('questions')
        .select('*')
        .eq('service_id', serviceId)
        .order('order');

      if (!questions?.length) {
        await bot.sendMessage(chatId, 'No questions available for this service.');
        return;
      }

      // Show first question with answer keyboard
      const firstQuestion = questions[0];
      const keyboard = getAnswerKeyboard(language);

      await bot.sendMessage(chatId, firstQuestion[`question_${language}`], {
        reply_markup: keyboard
      });

      // Save current question state
      await supabase
        .from('user_service_state')
        .upsert({
          telegram_user_id: query.from.id,
          service_id: serviceId,
          current_question_index: 0,
          answers: []
        });
    }
  } catch (error) {
    console.error('Error in questions handler:', error);
    await bot.sendMessage(chatId, 'An error occurred. Please try again.');
  }
}