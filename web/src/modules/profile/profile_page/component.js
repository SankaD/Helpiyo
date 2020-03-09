import React, {Component} from 'react';
import {Button, Card, Image} from 'semantic-ui-react';

import MainPage from '../../common/main_page/container';
import RequestView from '../../common/request_view/component';

import './styles.scss';
import {Link} from "react-router-dom";

export default class ProfilePage extends Component {
    renderRequests() {
        let array = [];
        for (let i = 0; i < 5; i++) {
            array.push((<RequestView/>));

        }
        return array;
    }

    render() {
        return (
            <MainPage>
                <div className="profile-page">
                    <Card fluid>
                        <Image className="profile-cover"
                               src="https://images.pexels.com/photos/1382394/pexels-photo-1382394.jpeg?cs=srgb&dl=agave-aloe-cacti-1382394.jpg&fm=jpg"/>
                        <Card.Content className="profile-details">
                            <div className="profile-image-container">
                                <Image
                                    className="profile-image"
                                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=face-facial-hair-fine-looking-614810.jpg&fm=jpg"/>
                            </div>
                            <div className="display-name">Sanka Darshana</div>
                        </Card.Content>
                    </Card>
                    <Card fluid>
                        <Card.Content>
                            <Button.Group fluid>
                                <Button icon="chat outline" basic/>
                                <Button as={Link} icon="money bill alternate outline" basic to={"/wallet"}/>
                                <Button as={Link} icon="gem outline" basic to={"/achievements"}/>
                            </Button.Group>
                        </Card.Content>
                    </Card>
                    {this.renderRequests()}
                </div>
            </MainPage>
        );
    }
}