import React, {Component} from 'react';
import {Button, Icon, Image, Label, Menu, Segment, Sidebar} from "semantic-ui-react";
import './styles.scss';
import SearchBox from '../search/container';
import {Link} from "react-router-dom";

export default class MainPage extends Component {
    state = {
        sidebarVisible: false,
    };

    handleSidebarHide = () => {
        console.log("sidebar hide");
        this.setState({sidebarVisible: false});
    };

    showSidebar() {
        console.log("sidebar show");
        if (!this.state.sidebarVisible) {
            this.setState({sidebarVisible: true});
        }
    }

    renderMenuBar() {
        return (
            <Menu basic borderless fluid>
                <Menu.Item name="home" onClick={() => !this.state.sidebarVisible && this.showSidebar()}>
                    <Icon name="bars" size="large" inverted/>
                </Menu.Item>
                <Menu.Item className="search-item">
                    <SearchBox/>
                </Menu.Item>
                <Menu.Item to="/chats" as={Link}>
                    <div className="icon-with-count">
                        <Icon name="chat" inverted size="large"/>
                        <div className="count">29</div>
                    </div>
                </Menu.Item>
                <Menu.Item to="/notifications" as={Link}>
                    <div className="icon-with-count">
                        <Icon name="bell" inverted size="large"/>
                        <div className="count">14</div>
                    </div>
                </Menu.Item>
            </Menu>
        );
    }

    renderSideBar() {
        return (
            <Sidebar.Pushable as={Segment}>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    icon='labeled'
                    onHide={this.handleSidebarHide}
                    vertical
                    inverted
                    visible={this.state.sidebarVisible}//{true}//
                    width='wide'>
                    <Menu.Item className="profile-panel-item">
                        <Image className="cover-image"
                               src="https://images.pexels.com/photos/1382394/pexels-photo-1382394.jpeg?cs=srgb&dl=agave-aloe-cacti-1382394.jpg&fm=jpg"/>
                        <div className="profile-panel">
                            <div className="button-panel">
                                <Button as={Link} icon="cog" basic inverted to="/settings"/>
                                <Button as={Link} icon="edit" basic inverted to="/edit-profile"/>
                            </div>
                            <Link to="/profile/mine">
                                <Image
                                    size="small"
                                    className="profile-image"
                                    src={"https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=face-facial-hair-fine-looking-614810.jpg&fm=jpg" || require("../../../images/0.png")}
                                />
                            </Link>
                            <div className="display-name">Sanka Darshana</div>
                        </div>
                    </Menu.Item>
                    <Menu.Item className="menu-item" to="/" as={Link}>
                        <Label>0</Label>
                        <Icon name="home" id="icon"/>
                        <span>Home</span>
                    </Menu.Item>
                    <Menu.Item as={Link} className="menu-item" to="/my-requests">
                        <Label>0</Label>
                        <Icon name="hand paper" id="icon"/>
                        My Requests
                    </Menu.Item>
                    <Menu.Item as={Link} className="menu-item" to="/my-responses">
                        <Label>0</Label>
                        <Icon name="hand peace" id="icon"/>
                        My Responses
                    </Menu.Item>
                    <Menu.Item as={Link} className="menu-item" to="/my-services">
                        <Label>0</Label>
                        <Icon name="address book" id="icon"/>
                        My Services
                    </Menu.Item>
                    <Menu.Item as={Link} className="menu-item" to="/leaderboard">
                        <Icon name="gem" id="icon"/>
                        Leaderboard
                    </Menu.Item>
                </Sidebar>
                <Sidebar.Pusher dimmed={this.state.sidebarVisible}>
                    <Segment className="main-container">
                        {this.props.children}
                    </Segment>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }

    render() {
        return (
            <div className={"main-page"}>
                {this.renderMenuBar()}
                {this.renderSideBar()}
            </div>
        );
    }
}