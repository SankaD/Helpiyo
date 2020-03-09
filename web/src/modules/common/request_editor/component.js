import React, {Component} from 'react';
import {Button, Card, Dropdown, Form, Input, TextArea} from 'semantic-ui-react';
import ImageUploader from 'react-images-upload';
import Geosuggest from 'react-geosuggest';
import {DateTimeInput} from 'semantic-ui-calendar-react';


import './styles.scss';
import './geo.scss';

export default class RequestEditor extends Component {
    state = {
        stage: "post",
        active: false,
    };

    renderInput() {
        if (this.state.stage === "post") {
            return (<TextArea fluid rows={6} placeholder="What do you need ?"/>)
        } else if (this.state.stage === "images") {
            return <ImageUploader withIcon buttonText="Choose Images"/>
        } else if (this.state.stage === "location") {
            return <Geosuggest fluid/>
        } else if (this.state.stage === "time") {
            return (
                <DateTimeInput
                    name="dateTime"
                    placeholder="Date Time"
                    value={this.state.dateTime}
                    iconPosition="left"
                    // onChange={this.handleChange}
                />
            );
        } else if (this.state.stage === "payment") {
            return (
                <Form.Group inline className="payment-group">
                    <label>Payment</label>
                    <Input className={"payment-input"}/>
                    <Dropdown selection
                              className={"currency-list"}
                              options={[{key: "USD", value: "usd", text: "USD"}]}/>
                </Form.Group>
            );
        }
    }

    renderButtons() {
        return (
            <div className="button-panel">
                <Button.Group>
                    <Button icon="font" basic
                            className={this.state.stage === "post" ? "active" : ""}
                            onClick={() => this.setState({stage: "post"})}/>
                    <Button icon="images outline"
                            className={this.state.stage === "images" ? "active" : ""}
                            basic onClick={() => this.setState({stage: "images"})}/>
                    <Button icon="map marker alternate" basic
                            className={this.state.stage === "location" ? "active" : ""}
                            onClick={() => this.setState({stage: "location"})}/>
                    <Button icon="clock outline" basic
                            className={this.state.stage === "time" ? "active" : ""}
                            onClick={() => this.setState({stage: "time"})}/>
                    <Button icon="money" basic
                            className={this.state.stage === "payment" ? "active" : ""}
                            onClick={() => this.setState({stage: "payment"})}/>
                </Button.Group>
                <Button.Group className="send-button-panel">
                    <Button icon="send" basic id="send-button"/>
                </Button.Group>
            </div>
        );
    }

    renderPlaceholder() {
        return (
            <Card fluid className="request-editor" onClick={() => this.setState({active: true})}>
                <Form fluid>
                    <Input placeholder="What do you need ?" fluid/>
                </Form>
            </Card>
        );
    }

    render() {
        if (this.state.active === false) {
            return this.renderPlaceholder();
        }
        return (
            <Card fluid className="request-editor">
                <Form>{this.renderInput()}</Form>
                <div>{this.renderButtons()}</div>
            </Card>
        );
    }
}