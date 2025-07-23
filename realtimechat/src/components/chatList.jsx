import { Chats } from "./chats"
import { ChatListDisplay } from "./chatListDisplay"
export const ChatList = ({onChooseChat, chats}) =>{
    return(
    <aside className="w-[400px]  h-screen bg-fuchsia-400 border-r border-fuchsia-500 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-fuchsia-500">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Каналы</h2>
      <div className="space-y-3">
        {chats.map((chat) => (
          <ChatListDisplay 
          chat={chat} 
          key={chat.chat_id} 
          onClick={() => onChooseChat(chat.chat_id)}/>
        ))}
      </div>
    </aside>
    )
}