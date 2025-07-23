import { useState } from 'react'
import { useEffect } from 'react'
import { Login } from './components/login'
import { ChatList } from './components/chatList'
import { Messanges } from './components/messanges'
import io from 'socket.io-client'
function App() {
  const [choosedChat,setChoosedChat] = useState(null)
  const [isAuth, setAuth] = useState(false)
  const [chats,setChats] = useState([])
  const [messanges,setMessanges] = useState([])
const socket = io('http://localhost:8080')

  socket.on("authTrue",(data)=>{
    setAuth(true)
    setChats(data)
  })

  socket.on('authFalse',(user)=>{
    alert(`Неверно ${user}`)
  })
  socket.on('messanges',(messanges)=>{
    setMessanges(messanges)
  })

  useEffect(() => {
    if (choosedChat) {
      socket.emit('chatSelected', choosedChat)
    }
  }, [choosedChat])

  const auth = (login,password) =>{
    socket.emit("auth",{
      login:login,
      password:password
    })
  }
  
  return (
    <>
    <div className="flex h-screen w-screen overflow-hidden">
      {!isAuth && <Login auth={auth} setAuth = {setAuth}/>}
      <ChatList chats={chats} onChooseChat={setChoosedChat}/>
      <Messanges messanges={messanges} choosedChat={choosedChat}/>
    </div>
    </>
  )
}

export default App
