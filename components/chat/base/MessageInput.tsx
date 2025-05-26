import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Paperclip, Send, X, Mic } from 'lucide-react';
import Picker, { EmojiClickData } from 'emoji-picker-react';

interface MessageInputProps {
  onSend: (content: string) => void;
  onTyping?: (isTyping: boolean) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  className = '',
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      onSend(trimmedMessage);
      setMessage('');
      if (onTyping) onTyping(false);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = inputRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = message;
    
    setMessage(
      text.substring(0, start) + emojiData.emoji + text.substring(end)
    );
    
    // Move cursor after the inserted emoji
    setTimeout(() => {
      const newPos = start + emojiData.emoji.length;
      textarea.selectionStart = newPos;
      textarea.selectionEnd = newPos;
      textarea.focus();
    }, 0);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    if (onTyping) onTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (onTyping) {
      onTyping(e.target.value.trim().length > 0);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop voice recording
    console.log(isRecording ? 'Stopped recording' : 'Started recording');
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 150); // Max height 150px
    textarea.style.height = `${newHeight}px`;
  }, [message]);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => document.getElementById('file-upload')?.click()}
          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={(e) => {
              // Handle file upload
              console.log('File selected:', e.target.files);
              e.target.value = ''; // Reset input
            }}
            multiple
            disabled={disabled}
          />
        </button>

        {/* Message Input */}
        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-gray-700 text-white rounded-xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden"
            rows={1}
            disabled={disabled}
          />
          
          {/* Emoji Picker Toggle */}
          <button
            type="button"
            onClick={toggleEmojiPicker}
            className="absolute right-2 bottom-2 p-1 text-gray-400 hover:text-blue-400 transition-colors"
            disabled={disabled}
          >
            <Smile className="h-5 w-5" />
            <span className="sr-only">Open emoji picker</span>
          </button>
        </div>

        {/* Send/Record Button */}
        <button
          type={message.trim() ? 'submit' : 'button'}
          onClick={message.trim() ? undefined : toggleRecording}
          className={`p-2 rounded-full ${
            message.trim() 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'text-gray-400 hover:text-blue-400'
          } transition-colors`}
          disabled={disabled}
        >
          {message.trim() ? (
            <Send className="h-5 w-5" />
          ) : (
            <Mic className={`h-5 w-5 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
          )}
          <span className="sr-only">
            {message.trim() ? 'Send message' : 'Record voice message'}
          </span>
        </button>
      </form>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-2 z-10"
          >
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="absolute top-1 right-1 z-20 p-1 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close emoji picker</span>
              </button>
              <Picker
                onEmojiClick={handleEmojiClick}
                width={300}
                height={350}
                previewConfig={{
                  showPreview: false,
                }}
                skinTonesShown={false}
                groupNames={{
                  smileys_people: 'Smileys & People',
                  animals_nature: 'Animals & Nature',
                  food_drink: 'Food & Drink',
                  travel_places: 'Travel & Places',
                  activities: 'Activities',
                  objects: 'Objects',
                  symbols: 'Symbols',
                  flags: 'Flags',
                  recently_used: 'Recently Used',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
