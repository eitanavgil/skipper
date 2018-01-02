//@flow
import React, { Component } from "react";
import { Button } from "reactstrap";
import Cookies from "universal-cookie";

const cookies = new Cookies();

/**
 * Login screen
 */
class Login extends Component {
    constructor(props) {
        super(props);
        let now = new Date();
        let savedCookie = cookies.get("login");
        if (savedCookie) {
            //retreive cookie - -check delta from cookie date
            const delta = now.getTime() - savedCookie.loginTime / 1000; //in seconds
            if (delta < 60 * 60 * 6) {
                //we will not try to login for 6h from last login
                console.log(">>>>>", "cookie valid use KS ");
            } else {
                console.log(">>>>>", "cookie expired -- use login page ");
            }
        }

        this.state = {
            show: this.props.show
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangePwd = this.handleChangePwd.bind(this);
        this.handleChangeUser = this.handleChangeUser.bind(this);
        this.handleSubmit();
    }
    componentWillMount() {}

    handleChangePwd(event) {
        this.setState({ user: event.target.value, pwd: event.target.value });
    }
    handleChangeUser(event) {
        this.setState({ user: event.target.value, pwd: this.state.pwd });
    }

    handleSubmit(event) {
        if (event) {
            event.preventDefault();
        }
        var config = new window.KalturaConfiguration(27017);

        config.serviceUrl = "https://www.kaltura.com";
        var client = new window.KalturaClient(config);
        var loginId = "eitanavgil@gmail.com";
        var password = "";
        var partnerId = 27017;
        var expiry = 0;
        var privileges = "";
        var otp = "";

        window.KalturaUserService.loginByLoginId(
            loginId,
            password,
            partnerId,
            expiry,
            privileges,
            otp
        ).execute(client, function(success, results) {
            if (!success || (results && results.code && results.message)) {
                console.log("Kaltura Error", success, results);
            } else {
                client.setKs(results);
                window.kConf = config;
                window.kClient = client;
                window.kClient.setKs(results);
                window.ks = results;
            }
        });

        this.ksInterval = setInterval(() => {
            if (window.ks !== undefined && this.state.ks !== window.ks) {
                if (this.props.loginSuccess) {
                    this.props.loginSuccess();
                }
                clearInterval(this.ksInterval);
            }
        }, 100);
    }

    componentWillReceiveProps(props) {
        this.setState({ show: this.props.show });
    }

    render() {
        let jig = "";
        // if (this.jiggle) {
        //     jig = "jiggle-me";
        // }
        let showMe = this.props.show ? "hideMe" : "";
        return (
            <div className={"row h-100 w-100 p-3 " + showMe}>
                <img
                    alt={"slk"}
                    src={"./skipper.png"}
                    className="skipper-logo mx-auto"
                />
                <div className="w-100 h-100 pt-1 form-wrapper">
                    <div className="col-6 mx-auto">
                        <div className="col semi-trans container">
                            <form onSubmit={this.handleSubmit}>
                                <br />
                                <div className="h2">Login:</div>
                                <div className="form-group text-left">
                                    <label htmlFor="exampleInputEmail1">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        className={
                                            "alternate-animation form-control " +
                                            jig
                                        }
                                        id="exampleInputEmail1"
                                        aria-describedby="emailHelp"
                                        placeholder="Enter email"
                                        onChange={this.handleChangeUser}
                                    />
                                    <small id="emailHelp" className="form-text">
                                        Use your KMC login credentials
                                    </small>
                                </div>
                                <div className="form-group text-left">
                                    <label htmlFor="exampleInputPassword1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className={"form-control " + jig}
                                        id="exampleInputPassword1"
                                        placeholder="Password"
                                        onChange={this.handleChangePwd}
                                    />
                                </div>
                                <br />
                                <Button
                                    type="submit"
                                    className="btn btn-outline-secondary"
                                >
                                    Submit
                                </Button>
                                <br />
                                <br />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
