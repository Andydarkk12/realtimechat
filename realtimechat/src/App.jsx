import { useState } from 'react'
import { useEffect } from 'react'
import { Login } from './components/login'
import { ChatList } from './components/chatList'
import { Messanges } from './components/messanges'
import io from 'socket.io-client'
import { useRef } from 'react'
import { CreateChat } from './components/createChat'
function isNumber(val) {
    return val === +val;
}
function App() {
  const [userId, setUserId] = useState(null)
  const [choosedChat,setChoosedChat] = useState(null)
  const [isAuth, setAuth] = useState(false)
  const [chats,setChats] = useState([])
  const [messanges,setMessanges] = useState([])
  const [foundUsers,setFoundUsers] = useState([])
  const [addedUsers, setAddedUsers] = useState([])
  const [chatCreating, setChatCreating] = useState(false)
  const [chatMembers, setChatMembers] = useState([])
  const [editing, setEditing] = useState(false);


  const socket = useRef(null)
  useEffect(()=>{
    socket.current = io('http://localhost:8080')

    socket.current.on("authTrue",(data)=>{
      setAuth(true)
      setChats(data.chats)
      setUserId(data.userId)
    })
    socket.current.on('registerTrue',(data)=>{
      setAuth(true)
      setUserId(data.userId)
    })
    socket.current.on('authFalse',(user)=>{
      alert(`Incorrect login or password`)
    })
    socket.current.on('registerFalse',()=>{
      alert('There is already a user with this email!')
    })
      socket.current.on('messanges',(messanges)=>{
      setMessanges(messanges)
    })
    socket.current.on('newMessage',(message)=>{
      if (message.chat_id == choosedChat){
        setMessanges((prev) => [...prev, message]);
      }
    })
    socket.current.on('foundUsers',(users)=>{
        setFoundUsers(users)
    })
    socket.current.on('fetchMembers',(users)=>{
      setChatMembers(users)
    })

    socket.current.on('updateChats',(chats)=>{
      setChats(chats)
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
      {!isAuth && <Login register={register} auth={auth} setAuth = {setAuth}/>}
      <ChatList setEditing={setEditing} setChatCreating={setChatCreating} chats={chats} onChooseChat={setChoosedChat}/>
      {chatCreating ? 
      <CreateChat createChatFunc={createChatFunc} addedUsers={addedUsers} setAddedUsers={setAddedUsers} findUser={findUser} foundUsers={foundUsers}/>:
      <Messanges changeChatName={changeChatName} changeChatImage={changeChatImage} userId={userId} setEditing={setEditing} editing={editing} kickUser={kickUser} chatMembers={chatMembers} getMembers={getMembers} sendMessage = {sendMessage} messanges={messanges} choosedChat={getObjectOfChat(choosedChat,chats)}/>}
    </div>
    </>
  )
}

export default App
