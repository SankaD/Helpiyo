import React, {Component} from 'react';
import './styles.scss';
import {Button, Header, Input} from "semantic-ui-react";
import {Link} from "react-router-dom";

export default class SignInPage extends Component {
    render() {
        return (
            <div className={"signin-page"}>
                <Header className={"header"} as={"h1"}>HELPIYO</Header>
                <div className={"tagline"}>For the future</div>
                <div className={"filler"}></div>
                <div className={"login-form"}>
                    <Input icon={"user"}
                           iconPosition={"left"}
                           placeholder={"Email"}
                           className={"email"}
                           fluid/>
                    <Input placeholder={"Password"}
                           icon={"lock"}
                           iconPosition={"left"}
                           className={"password"}
                           type={"password"}
                           fluid/>
                    <Button className={"button"} fluid color={"black"}>Sign In</Button>
                </div>
                <div className={"bottom-links"}>
                    <Link className={"signup"} to={"/sign-up"}>Create new account</Link>
                    <Link className={"help"} to={"/help"}>Help</Link>
                </div>
            </div>
        );
    }
}