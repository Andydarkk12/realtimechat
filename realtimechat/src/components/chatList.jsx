import { ChatListDisplay } from "./chatListDisplay";

export const ChatList = ({setEditing, onChooseChat, chats, setChatCreating }) => {
  return (
    <aside className="w-[400px] h-screen bg-fuchsia-400 border-r border-fuchsia-500 overflow-y-auto p-4 flex flex-col justify-between">
      {/* Header and chatlist */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-100">Channels</h2>
        <div className="space-y-3">
          {chats.map((chat) => (
            <ChatListDisplay
              chat={chat}
              key={chat.chat_id}
              onClick={() => {
                onChooseChat(chat.chat_id)
                setChatCreating(false)
                setEditing(false)
              }}
            />
          ))}
        </div>
      </div>

      {/* Button create chat */}
      <button
        className="mt-4 bg-white text-fuchsia-600 font-semibold py-2 px-4 rounded hover:bg-fuchsia-100 shadow"
        onClick={() => setChatCreating(true)}
      >
        Create chat
      </button>
    </aside>
  );
};