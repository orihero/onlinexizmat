import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { supabase } from '../../../lib/supabase';
import { Send, AlertCircle, Paperclip } from 'lucide-react';
import { formatDate } from '../../../lib/utils';
import { FilePreview } from './FilePreview';
import { ChatMessage } from '../../../types/chat';

interface User {
  telegram_id: number;
  phone_number: string;
  username: string;
  first_name: string;
  last_name: string;
}

interface ChatMessagesProps {
  user: User;
}

export function ChatMessages({ user }: ChatMessagesProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

      return data as ChatMessage[];
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `chat/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      // Create message with file
      const { error: messageError } = await supabase
        .from('messages')
        .insert([{
          telegram_user_id: user.telegram_id,
          content: publicUrl,
          type: 'admin',
          status: 'pending',
          file_type: file.type,
          original_name: file.name,
          file_size: file.size
        }]);

      if (messageError) throw messageError;

      queryClient.invalidateQueries({ queryKey: ['messages', user.telegram_id] });
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'admin' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] rounded-lg p-3 ${
              msg.type === 'admin' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white border border-gray-200'
            }`}>
              {msg.file_type ? (
                <FilePreview message={msg} />
              ) : (
                <div>{msg.content}</div>
              )}
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
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isSending || isUploading}
          />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isSending}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg disabled:opacity-50"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending || isUploading}
            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}