import { supabase } from '../../lib/supabase.js';
import { getQuestionKeyboard } from '../keyboards/questionKeyboard.js';
import { messages } from '../utils/messages.js';

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
    console.log('User language:', language);

    if (query.data.startsWith('start_service_')) {
      const serviceId = query.data.replace('start_service_', '');
      console.log('Starting service questions:', serviceId);
      
      // Get questions for the service
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('service_id', serviceId)
        .order('order');

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        throw questionsError;
      }

      console.log('Fetched questions:', JSON.stringify(questions, null, 2));

      if (!questions || questions.length === 0) {
        console.log('No questions found for service:', serviceId);
        await bot.sendMessage(chatId, 'No questions available for this service.');
        return;
      }

      // Start with the first question
      const firstQuestion = questions[0];
      const keyboard = getQuestionKeyboard(firstQuestion.type, language);
      console.log('Generated question keyboard:', JSON.stringify(keyboard, null, 2));

      await bot.sendMessage(chatId, firstQuestion[`question_${language}`], {
        parse_mode: 'HTML',
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
    console.error('Error in questions handler:', error.message, error.stack);
    await bot.sendMessage(chatId, 'An error occurred. Please try again.');
  }
}