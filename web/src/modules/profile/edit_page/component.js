import React, { Component } from 'react';

import MainPage from '../../common/main_page/container';
import { Card, Form, Label, Input, Button } from 'semantic-ui-react';

import './styles.scss';


export default class EditProfilePage extends Component {
    render() {
        return (
            <MainPage>
                <div className="edit-profile-page">
                    <Card fluid className="container">
                        <Form>
                            <Form.Field >
                                <label>Display Name</label>
                                <Input />
                            </Form.Field>
                            <Form.Field>
                                <label>Profile Pic</label>
                                <Input />
                            </Form.Field>
                            <Form.Field>
                                <label>Background Image</label>
                                <Input />
                            </Form.Field>
                            <Button primary>Save Profile</Button>
                        </Form>
                    </Card>
                </div>
            </MainPage>
        );
    }
}