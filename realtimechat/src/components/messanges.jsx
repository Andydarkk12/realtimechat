import { useState } from "react";
import { MessangesDisplay } from "./messangesDisplay"; // Импорт компонента
import { EditChat } from "./editChat";
export const Messanges = ({ setEditing, editing, kickUser, chatMembers, getMembers, choosedChat, messanges, sendMessage }) => {
  const [message, setMessage] = useState("");
  
  const handleSend = (e) => {
    e.preventDefault(); 
    if (!message.trim()) return; 
    setMessage(""); 
    sendMessage(message,choosedChat.chat_id)
  };

  if (!choosedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Выберите чат, чтобы начать общение
      </div>
    );
  }

  return (
    
    <div className="flex-1 flex flex-col bg-white">
      {/* Шапка */}
      <header className="flex items-center gap-4 p-4 border-b border-gray-200 shadow-sm">
        <img
          src={choosedChat.chat_img_URL}
          alt={choosedChat.chat_name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <h1 className="text-xl font-semibold">{choosedChat.chat_name}</h1>
      </header>
      {editing ? <EditChat kickUser={kickUser} chatMembers={chatMembers}/> : ''}
      {/* Блок сообщений */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messanges.map((msg) => (
          <MessangesDisplay key={msg.id} messange={msg} />
        ))}
      </div>

      {/* Блок отправки сообщения */}
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <form onSubmit={handleSend}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="ml-1 flex-1 border rounded p-2"
            placeholder="Введите сообщение..."/>
          <button type='submit'
            className="bg-fuchsia-500 text-white px-4 py-2 rounded"
          >Отправить</button>
          <button onClick={()=>
            {setEditing(!editing)
            getMembers()
          }}
            className="ml-4 bg-fuchsia-500 text-white px-4 py-2 rounded"
          >Edit chat</button>
        </form>
      </div>
    </div>
  );
};