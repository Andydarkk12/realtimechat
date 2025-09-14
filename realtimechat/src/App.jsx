import { Login } from './components/login'
import { ChatList } from './components/chatList'
import { Messanges } from './components/messanges'
import { CreateChat } from './components/createChat'
import { useSocket } from './services/socket'
// redux
import { useSelector, useDispatch } from "react-redux";


function App() {
  const dispatch = useDispatch();
  //Auth slice
  const isAuth = useSelector((state) => state.auth.isAuth); 
  const userId = useSelector((state) => state.auth.userId)
  //Chat slice
  const choosedChat = useSelector((state) => state.chats.choosedChat)
  const chats = useSelector((state) => state.chats.chats)
  //Ui slice

  const addedUsers = useSelector((state) =>state.ui.addedUsers)
  const chatCreating = useSelector((state) =>state.ui.chatCreating)

    const {
    sendMessage,
    findUser,
    createChatFunc,
    register,
    auth,
    getMembers,
    kickUser,
    changeChatName,
    changeChatImage,
    getObjectOfChat
  } = useSocket();

  
  return (
    <>
    <div className="flex h-screen w-screen overflow-hidden">
      {!isAuth && <Login  register={register} auth={auth}/>}
      <ChatList/>
      {chatCreating ? 
      <CreateChat createChatFunc={createChatFunc} addedUsers={addedUsers} findUser={findUser} />:
      <Messanges changeChatName={changeChatName} changeChatImage={changeChatImage} userId={userId} kickUser={kickUser} getMembers={getMembers} sendMessage = {sendMessage} choosedChat={getObjectOfChat(choosedChat,chats)}/>}
    </div>
    </>
  )
}

export default App
