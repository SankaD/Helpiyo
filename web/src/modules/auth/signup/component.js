import React, {Component} from 'react';
import {Button, Header, Input} from "semantic-ui-react";
import './styles.scss';
import {Link} from "react-router-dom";

export default class SignUpPage extends Component {
    render() {
        return (
            <div className={"signup-page"}>
                <Header className={"header"} as={"h1"}>HELPIYO</Header>
                <div className={"tagline"}>Sign up with us today and earn 1000 points</div>
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
                    <Input placeholder={"Confirm password"}
                           icon={"lock"}
                           iconPosition={"left"}
                           className={"password"}
                           type={"password"}
                           fluid/>
                    <Button className={"button"} fluid color={"black"}>Create account</Button>
                </div>
                <div className={"bottom-links"}>
                    <Link className={"signin"} to={"/"}>Already have an account ? Sign In here</Link>
                </div>
            </div>
        );
    }
}