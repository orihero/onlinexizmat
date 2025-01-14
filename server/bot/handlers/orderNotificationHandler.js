import { supabase } from '../../lib/supabase.js';

export async function sendOrderNotification(bot, order) {
  try {
    // Get service and category details
    const { data: service } = await supabase
      .from('services')
      .select(`
        *,
        categories (
          id,
          name_uz,
          name_ru,
          group_id
        )
      `)
      .eq('id', order.service_id)
      .single();

    if (!service?.categories?.group_id) {
      console.log('No group associated with this category');
      return;
    }

    // Get group details
    const { data: group } = await supabase
      .from('telegram_groups')
      .select('*')
      .eq('id', service.categories.group_id)
      .single();

    if (!group) {
      console.log('Group not found');
      return;
    }

    // Get customer details
    const { data: customer } = await supabase
      .from('telegram_users')
      .select('*')
      .eq('telegram_id', order.telegram_user_id)
      .single();

    // Format message in both languages
    const messageUz = `🆕 Yangi buyurtma!

📦 Xizmat: ${service.name_uz}
👤 Mijoz: ${customer.first_name || ''} ${customer.last_name || ''}
📱 Telefon: ${customer.phone_number || 'Kiritilmagan'}
🕒 Vaqt: ${new Date(order.created_at).toLocaleString('uz-UZ')}
📝 Status: ${getStatusUz(order.status)}

#buyurtma_${order.id.slice(0, 8)}`;

    const messageRu = `🆕 Новый заказ!

📦 Услуга: ${service.name_ru}
👤 Клиент: ${customer.first_name || ''} ${customer.last_name || ''}
📱 Телефон: ${customer.phone_number || 'Не указан'}
🕒 Время: ${new Date(order.created_at).toLocaleString('ru-RU')}
📝 Статус: ${getStatusRu(order.status)}

#заказ_${order.id.slice(0, 8)}`;

    // Send messages to the group
    await bot.sendMessage(group.group_id, messageUz);
    await bot.sendMessage(group.group_id, messageRu);

  } catch (error) {
    console.error('Error sending order notification:', error);
  }
}

function getStatusUz(status) {
  const statusMap = {
    pending: 'Kutilmoqda',
    paid: 'To\'langan',
    inprogress: 'Jarayonda',
    delivered: 'Yetkazilgan',
    completed: 'Yakunlangan',
    cancelled: 'Bekor qilingan'
  };
  return statusMap[status] || status;
}

function getStatusRu(status) {
  const statusMap = {
    pending: 'В ожидании',
    paid: 'Оплачен',
    inprogress: 'В процессе',
    delivered: 'Доставлен',
    completed: 'Завершен',
    cancelled: 'Отменен'
  };
  return statusMap[status] || status;
}