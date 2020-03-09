import React, {Component} from 'react';
import MainPage from '../../common/main_page/container';
import {Card, Header, Image} from "semantic-ui-react";

import './styles.scss'

export default class WalletPage extends Component {
    renderActivity() {
        return (
            <div className={"activity"}>
                <div className={"profile-pic"}>
                    <Image src={require('../../../images/profile.jpg')}
                           circular
                           size={"tiny"}
                    />
                </div>
                <div className={"details"}>
                    250 points sent to Nimal
                </div>
                <div className={"time"}>7 hours ago</div>

            </div>
        );
    }

    renderActivities() {
        let items = [];
        for (let i = 0; i < 50; ++i) {
            items.push(this.renderActivity());
        }
        return items;
    }

    render() {
        return (
            <MainPage>
                <div className={"wallet-page"}>
                    <Card fluid className={"data-container"}>
                        <Card.Content className={"wallet-data"}>
                            <div className={"content"}>
                                <Header size={"medium"}>Current Balance</Header>
                                <div className={"amount"}>102030</div>
                            </div>
                        </Card.Content>
                    </Card>
                    <Card fluid className={"activity-container"}>
                        <Card.Content>
                            {this.renderActivities()}
                        </Card.Content>
                    </Card>
                </div>
            </MainPage>
        );
    }
}