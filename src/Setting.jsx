import React, { Component } from 'react';

export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
        first_name: "",
        last_name: "",
        email: "",
        contact_name: "",
        contact_email: "",
      };

    // bind 'this' here
  }

  onSubmit(event) {
    event.preventDefault();
    // const stateJson = this.state;
    // fetch('/registration', {
    //   method: 'PUT',
    //   body: JSON.stringify(stateJson),
    //   headers: new Headers({
    //     'Content-Type': 'application/json'
    //   }),
    //   credentials: 'same-origin'
    // }).then(res => res.json())
    // .catch(error => console.error('Error:', error))
    // .then(response => this.props.updateState({ response, tagName: "Main" }));
  }

  componentDidMount() {
        // fetch(`/users/${user_id}.json`, credentials: 'same-origin')
    // .then(function(response) {
    //   return response.json();
    // })
    // .then(function(userJson) {
    //   this.setState({ userJson });
    // });
  }

  render() {
    return (
      <form className="settings">
        <h1>Settings</h1>
        <h2>Your emergency contact</h2>
        <div className="form-field">
          <label>Contact's Name</label>
          <input name="contact_name" value={ this.state.first_name } placeholder="Jane" /><br/>
        </div>
        <div className="form-field">
          <label>Contact's Email</label>
          <input name="contact_email" value={ this.state.email } placeholder="email@example.com" /><br/>
        </div>
        <div>
          <input type="checkbox" value={ this.state.notificationsEnabled } />
          <label for="notifications"> Check if you love this website!</label>
        </div>
        <button type="submit" style={{cursor:'pointer'}}>Edit</button>
      </form>
    );
  }
}