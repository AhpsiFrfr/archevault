# Archevault Chat UI

A feature-rich chat interface for the Archevault platform, combining the best features of Discord and Telegram.

## Features

- 💬 Real-time messaging with WebSockets
- 🧵 Threaded conversations
- 😊 Emoji reactions and rich message formatting
- 📱 Responsive design with mobile support
- 🎨 Customizable themes
- 🔔 Notifications and typing indicators
- 🔒 Role-based permissions
- 🎤 Voice channels (UI ready, needs backend implementation)
- 📎 File uploads (UI ready, needs backend implementation)

## Components

- `ChatWindow`: Main chat interface
- `ChatSidebar`: Room list and navigation
- `Message`: Individual message component
- `MessageInput`: Message composition input with emoji picker
- `ReactionBar`: Message reactions UI
- `ThreadPanel`: Threaded conversations

## State Management

Uses Zustand for global state management with the following store:

```typescript
interface ChatState {
  socket: Socket | null;
  currentRoom: Room | null;
  rooms: Room[];
  messages: Message[];
  threads: Thread[];
  users: User[];
  isConnected: boolean;
  // ... actions
}
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install socket.io-client zustand emoji-mart framer-motion markdown-to-jsx @headlessui/react
   ```

2. Set up environment variables:
   ```env
   NEXT_PUBLIC_SOCKET_URL=ws://your-socket-server.com
   ```

3. Implement the backend WebSocket server to handle:
   - Room management
   - Message broadcasting
   - User presence
   - Typing indicators
   - Message reactions

## Backend Integration

The chat system expects the following WebSocket events:

### Client → Server
- `joinRoom`: Join a room
- `sendMessage`: Send a new message
- `createThread`: Create a new thread
- `reactToMessage`: Add/remove reaction
- `typing`: User typing indicator

### Server → Client
- `message`: New message
- `roomUpdate`: Room data update
- `userJoined`: User joined room
- `userLeft`: User left room
- `typing`: User is typing

## Styling

Uses Tailwind CSS for styling with the following custom theme:

```css
:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
}
```

## Future Enhancements

- Voice/video calls
- Screen sharing
- Message search
- Pinned messages
- Custom emoji/stickers
- Read receipts
- Message editing/deletion
- User mentions
- Rich link previews
- End-to-end encryption
