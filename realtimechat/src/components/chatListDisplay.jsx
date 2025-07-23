export const ChatListDisplay = ({ chat, onClick }) => {
  return (
    <div onClick={onClick} className="flex items-center gap-4 p-3 bg-white hover:bg-fuchsia-100 rounded-xl shadow-sm cursor-pointer transition-all">
      <img
        src={chat.chat_img}
        alt={chat.chat_name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{chat.chat_name}</h3>
      </div>
    </div>
  );
};