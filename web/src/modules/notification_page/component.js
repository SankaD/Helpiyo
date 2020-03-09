import React, { Component } from 'react';

import MainPage from '../common/main_page/container';
import './styles.scss';
import { Card, Image, Button } from 'semantic-ui-react';

export default class NotificationPage extends Component {
    renderItem() {
        return (
            <Card fluid className="notification">
                <Image
                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=face-facial-hair-fine-looking-614810.jpg&fm=jpg"
                    className="profile-image"
                />
                <div className="text">Sanka responded to your request</div>
                <div className="right-panel">
                    <div className="time">3 hours ago</div>
                    <Button icon="dot circle outline" basic className="dot" />
                </div>
            </Card>
        );
    }
    renderNotifications() {
        let items = [];
        for (let i = 0; i < 100; ++i) {
            items.push(this.renderItem());
        }
        return items;
    }
    render() {
        return (
            <MainPage>
                <div className="notification-page">
                    <Card fluid>
                        <Button color="blue" inverted>Mark all as Read</Button>
                    </Card>
                    {this.renderNotifications()}
                </div>
            </MainPage>
        );
    }
}