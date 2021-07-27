import React from 'react'
import './Login.scss'

import axios from "axios"

export default function Login() {
  const login = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_ADDRESS}/login`, {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
      }, {withCredentials: true});
      if (response.status === 200) window.location = "/admin"
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <div className="login100-form validate-form">
            <span className="login100-form-title p-b-34 p-t-27">
                Log in
            </span>

            <div className="wrap-input100 validate-input" data-validate="Enter username">
              <input id={"username"} className="input100" type="text" name="username" placeholder="Username"
                     autoComplete="off"/>
            </div>

            <div className="wrap-input100 validate-input" data-validate="Enter password">
              <input id={"password"} className="input100" type="password" name="pass" placeholder="Password"
                     onKeyDown={e => e.key === 'Enter' && login()}/>
            </div>

            <div className="container-login100-form-btn">
              <button className="login100-form-btn" onClick={login}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
