import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { Send, AlertCircle } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

interface User {
  telegram_id: number;
  phone_number: string;
  username: string;
  first_name: string;
  last_name: string;
}

interface Message {
  id: string;
  content: string;
  type: 'admin' | 'user';
  status: 'pending' | 'sent' | 'read' | 'failed';
  created_at: string;
  error_message?: string;
  telegram_message_id?: number;
  reply_to_message_id?: number;
}

interface ChatMessagesProps {
  user: User;
}

export function ChatMessages({ user }: ChatMessagesProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const queryClient = useQueryClient();

  const { data: messages } = useQuery({
    queryKey: ['messages', user.telegram_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('telegram_user_id', user.telegram_id)
        .order('created_at');
      
      if (error) throw error;

      // Mark unread messages as read
      const unreadMessages = data.filter(msg => msg.status === 'sent' && msg.type === 'user');
      if (unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ status: 'read' })
          .in('id', unreadMessages.map(msg => msg.id));
        
        queryClient.invalidateQueries({ queryKey: ['messages', user.telegram_id] });
      }

      return data as Message[];
    },
    refetchInterval: 3000
  });

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);

      const { data: newMessage, error } = await supabase
        .from('messages')
        .insert([{
          telegram_user_id: user.telegram_id,
          content: message.trim(),
          type: 'admin',
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['messages', user.telegram_id] });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const getMessageStyles = (msg: Message) => {
    const baseStyles = msg.type === 'admin'
      ? 'bg-orange-500 text-white'
      : 'bg-white border border-gray-200';

    if (msg.status === 'failed') {
      return 'bg-red-500 text-white';
    }

    if (msg.status === 'pending') {
      return 'bg-orange-400 text-white opacity-70';
    }

    return baseStyles;
  };

  // Find replied message
  const findRepliedMessage = (replyId: number) => {
    return messages?.find(m => m.telegram_message_id === replyId);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-medium">
              {user.first_name ? user.first_name[0].toUpperCase() : '#'}
            </span>
          </div>
          <div>
            <div className="font-medium">
              {[user.first_name, user.last_name].filter(Boolean).join(' ') || 'Anonymous'}
            </div>
            {user.username && (
              <div className="text-sm text-gray-600">@{user.username}</div>
            )}
            <div className="text-sm text-gray-500">
              {user.phone_number || 'No phone number'}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'admin' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] rounded-lg p-3 ${getMessageStyles(msg)}`}>
              {msg.reply_to_message_id && (
                <div className={`text-xs mb-1 ${
                  msg.type === 'admin' ? 'text-orange-100' : 'text-gray-500'
                }`}>
                  Replying to: {findRepliedMessage(msg.reply_to_message_id)?.content}
                </div>
              )}
              <div className="text-sm">{msg.content}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className={`text-xs ${
                  msg.type === 'admin' ? 'text-orange-100' : 'text-gray-500'
                }`}>
                  {formatDate(msg.created_at)}
                </div>
                {msg.status === 'pending' && (
                  <div className="text-xs text-orange-200">Sending...</div>
                )}
                {msg.status === 'failed' && (
                  <div className="flex items-center gap-1 text-xs text-red-200">
                    <AlertCircle className="w-3 h-3" />
                    Failed to send
                  </div>
                )}
              </div>
              {msg.error_message && (
                <div className="text-xs text-red-200 mt-1">
                  Error: {msg.error_message}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}