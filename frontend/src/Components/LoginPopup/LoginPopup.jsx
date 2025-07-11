import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {
const {url,setToken} = useContext(StoreContext)
const [currState,setCurrState]=useState("Sign Up")
const [data,setdata]=useState({
  name:"",
  email:"",
  password:""
})
const [error, setError] = useState("");
const onchangeHandler=(event)=>{
const name=event.target.name
const value=event.target.value
setdata(data=>({...data,[name]:value}))
}

 const onLogin=async (event) => {
    event.preventDefault()
    setError("");
    let newUrl = url;
    if (currState==="Login"){
      newUrl += "/api/user/login"
    }
    else{
      newUrl += "/api/user/register"
    }
     const response = await axios.post(newUrl,data);

    if (response.data.success){
      setToken(response.data.token);
      localStorage.setItem("token",response.data.token)
      setShowLogin(false)
    }
    else{
      alert(response.data.message)
    }
  }
  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>
                {currState}
                </h2>
                <img onClick={()=>setShowLogin(false)}src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
            {currState==="Login"?<></>:<input name='name' onChange={onchangeHandler}  value={data.name} type="text" placeholder='Your name' required />}
             <input name='email' onChange={onchangeHandler} value={data.email} type="email" placeholder='Your email' required />
             <input name='password' onChange={ onchangeHandler} value={data.password} type="password" placeholder='password' required/>
            </div>
             {error && <p className="login-error">{error}</p>}
            <button type='submit'>{currState==="Sign Up"?"Create Account":"Login"}</button>
            {currState === "Sign Up" && (
            <div className="login-popup-condition">
             <input type="checkbox" required />
             <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>)}
            {currState==="Login"?(<p>Create a new account?<span onClick={()=>setCurrState("Sign Up")}> Click here</span></p>):
           (<p>Already have an account?<span onClick={()=>setCurrState("Login")}> Log in</span></p>)}
        
        </form>
    </div>
  )
}

export default LoginPopup