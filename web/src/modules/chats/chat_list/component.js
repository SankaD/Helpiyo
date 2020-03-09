import React, { Component } from 'react';

import MainPage from '../../common/main_page/container';
import './styles.scss';
import { Card, Input, Image } from 'semantic-ui-react';

export default class ChatListPage extends Component {
    renderChat() {
        return (
            <Card fluid className="chat">
                <Image
                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=face-facial-hair-fine-looking-614810.jpg&fm=jpg"
                    className="profile-image" />
                <div className="chat-details">
                    <div className="display-name">Sanka Darshana</div>
                    <div className="last-message">Bring something</div>
                </div>
                <div className="chat-meta">
                    <div className="time">9 hours ago</div>
                </div>
            </Card>
        );
    }
    renderChatList() {
        let chats = [];
        for (let i = 0; i < 100; ++i) {
            chats.push(this.renderChat());
        }
        return chats;
    }
    render() {
        return (
            <MainPage>
                <div className="chat-list">
                    <Card fluid className="filters">
                        <Input placeholder="Filter..." icon="search" />
                    </Card>
                    {this.renderChatList()}
                </div>
            </MainPage>
        );
    }
}