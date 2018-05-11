import React, { Component } from 'react';
import './App.css';
// import Main from './Main.jsx';
import NavBar from './NavBar.jsx';
import Login from './Login.jsx';
import Registration from './Registration.jsx';
import Setting from './Setting.jsx';
// const fetch = fetch(); //gives error
// import phone from './red-phone.jpg';
// import logo from './logoNudge.png';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user_id: 0,
      first_name: "",
      lastName: "",
      email: "",
      timeLastActivity: 0,
      contactName: "",
      contactEmail: "",
      notificationsEnabled: true,
      tagName: "Login",
      loggedIn: true // for development
    }

    // this.checkLoginStatus = this.checkLoginStatus.bind(true);
    this.verifyIfTrackActivity = this.verifyIfTrackActivity.bind(this);
    this.trackActivity = this.trackActivity.bind(this);
    this.getTimeSinceLastActivity = this.getTimeSinceLastActivity.bind(this);
    // this.verifyIfPing = this.verifyIfPing.bind(this);
    this.pingServer = this.pingServer.bind(this);
    this.getTagName = this.getTagName.bind(this);
    this.changePage = this.changePage.bind(this);
    // this.updateState = this.updateState.bind(this);
  }

  // checkLoginStatus {
  //    return session id
  //}

  // changeNotificationStatus() {
  // pass to settings checkbox
  //}

  // updateState() {
  //   fetch(`/users/${user_id}.json`)
  //     .then(function(response) {
  //       return response.json();
  //     })
  //     .then(function(userJson) {
  //       this.setState();
  //     })
  // }

  updateState(json) {
    this.setState({ json });
  }

  //merge with previous function
  changePage(tagName) {
    this.setState({ tagName: tagName});
  }

  verifyIfTrackActivity() {
    //return checkLoginStatus && this.state.notificationsEnabled;
    return true; //for development
  }

  trackActivity() {
    this.setState({ timeLastActivity: Date.now() });
    // console.log(this.state.timeLastActivity);
  }

  getTimeSinceLastActivity() {
    return Date.now() - this.state.timeLastActivity;
  }

  // verifyIfPing(schedule) {
  //   return this.state.timeLastActivity && this.getTimeSinceLastActivity() < schedule;
  // }

  pingServer() {
    //ping server POST /users/:id/checkin with session user_id
    console.log("Ping server!"); // for development
  }

  handleServerPings() { // Date.now(), Date.now() + 2hrs
    if (Date.now() - this.state.timeLastActivity < 5000) { // 86400000 -- 24-hr schedule
      console.log("Ping server!"); //this.pingServer();
    }
  }

  getTagName() {
    switch(this.state.tagName) {
      case "Login":
        return <Login renderPage={ this.changePage } />;
      case "Registration":
        return <Registration renderPage={ this.changePage } />;
      case "Setting":
        return <Setting renderPage={ this.changePage } />;
      default:
        console.log("Error: invalid component tag name");
    }
  }
  // function to check if user logged in (for conditionals)

  componentDidMount() {
        console.log("zero");
    if (this.state.loggedIn && this.state.notificationsEnabled) {
      setInterval(() => {
        console.log("first");
        if (Date.now() - this.state.timeLastActivity < 10000) { // 86400000 -- 24-hr schedule
          // console.log("Ping server!"); //this.pingServer();
          console.log("second");
        fetch("https://nameless-brook-17350.herokuapp.com/ping")
        .then(function(response) {
          console.log(`third: ${response.json()}`);
          return response.json();
        })
        .then(function(resp) {
          console.log(`fourth: ${resp}`);
        });
      }}, 5000);
    }
    // fetch(`/users/${user_id}.json`, credentials: 'same-origin')
    // .then(function(response) {
    //   return response.json();
    // })
    // .then(function(userJson) {
    //   this.setState({ userJson });
    // });
  }

  render() {
    const tagName = this.getTagName();
    return (
      <div className="App" onMouseMove={ this.verifyIfTrackActivity ? this.trackActivity : null } onKeyPress={ this.verifyIfTrackActivity ? this.trackActivity : null } >
        <div id="phone-image">

          <div className="image-text">
            <h1>
              <span>IF YOU CAN'T REACH YOUR PHONE,<span className='spacer'></span><br />
              <span className='spacer'></span><span id="nudge">NUDGE</span> WILL DO IT FOR YOU.</span>
            </h1>
          </div>
        </div>
          <NavBar renderPage={ this.changePage } />
          {tagName}
      </div>
    );
  }
}

export default App;
