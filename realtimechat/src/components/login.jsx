import { useState } from "react"
//redux

export const Login = ({auth,register}) =>{
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    
    const handleLogin = (e) => {
        e.preventDefault();
        auth(email, password);
    };
    const handleRegister = (e) =>{
        e.preventDefault();
        register(email, password)
    }
    return(
        <div className="absolute inset-0 bg-gray-900 p-8 flex items-center justify-center z-10">
            <div className="w-xl flex h-78 bg-fuchsia-400 rounded-2xl">
                <form onSubmit={handleLogin}
                className="w-full h-full flex flex-col gap-3 items-center justify-center">

                    <h1 className="text-2xl text-gray-100">Real Time Chat</h1>

                    <input className="p-2 mx-auto rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-600" 
                    placeholder="Login"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    ></input>
                    
                    <input className="p-2 mx-auto rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-fuchsia-600"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    ></input>

                    <button className="p-2 mx-auto rounded-xl border border-white text-gray-100 text-xl"
                    type="submit"
                    >Login</button>
                                        <button className="p-2 mx-auto rounded-xl border border-white text-gray-100 text-xl"
                    type="button"
                    onClick={handleRegister}
                    >Register</button>

                </form>
            </div>
        </div>
    )
}