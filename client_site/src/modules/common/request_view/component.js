import React from 'react';
import moment from 'moment';
import './styles.css';
import {Button, ButtonToolbar} from "react-bootstrap";
import ImageGallery from 'react-image-gallery';
import PropTypes from 'prop-types';
import "react-image-gallery/styles/css/image-gallery.css";

export default class RequestView extends React.Component {
    render() {
        const images = [{
            original: require('../../../images/test_image.jpg'),
            thumbnail: require('../../../images/test_image.jpg')
        }, {
            original: require('../../../images/test_image.jpg'),
            thumbnail: require('../../../images/test_image.jpg')
        }];
        const element = this.props.element;
        return (
            <div className={"elementContainer"}>
                <div className={"topPanel"}>
                    <img src={element.creator.profilePic} alt={"ProfilePic"} className={"profilePic"}/>
                    <div className={"displayName"}>{element.creator.heroName}</div>
                    <div className={"createdOn"}>{moment(element.createdOn).format()}</div>
                </div>
                <div className={"middlePanel"}>
                    <div className={"postPanel"}>
                        <div className={"post"}>{element.post}</div>
                        <div className={"metaPanel"}>
                            <div className={"distance"}>3km away</div>
                            <div className={"payment"}>300 USD</div>
                            <div className={"startTime"}>From 2/7/2019</div>
                        </div>
                    </div>
                    <div className={"imagePanel"}>
                        <ImageGallery items={images} showPlayButton={false}/>
                    </div>
                </div>
                <ButtonToolbar className={"bottomPanel"}>
                    <Button bsStyle={"primary"}>Download app and continue</Button>
                </ButtonToolbar>
            </div>
        );
    }
}

RequestView.propTypes = {
    element: PropTypes.object.isRequired,
};