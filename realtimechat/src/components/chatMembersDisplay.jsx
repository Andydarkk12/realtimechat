export const ChatMembersDisplay = ({isCreator, kickUser, member})=>{
    return(
    <div className="flex items-center gap-4 p-3 bg-white hover:bg-fuchsia-100 rounded-xl shadow-sm cursor-pointer transition-all mt-3">
      <img
        src={member.user_img_URL}
        alt={member.username}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold text-gray-800 z-50">{member.username}</h3>
        {isCreator?<button onClick={()=>kickUser(member.user_id)} className="bg-fuchsia-400 p-2 rounded">Kick out</button>:''}
      </div>
    </div>
)}