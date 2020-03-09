import React, {Component} from 'react';
import {Button, Card, Dropdown, Grid, Icon, Image} from 'semantic-ui-react';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';
import './styles.scss';
import {Link} from "react-router-dom";

export default class RequestView extends Component {
    state = {
        lightboxOpen: false,
        currentImage: 0,
    }

    openLightbox(event, obj) {
        this.setState({
            currentImage: obj.index,
            lightboxOpen: true,
        });
    }

    closeLightbox() {
        this.setState({
            currentImage: 0,
            lightboxOpen: false,
        })
    }

    gotoNextImage() {
        this.setState({
            currentImage: this.state.currentImage + 1
        });
    }

    gotoPreviousImage() {
        this.setState({
            currentImage: this.state.currentImage - 1
        });
    }

    render() {
        let request = {
            title: "Need help for gardening",
            createdOn: Date.now() - 1000,
            images: [
                {
                    src: require('../../../images/temp (1).jpg'),
                    width: 120,
                    height: 80,
                },
                {
                    src: require('../../../images/temp (2).jpg'),
                    width: 120,
                    height: 80,
                },
                {
                    src: require('../../../images/temp (3).jpg'),
                    width: 120,
                    height: 80,
                },
                {
                    src: require('../../../images/temp (4).jpg'),
                    width: 120,
                    height: 80,
                },
            ],
            location: {
                latitude: 20,
                longitude: 20,
                name: "Malabe Junction"
            },
            time: Date.now() + 1000,
            payment: {
                amount: 100,
                currency: "USD"
            },
            creator: {
                displayName: "Sanka Darshana",
                rating: 4.5,
                profilePic: "",
            }
        };
        return (
            <Card fluid className="request-view">
                <Card.Content>
                    <div className="top-panel">
                        <Image className="profile-pic"
                               src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?cs=srgb&dl=face-facial-hair-fine-looking-614810.jpg&fm=jpg"/>
                        <div className="display-name">Sanka Darshana</div>

                        <div>9 hours ago</div>
                        <Dropdown icon="angle down" className="more-icon">
                            <Dropdown.Menu direction="left">
                                <Dropdown.Item text="Edit"/>
                                <Dropdown.Item text="Report"/>
                                <Dropdown.Item text="Share"/>
                                <Dropdown.Item text="Share To"/>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className="post">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consequat quam pellentesque
                        mauris pharetra ultrices. Proin in arcu lectus. Nunc ut ipsum eget odio pulvinar pretium. Mauris
                        sed ornare massa. Nullam suscipit nec tortor in gravida. Curabitur vitae arcu ac sem iaculis
                        varius. Fusce ipsum lectus, tempor quis pharetra in, tempus nec odio. In aliquet magna nec dui
                        condimentum, ut gravida diam dignissim. Sed suscipit felis vitae placerat condimentum. Nullam
                        aliquet vehicula nulla vitae scelerisque. In massa lectus, eleifend non tincidunt in, efficitur
                        id ligula. Nulla ullamcorper, erat eu tincidunt porttitor, magna dolor tristique tellus, eget
                        ullamcorper sem neque venenatis ex.
                    </div>
                    <div className="images">
                        <Lightbox images={request.images}
                                  currentImage={this.state.currentImage}
                                  isOpen={this.state.lightboxOpen}
                                  onClickPrev={this.gotoPreviousImage.bind(this)}
                                  onClickNext={this.gotoNextImage.bind(this)}
                                  onClose={this.closeLightbox.bind(this)}/>
                        <Gallery photos={request.images} columns={3}
                                 onClick={this.openLightbox.bind(this)}/>
                    </div>
                    <div className="details">
                        <div>
                            <Icon name="map marker"/>
                            <span>Malabe Junction</span>
                        </div>
                        <div>
                            <Icon name="clock"/>
                            <span>10.30 a.m</span>
                        </div>
                        <div>
                            <Icon name="money"/>
                            <span>30 USD</span>
                        </div>
                    </div>
                    <Grid className="buttons" divided="vertically">
                        <Button.Group widths={3}>
                            <Button as={Link} basic className="button" icon to="/response-editor/123">
                                <Icon name="hand peace" className="button-icon"/>
                                <span className="button-text">Respond</span>
                                <span className="button-count">43</span>
                            </Button>
                            <Button basic className="button" icon onClick={this.showComments}>
                                <Icon name="comment outline" className="button-icon"/>
                                <span className="button-text">Comment</span>
                                <span className="button-count">32</span>
                            </Button>
                            <Button basic className="button" icon onClick={this.like}>
                                <Icon name="like" className="button-icon"/>
                                <span className="button-text">Like</span>
                                <span className="button-count">102</span>
                            </Button>
                        </Button.Group>
                    </Grid>
                </Card.Content>
            </Card>
        );
    }
}