import React, { Component } from 'react';

import MainPage from '../common/main_page/container';
import { Card, Dropdown, Image, Input } from 'semantic-ui-react';

import './styles.scss';

export default class Leaderboard extends Component {
    leaderboardTypes = [
        { key: "global", text: "Global", value: "global" },
        { key: "local", text: "Local", value: "local" },
        { key: "friends", text: "Friends", value: "friends" }];
    renderItem(index) {
        return (
            <Card fluid className="entry">
                <Image className="profile-image"
                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=face-facial-hair-fine-looking-614810.jpg&fm=jpg" />
                <div className="display-name">Sanka Darshana</div>
                <div className="points">100 pts</div>
                <div className="ranking">{index}</div>
            </Card>
        );
    }

    renderItems() {
        let items = [];
        for (let i = 0; i < 100; ++i) {
            items.push(this.renderItem(i + 1));
        }
        return items;
    }
    render() {
        return (
            <MainPage>
                <div className="leaderboard">
                    <Card fluid className="filters">
                        <Dropdown button
                            icon="world"
                            className="icon"
                            floating
                            labeled
                            // search
                            // text="Select Range"
                            options={this.leaderboardTypes} />
                        <Input placeholder="Filter..." className="input" />
                    </Card>
                    {/* <Card fluid> */}
                    {this.renderItems()}
                    {/* </Card> */}
                </div>
            </MainPage>
        );
    }
}