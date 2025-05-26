import React, { useState } from 'react'
import Picker from '@emoji-mart/react'
import { useUser } from '@/context/UserContext'
import { useChatStore } from '@/lib/chatStore'

const MessageInput = () => {
  const [content, setContent] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [sending, setSending] = useState(false)
  const { user } = useUser()
  const { sendMessage, currentRoom, error } = useChatStore()

  const handleSend = async () => {
    if (!content.trim() || !user || !currentRoom?.id || sending) return

    try {
      setSending(true)
      await sendMessage(content)
      setContent('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleEmojiSelect = (emoji: any) => {
    setContent((prev) => prev + emoji.native)
    setShowEmoji(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-zinc-800 bg-zinc-950 p-3 relative">
      {error && (
        <div className="mb-2 p-2 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      
      {showEmoji && (
        <div className="absolute bottom-16 left-4 z-50">
          <Picker onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="text-white text-xl hover:text-yellow-400 transition-colors"
          aria-label="Toggle Emoji Picker"
          disabled={sending}
        >
          😊
        </button>
        
        <textarea
          className="flex-1 resize-none bg-zinc-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          placeholder={currentRoom ? `Message #${currentRoom.name}` : "Select a room to start chatting..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!currentRoom || sending}
        />
        
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
          disabled={!content.trim() || !currentRoom || sending}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

export default MessageInput
