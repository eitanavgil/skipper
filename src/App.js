import React, { Component } from "react";
import "./App.css";
import Login from "./components/Login/Login";
import "bootstrap/dist/css/bootstrap.css";
import EntriesList from "./components/EntriesList/EntriesList";

class App extends Component {
    constructor(props) {
        super(props);
        this.loginSuccess = this.loginSuccess.bind(this);
        this.logout = this.logout.bind(this);
        this.state = { state: "login" };
    }
    logout() {
        this.setState({ state: "login" });
    }
    loginSuccess() {
        this.setState({ state: "list" });
    }
    render() {
        const showLogin = this.state.state === "login" ? false : true;
        const showEntries = this.state.state === "list" ? false : true;
        return (
            <div className="App bg row h-100 w-100 m-0">
                <div className="col-md-2" />
                <div className="col-8 ">
                    <Login loginSuccess={this.loginSuccess} show={showLogin} />
                    <EntriesList show={showEntries} />
                </div>
                <div className="col-md-2" />
            </div>
        );
    }
}

export default App;
