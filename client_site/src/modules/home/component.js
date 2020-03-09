import React, {Component} from 'react';
import "./styles.css";
import PropTypes from 'prop-types';
import RequestView from '../common/request_view/container';

export default class HomePage extends Component {
    loadElement() {
        this.props.loadElement(this.props.match.params.type, this.props.match.params.id);
    }

    renderElement(){
        if (this.props.element){
            return ( <RequestView element={this.props.element}/>);
        }
        return (
            <div>Loading element</div>
        );
    }
    render() {
        return (
            <div className={"container"}>
                <div className={"leftPanel"}/>
                <div className={"feedPanel"}>
                    {this.renderElement()}
                </div>
                <div className={"rightPanel"}/>
            </div>
        );
    }
}

HomePage.propTypes = {
    loadElement: PropTypes.func.isRequired,
};