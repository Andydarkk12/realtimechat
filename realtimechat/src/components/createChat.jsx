import { useState, useEffect } from "react";
// Redux
import { useSelector, useDispatch } from "react-redux";
import { addUser, removeUser } from "../features/uiSlice";
// Socket hook
import useSocket from "../services/socket";

export const CreateChat = () => {
  const dispatch = useDispatch();
  const foundUsers = useSelector((state) => state.ui.foundUsers);
  const addedUsers = useSelector((state) => state.ui.addedUsers);

  const [searching, setSearching] = useState("");
  const [chatName, setChatName] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const { findUser, createChatFunc } = useSocket();

  useEffect(() => {
    if (searching.trim()) {
      findUser(searching);
    }
  }, [searching, findUser]);

  return (
    <div className="p-4 space-y-4 w-full">
      <h2 className="text-xl font-semibold mb-2">Create new chat</h2>

      <input
        type="text"
        placeholder="Название чата"
        className="w-full p-2 border rounded"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Ссылка на картинку"
        className="w-full p-2 border rounded"
        value={imgUrl}
        onChange={(e) => setImgUrl(e.target.value)}
      />

      <div>
        <input
          type="text"
          placeholder="Поиск пользователей..."
          className="w-full p-2 border rounded mt-4"
          value={searching}
          onChange={(e) => setSearching(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <h3 className="font-medium mb-2">Found users:</h3>
        <div className="space-y-2">
          {foundUsers.map((user) => (
            <div
              key={user.user_id}
              className="flex items-center justify-between p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.user_img_URL}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-800 font-medium">{user.username}</span>
              </div>
              <button
                className="bg-fuchsia-600 text-white text-sm px-3 py-1 rounded hover:bg-fuchsia-700 transition"
                onClick={() => dispatch(addUser(user))}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-medium mb-2">Choosed users:</h3>
        <div className="space-y-2">
          {addedUsers.map((user) => (
            <div
              key={user.user_id}
              className="flex items-center justify-between p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.user_img_URL}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-800 font-medium">{user.username}</span>
              </div>
              <button
                className="bg-red-600 text-white text-sm px-3 py-1 rounded hover:bg-red-700 transition"
                onClick={() => dispatch(removeUser(user.user_id))}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        className="mt-4 bg-fuchsia-600 text-white px-4 py-2 rounded"
        onClick={() => createChatFunc(chatName, imgUrl)}
      >
        Create Chat
      </button>
    </div>
  );
};

export default CreateChat;
