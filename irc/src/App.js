import React from 'react';

import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from './components/Home'

import './css/bootstrap.min.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import './components/css/Irc.css'
import './css/main.css'

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Home}></Route>
    </Router>
  )
}

export default App;
