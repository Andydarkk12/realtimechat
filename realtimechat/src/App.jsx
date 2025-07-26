import { useState } from 'react'
import { useEffect } from 'react'
import { Login } from './components/login'
import { ChatList } from './components/chatList'
import { Messanges } from './components/messanges'
import io from 'socket.io-client'
import { useRef } from 'react'
function App() {
  const [userId, setUserId] = useState(null)
  const [choosedChat,setChoosedChat] = useState(null)
  const [isAuth, setAuth] = useState(false)
  const [chats,setChats] = useState([])
  const [messanges,setMessanges] = useState([])


  const socket = useRef(io('http://localhost:8080'))
  useEffect(()=>{
    socket.current = io('http://localhost:8080')

    socket.current.on("authTrue",(data)=>{
      setAuth(true)
      setChats(data.chats)
      setUserId(data.userId)
  })

    socket.current.on('authFalse',(user)=>{
      alert(`Неверно ${user}`)
    })
      socket.current.on('messanges',(messanges)=>{
      setMessanges(messanges)
    })
    socket.current.on('newMessage',(message)=>{
      if (message.chat_id == choosedChat){
        setMessanges((prev) => [...prev, message]);
      }
    })

    return ()=>{
      socket.current.disconnect()
    }
  })

  // socket.current.on("authTrue",(data)=>{
  //   setAuth(true)
  //   setChats(data.chats)
  //   setUserId(data.userId)
  // })

  // socket.current.on('authFalse',(user)=>{
  //   alert(`Неверно ${user}`)
  // })
  // socket.current.on('messanges',(messanges)=>{
  //   setMessanges(messanges)
  // })
  // socket.current.on('newMessage',(message)=>{
  //   if (message.chat_id == choosedChat){
  //     setMessanges((prev) => [...prev, message]);
  //   }
  // })

  useEffect(() => {
    if (choosedChat) {
      socket.current.emit('chatSelected', choosedChat)
    }
  }, [choosedChat])

  const sendMessage = (content,chat_id)=>{
    socket.current.emit('sendMessage',{content,chat_id,userId})
  }


  const auth = (login,password) =>{
    socket.current.emit("auth",{
      login:login,
      password:password
    })
  }
  
  return (
    <>
    <div className="flex h-screen w-screen overflow-hidden">
      {!isAuth && <Login auth={auth} setAuth = {setAuth}/>}
      <ChatList chats={chats} onChooseChat={setChoosedChat}/>
      <Messanges sendMessage = {sendMessage} messanges={messanges} choosedChat={choosedChat}/>
    </div>
    </>
  )
}

export default App
