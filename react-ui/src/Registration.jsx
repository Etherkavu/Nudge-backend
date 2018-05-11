import React, { Component } from 'react';
// const fetch = fetch();

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        contact_name: "",
        contact_email: ""
      };

    this.linkLogin = this.linkLogin.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  linkLogin() {
    this.props.renderPage("Login");
  }

  handleInput(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  // Starting with Chrome 50, this property also takes a
  // FederatedCredential instance or a PasswordCredential instance.
  onSubmit(event) {
    event.preventDefault();
    // const stateJson = this.state;
    // fetch('/registration', {
    //   method: 'POST',
    //   body: JSON.stringify(stateJson),
    //   headers: new Headers({
    //     'Content-Type': 'application/json'
    //   }),
    //   credentials: 'same-origin'
    // }).then(res => res.json())
    // .catch(error => console.error('Error:', error))
    // .then(response => this.props.updateState({ response, tagName: "Main" }));
  }

  render() {
    // const onSubmit = e => {
    //   e.preventDefault();
    // };

    return (
      <div>
        <form className="registration">
          <h1>Register</h1>
          <h2>You</h2>
          <div className="form-field">
          <label>First Name</label>
          <input name="first_name" value={ this.state.first_name } placeholder="Jane" onChange={this.handleInput} /><br/>
          </div>
          <div className="form-field">
            <label>Last Name</label>
            <input name="last_name" value={ this.state.last_name } placeholder="Doe" onChange={this.handleInput} /><br/>
          </div>
          <div className="form-field">
            <label>Email</label>
            <input name="email" value={ this.state.email } placeholder="email@example.com" onChange={this.handleInput} /><br/>
          </div>
          <div className="form-field">
            <label>Password</label>
            <input name="password" value={ this.state.password } placeholder="Password" onChange={this.handleInput} /><br/>
          </div>
          <div className="form-field">
            <label>Password Confirmation</label>
            <input name="password_confirmation" value={ this.state.password_confirmation } placeholder="Password" onChange={this.handleInput} /><br/>
          </div>
          <h2>Your emergency contact</h2>
          <div className="form-field">
            <label>Contact's Name</label>
            <input name="contact_name" value={ this.state.contact_name } placeholder="Jane" onChange={this.handleInput} /><br/>
          </div>
          <div className="form-field">
            <label>Contact's Email</label>
            <input name="contact_email" value={ this.state.contact_email } placeholder="email@example.com" onChange={this.handleInput} /><br/>
          </div>
          <button type="submit" style={{cursor:'pointer'}}>Login</button>
        </form>
       <div>Already a user yet? <span className="formLink" onClick={ this.linkLogin } style={{cursor:'pointer'}}>Login here.</span></div>
      </div>
    );
  }
}