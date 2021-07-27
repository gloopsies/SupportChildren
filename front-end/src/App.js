import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Navigation from "./components/Navigation";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Contact from "./pages/Contact";
import Panel from "./pages/admin/Panel";
import Login from "./pages/Login";

import DisplayVideo from "./pages/DisplayVideo";

export default function App() {
  return (
    <Router>
      <main>
        <Switch>
          <Route path="/admin">
            <Panel/>
          </Route>

          <Route exact path="/login">
            <DisplayVideo/>
            <Login/>
          </Route>

          <Route exact path="/explore">
            <Navigation/>
            <Explore/>
          </Route>

          <Route exact path="/contact">
            <Navigation/>
            <Contact/>
          </Route>

          <Route exact path="/">
            <Navigation/>
            <Home/>
          </Route>

        </Switch>
      </main>
    </Router>

  );
}
