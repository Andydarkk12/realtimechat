import { useEffect } from 'react'
import { Login } from './components/login'
import { ChatList } from './components/chatList'
import { Messanges } from './components/messanges'
import io from 'socket.io-client'
import { useRef } from 'react'
import { CreateChat } from './components/createChat'
// redux
import { useSelector, useDispatch } from "react-redux";
import { setAuth, setUserId } from "./features/authSlice";
import { setChats, setChatMembers } from "./features/chatsSlice"
import { setMessages } from './features/messagesSlice'
import { setFoundUsers, setAddedUsers, setEditing } from './features/uiSlice'

function isNumber(val) {
    return val === +val;
}
function App() {
  const dispatch = useDispatch();
  //Auth slice
  const isAuth = useSelector((state) => state.auth.isAuth); 
  const userId = useSelector((state) => state.auth.userId)
  //Chat slice
  const choosedChat = useSelector((state) => state.chats.choosedChat)
  const chats = useSelector((state) => state.chats.chats)
  //Messages slice
  //Messages slice in not using here
  //Ui slice
  const foundUsers = useSelector((state) =>state.ui.foundUsers)
  const addedUsers = useSelector((state) =>state.ui.addedUsers)
  const chatCreating = useSelector((state) =>state.ui.chatCreating)
  const editing = useSelector((state) =>state.ui.editing)


  const socket = useRef(null)
  useEffect(()=>{
    socket.current = io('http://localhost:8080')

    socket.current.on("authTrue",(data)=>{
      dispatch(setAuth(true))
      dispatch(setChats(data.chats))
      dispatch(setUserId(data.userId))
    })
    socket.current.on('registerTrue',(data)=>{
      dispatch(setAuth(true))
      dispatch(setUserId(data.userId))
    })
    socket.current.on('authFalse',(user)=>{
      alert(`Incorrect login or password`)
    })
    socket.current.on('registerFalse',()=>{
      alert('There is already a user with this email!')
    })
      socket.current.on('messanges',(messanges)=>{
      dispatch(setMessages(messanges))
    })
    socket.current.on('newMessage',(message)=>{
      if (message.chat_id == choosedChat){
        dispatch(setMessages((prev) => [...prev, message]));
      }
    })
    socket.current.on('foundUsers',(users)=>{
        dispatch(setFoundUsers(users))
    })
    socket.current.on('fetchMembers',(users)=>{
      dispatch(setChatMembers(users))
    })

    socket.current.on('updateChats',(chats)=>{
      dispatch(setChats(chats))
    })

  return () => {
    socket.current.disconnect();
  }
}, []);


  useEffect(() => {
    if (isNumber(choosedChat)) {
      socket.current.emit('chatSelected', choosedChat)}
      getMembers(choosedChat)
  }, [choosedChat])

  const sendMessage = (content,chat_id)=>{
    socket.current.emit('sendMessage',{content,chat_id,userId})}

  const findUser = (username)=>{
    socket.current.emit('findUser',username)}

  const createChatFunc = (chatName,imgUrl) =>{
    socket.current.emit('createChat',{
      currentUser:userId,
      addedUsers:addedUsers,
      imgUrl,
      chatName
    })}

    const register = (login,password) =>{
    socket.current.emit("register",{
      login:login,
      password:password
    })}

  const auth = (login,password) =>{
    socket.current.emit("auth",{
      login:login,
      password:password
    })}
  const getMembers = () =>{
    socket.current.emit('getMembers',choosedChat)
  }

  const kickUser = (userId) =>{
    socket.current.emit('kickUser',{choosedChat,userId})
  }

  const changeChatName = (id,name) =>{
    socket.current.emit('changeChatName',{id,name,userId})
  }
  const changeChatImage = (id,image) =>{
    socket.current.emit('changeChatImage',{id,image,userId})
  }

  const getObjectOfChat = (id, array) => {
    return array.find(chat => chat.chat_id === id);
  };
  

  
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
