import React from 'react'
import './sidebar.scss'

import {Accessibility, AccountBalance, Create, Feedback, LineStyle, Mail, Person, Report} from '@material-ui/icons';

import {Link} from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/admin">
              <li className="sidebarListItem">
                <LineStyle className="sidebarIcon"/>
                Home
              </li>
            </Link>
            <Link to="/admin/create">
              <li className="sidebarListItem">
                <Create className="sidebarIcon"/>
                Create
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/admin/fundraisers">
              <li className="sidebarListItem">
                <Accessibility className="sidebarIcon"/>
                Fundraisers
              </li>
            </Link>
            <Link to="/admin/transactions">
              <li className="sidebarListItem">
                <AccountBalance className="sidebarIcon"/>
                Transactions
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  )
}
