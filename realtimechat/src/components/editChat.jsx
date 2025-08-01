import { useState } from "react"
import { ChatMembersDisplay } from "./chatMembersDisplay"

export const EditChat = ({ changeChatName, changeChatImage, choosedChat, userId, kickUser, chatMembers})=>{
    const isCreator = (choosedChat.creator_id==userId) ? true : false
    const [newName,setNewName] = useState(null)
    const [newImage,setNewImage] = useState(null)
return(
    <div>
        <aside className="fixed top-0 right-0 h-screen w-[400px] bg-fuchsia-400 border-l border-fuchsia-500 overflow-y-auto p-4 z-50">
            <input placeholder="Enter a new chat name" className="w-full p-2 border rounded bg-gray-100 mb-3"
            onChange={(e)=>setNewName(e.target.value)}
            ></input>
            <button className="w-full p-2 border-amber-50 border-2 border-solid rounded-xl bg-fuchsia-400 mb-3"
            onClick={()=>{changeChatName(choosedChat.chat_id,newName)}}
            >Change</button>
            <input placeholder="Enter a new image URL" className="w-full p-2 border rounded bg-gray-100 mb-3"
            onChange={(e)=>setNewImage(e.target.value)}
            ></input>
            <button className="w-full p-2 border-amber-50 border-2 border-solid rounded-xl bg-fuchsia-400 mb-3"
            onClick={()=>{changeChatImage(choosedChat.chat_id,newImage)}}
            >Change</button>
            <h1 className="text-gray-100 text-2xl">Chat members:</h1>
            {chatMembers.map((member) => (
                <ChatMembersDisplay isCreator={isCreator} key={member.user_id} member={member} kickUser={kickUser}/>
            ))}
        </aside>
    </div>
)}