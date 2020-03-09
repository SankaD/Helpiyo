import React, {Component} from 'react';
import {Button, Panel, Image} from 'react-bootstrap';
import './styles.css'
import 'bootstrap-social/bootstrap-social.css';


export default class AuthPage extends Component {
    render() {
        return (
            <div className={"Container"}>
                <div className={"logoPanel"}>
                    <div className={"logo"}>
                        <Image src={require("../../images/Icon_blue_512.png")} responsive={true} className={"logoImage"}/>
                    </div>
                    <h1 className={"title"}>
                        HELPIYO
                    </h1>
                </div>
                <Panel className={"signPanel"}>
                    <Panel.Heading>
                        Sign In
                    </Panel.Heading>
                    <Panel.Body className={"signPanelBody"}>
                        <Button bsClass={"btn btn-social btn-google btn-block"} bsSize={"large"} block>
                            Sign In with Google
                        </Button>
                        <Button bsClass={"btn btn-social btn-facebook btn-block"} bsSize={"large"} block>
                            Sign in with Facebook
                        </Button>
                    </Panel.Body>
                </Panel>
            </div>
        );
    }
}