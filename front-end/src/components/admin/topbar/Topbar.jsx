import React from 'react';
import './topbar.scss';
import axios from "axios";
import {Link} from 'react-router-dom';

import logo from '../../../images/logo.png'

const logout = async () => {
  await axios.post(`${process.env["REACT_APP_BACKEND_ADDRESS"]}/logout`, {}, {withCredentials: true})
  window.location = '/login'
}
const home = async () => {
  window.location = '/'
}
const explore = async () => {
  window.location = '/Explore'
}


export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <Link to='/'>
            <img src={logo} alt="logo" onClick={() => home()}/>
          </Link>
          <span className="logo" onClick={() => window.location = "/admin"}>
            Admin Panel
          </span>
        </div>
        <div className="topRight">
          <Link to='/'>
            <span onClick={() => home()}>Home</span>
          </Link>
          <Link to='/Explore'>
            <span onClick={() => explore()}>Explore</span>
          </Link>
          <span onClick={() => logout()}>Log Out</span>
        </div>
      </div>
    </div>
  );
}