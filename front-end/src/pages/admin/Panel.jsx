import React, { useState } from 'react'

import Topbar from "../../components/admin/topbar/Topbar";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import Home from "./Home";
import AdminUserList from './Users';
import AdminFundraiserList from './Fundraisers';
import AdminTransactionsList from './Transactions';
import Create from './Create';

import "./Panel.scss";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

export default function Panel() {
  return (
    <div>
      <Router>
        <Topbar/>
        <div className="container">
          <Sidebar/>
          <Switch>
            <Route exact path="/admin">
              <Home/>
            </Route>
            <Route path="/admin/users">
              <AdminUserList/>
            </Route>
            <Route path="/admin/fundraisers">
              <AdminFundraiserList/>
            </Route>
            <Route path="/admin/transactions">
              <AdminTransactionsList/>
            </Route>
            <Route path="/admin/create">
              <Create/>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}
