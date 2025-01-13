import { supabase } from '../../lib/supabase.js';
import axios from 'axios';

export async function handleGroupEvents(bot, msg) {
  try {
    // Get bot info once
    const botInfo = await bot.getMe();
    
    // Handle bot being added to group
    if (msg.new_chat_member?.id === botInfo.id) {
      const chat = msg.chat;
      
      // Get chat info including photo
      const chatInfo = await bot.getChat(chat.id);
      let photoUrl = null;

      // Get chat photo if available
      if (chatInfo.photo) {
        try {
          // Get file info from Telegram
          const file = await bot.getFile(chatInfo.photo.big_file_id);
          const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

          // Download photo
          const response = await axios.get(fileUrl, { 
            responseType: 'arraybuffer',
            timeout: 30000,
            maxContentLength: 10 * 1024 * 1024 // 10MB max
          });

          // Generate unique filename
          const timestamp = Date.now();
          const filename = `group_${chat.id}_${timestamp}.jpg`;

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(filename, response.data, {
              contentType: 'image/jpeg',
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('uploads')
            .getPublicUrl(filename);

          photoUrl = publicUrl;
        } catch (error) {
          console.error('Error uploading group photo:', error);
          // Continue without photo if upload fails
        }
      }

      // Get member count
      const memberCount = await bot.getChatMemberCount(chat.id);

      // Save group to database
      const { data: group, error } = await supabase
        .from('telegram_groups')
        .upsert({
          group_id: chat.id,
          name: chat.title,
          photo_url: photoUrl,
          member_count: memberCount,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'group_id',
          returning: true
        });

      if (error) {
        console.error('Error saving group:', error);
        return;
      }

      console.log('Group saved successfully:', group);
    }
    
    // Handle bot being removed from group
    if (msg.left_chat_member?.id === botInfo.id) {
      // Get current group data to get photo URL
      const { data: group } = await supabase
        .from('telegram_groups')
        .select('photo_url')
        .eq('group_id', msg.chat.id)
        .single();

      // Delete photo from storage if exists
      if (group?.photo_url) {
        const filename = group.photo_url.split('/').pop();
        await supabase.storage
          .from('uploads')
          .remove([filename]);
      }

      // Remove group from database
      const { error } = await supabase
        .from('telegram_groups')
        .delete()
        .eq('group_id', msg.chat.id);

      if (error) {
        console.error('Error removing group:', error);
        return;
      }

      console.log('Group removed successfully');
    }

    // Handle member count updates
    if (msg.new_chat_member || msg.left_chat_member) {
      const memberCount = await bot.getChatMemberCount(msg.chat.id);
      
      // Update member count in database
      const { error } = await supabase
        .from('telegram_groups')
        .update({ 
          member_count: memberCount,
          updated_at: new Date().toISOString()
        })
        .eq('group_id', msg.chat.id);

      if (error) {
        console.error('Error updating member count:', error);
      }
    }

    // Handle group photo updates
    if (msg.new_chat_photo) {
      try {
        // Get file info from Telegram
        const file = await bot.getFile(msg.new_chat_photo[msg.new_chat_photo.length - 1].file_id);
        const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file.file_path}`;

        // Download new photo
        const response = await axios.get(fileUrl, { 
          responseType: 'arraybuffer',
          timeout: 30000,
          maxContentLength: 10 * 1024 * 1024
        });

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `group_${msg.chat.id}_${timestamp}.jpg`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filename, response.data, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filename);

        // Update group photo URL in database
        const { error } = await supabase
          .from('telegram_groups')
          .update({ 
            photo_url: publicUrl,
            updated_at: new Date().toISOString()
          })
          .eq('group_id', msg.chat.id);

        if (error) throw error;

        console.log('Group photo updated successfully');
      } catch (error) {
        console.error('Error updating group photo:', error);
      }
    }

  } catch (error) {
    console.error('Error in group handler:', error);
  }
}