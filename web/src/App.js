import React, { Component } from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';
import 'firebase/auth';
import 'firebase/storage';
import firebase from 'firebase';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import './App.scss';
import createRootReducer from './modules/reducers';
import history from './history';

import HomePage from './modules/home/container';
import ProfilePage from './modules/profile/profile_page/container';
import MyRequestsPage from './modules/requests/my-requests/container';
import MyResponsesPage from './modules/responses/my-response/container';
import MyServicesPage from './modules/services/my-services/container';
import LeaderboardPage from './modules/leaderboard/component';
import ChatListPage from './modules/chats/chat_list/component';
import MessageListPage from './modules/chats/message_list/component';
import NotificationPage from './modules/notification_page/component';
import EditProfilePage from './modules/profile/edit_page/container';
import MainSettingsPage from './modules/settings/main/container';
import WalletPage from "./modules/profile/wallet/component";
import SignInPage from "./modules/auth/signin/container";
import SignUpPage from "./modules/auth/signup/container";

function configureStore(preloadedState) {
    return createStore(createRootReducer(history), preloadedState,
        compose(applyMiddleware(routerMiddleware(history), thunk, logger)));
}

const config = {

};

firebase.initializeApp(config);

const store = configureStore({});

class ConnectedApp extends Component {
    renderLoggedInSwitch() {
        console.log("rendering logged in switch");
        return (
            <Switch>
                <Route exact path={"/"} render={(props) => (<HomePage {...props} />)} />
                <Route exact path={"/profile/:profileId"} render={(props) => (<ProfilePage {...props} />)} />
                <Route exact path={"/my-requests"} render={(props) => (<MyRequestsPage {...props} />)} />
                <Route exact path={"/my-responses"} render={(props) => (<MyResponsesPage {...props} />)} />
                <Route exact path={"/my-services"} render={(props) => (<MyServicesPage {...props} />)} />
                <Route exact path={"/leaderboard"} render={(props) => (<LeaderboardPage {...props} />)} />
                <Route exact path={"/chats"} render={(props) => (<ChatListPage {...props} />)} />
                <Route exact path={"/messages"} render={(props) => (<MessageListPage {...props} />)} />
                <Route exact path={"/notifications"} render={(props) => (<NotificationPage {...props} />)} />
                <Route exact path={"/edit-profile"} render={(props) => (<EditProfilePage {...props} />)} />
                <Route exact path={"/settings"} render={(props) => (<MainSettingsPage {...props} />)} />
                <Route exact path={"/wallet"} render={(props) => (<WalletPage {...props} />)} />
            </Switch>
        );
    }

    renderLoggedOutSwitch() {
        console.log("rendering logged out switch");
        return (
            <Switch>
                <Route exact path={"/sign-up"} render={(props) => (<SignUpPage {...props} />)} />
                <Route render={(props) => (<SignInPage {...props} />)} />
            </Switch>
        );
    }

    renderSwitch() {
        // if (firebase.auth().currentUser && firebase.auth().currentUser.emailVerified) {
        return this.renderLoggedInSwitch();
        // }
        // return this.renderLoggedOutSwitch();
    }

    render() {
        return (
            <div className="root">
                {this.renderSwitch()}
            </div>
        );
    }
}

class App extends Component {
    render() {
        const RouterApp = withRouter(ConnectedApp);
        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <RouterApp />
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default App;
