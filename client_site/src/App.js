import React, {Component} from 'react';
import {connect} from 'react-redux';
import './App.css';

import AuthPage from './modules/auth/container'
import HomePage from './modules/home/container';

class App extends Component {
    static renderAuthPage() {
        return (<AuthPage/>);
    }

    static renderHomePage() {
        return (<HomePage/>);
    }

    render() {
        // if (!this.props.currentProfile) {
        //     return App.renderAuthPage();
        // }

        return App.renderHomePage();
    }
}

const mapStateToProps = (state, ownProps) => ({
    currentProfile: state.global.profile,
});

const mapDispatchToProps = (dispatch, ownProps) => ({});


export default connect(mapStateToProps, mapDispatchToProps)(App);
