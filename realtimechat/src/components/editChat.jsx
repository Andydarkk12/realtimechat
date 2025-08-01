import { ChatMembersDisplay } from "./chatMembersDisplay"

export const EditChat = ({ kickUser, chatMembers})=>{
return(
    <div>
        <aside className="fixed top-0 right-0 h-screen w-[400px] bg-fuchsia-400 border-l border-fuchsia-500 overflow-y-auto p-4 z-50">
            <input placeholder="Enter a new chat name" className="w-full p-2 border rounded bg-gray-100 mb-3"></input>
            <button className="w-full p-2 border-amber-50 border-2 border-solid rounded-xl bg-fuchsia-400 mb-3">Change</button>
            <input placeholder="Enter a new image URL" className="w-full p-2 border rounded bg-gray-100 mb-3"></input>
            <button className="w-full p-2 border-amber-50 border-2 border-solid rounded-xl bg-fuchsia-400 mb-3">Change</button>
            <h1 className="text-gray-100 text-2xl">Chat members:</h1>
            {chatMembers.map((member) => (
                <ChatMembersDisplay key={member.user_id} member={member} kickUser={kickUser}/>
            ))}
            {/* {chatMembers[0].username} */}
        </aside>
    </div>
)}