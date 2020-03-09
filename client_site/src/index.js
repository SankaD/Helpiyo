import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Route, Switch} from 'react-router';
import {ConnectedRouter} from 'connected-react-router';
import {Nav, Navbar, NavItem, NavbarBrand,NavDropdown,MenuItem, Form, FormGroup, FormControl} from 'react-bootstrap';

import configureStore, {history} from './modules/configStore';
import './index.css';
import * as serviceWorker from './serviceWorker';
import HomePage from "./modules/home/container";
import AuthPage from './modules/auth/container';
import RequestPage from './modules/requests/container';

const store = configureStore({});
function renderNavBar() {
    return (
        <Navbar>
            <Navbar.Header>
                <Navbar.Brand>Helpiyo</Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav>

                    <NavItem eventKey={1} href={"/"}>Sign out</NavItem>
                    {/*<NavItem eventKey={2} href={"/requests"}>My Requests</NavItem>*/}
                    {/*<NavItem eventKey={3} href={"/"}>My Responses</NavItem>*/}
                    {/*<NavItem eventKey={4} href={"/"}>My Services</NavItem>*/}
                    {/*<NavDropdown eventKey={5} title={"More"} id={"basic-nav-dropdown"}>*/}
                        {/*<MenuItem eventKey={5.1}>My Profile</MenuItem>*/}
                        {/*<MenuItem eventKey={5.2}>Sign out</MenuItem>*/}
                    {/*</NavDropdown>*/}
                    {/*<Navbar.Form pullRight>*/}
                    {/*<FormGroup>*/}
                    {/*<FormControl type={"text"}/>*/}
                    {/*</FormGroup>*/}
                    {/*</Navbar.Form>*/}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div>
                {renderNavBar()}
                <Switch>
                    <Route exact path={"/show/:type/:id"} render={(props) => <HomePage {...props}/>}/>
                    <Route exact path={"/requests"} render={()=><RequestPage/>}/>
                    <Route render={() => <AuthPage/>}/>
                </Switch>
            </div>
        </ConnectedRouter>
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
