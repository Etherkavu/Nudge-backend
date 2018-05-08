import React from 'react';
import logo from './logoNudgeBrowser.png';

// function to change menu depending on login status


const NavBar = (props) => {
  const linkRegistration = () => {
    props.renderPage("Registration");
  }

  const linkLogin = () => {
    props.renderPage("Login");
  }
  // conditionals
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <span className="menu"><span onClick={ linkLogin } style={{cursor:'pointer'}}>Login</span> | <span onClick={ linkRegistration } style={{cursor:'pointer'}}>Register</span></span>
    </header>
  );
};

export default NavBar;
