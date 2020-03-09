import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import * as UrlHelper from '../../utils/url_helper';

import "./styles.scss";

export default class SearchBox extends Component {
    state = {
        results: [],
        searchQuery: ""
    }

    componentWillReceiveProps(props) {
        this.setState({ results: props });
    }

    search(event, { searchQuery }) {
        this.setState({ searchQuery: searchQuery });
        this.props.search(searchQuery);
    }
    renderEmptyResults() {
        if (this.state.searchQuery === "") {
            return null;
        }
        if (!this.props.searching && this.props.profiles.length === 0 && this.props.projects.length === 0) {
            return (<Dropdown.Header content="No Results" fluid />);
        }
        return null;
    }
    renderResults() {

        return (
            <Dropdown.Menu fluid className="search-results">
                {this.renderEmptyResults()}
                {this.props.profiles.length > 0 && (<Dropdown.Header content="Profiles" fluid />)}
                {
                    this.props.profiles.map(profile => {
                        let data = profile;
                        return (<Dropdown.Item
                            key={profile._id}
                            image={data.imageThumbnail}
                            value={profile._id}
                            text={data.displayName}
                            as="a"
                            href={UrlHelper.getProfileUrl(profile)}
                            fluid
                        />);
                    })
                }
                {this.props.projects.length > 0 && (<Dropdown.Header content="Projects" fluid />)}
                {
                    this.props.projects.map(project => {
                        let data = project;

                        return (<Dropdown.Item
                            key={project._id}
                            value={project._id}
                            image={(data.imageThumbnail)}
                            text={data.title}
                            as="a"
                            href={UrlHelper.getProjectUrl(project)}
                            fluid
                        />);
                    })
                }
            </Dropdown.Menu>
        );
    }
    render() {
        return (
            <div className="search-box">
                <Dropdown placeholder="Search..." search deburr
                    icon={""}
                    onSearchChange={this.search.bind(this)}
                    fluid
                >
                    {this.renderResults()}
                </Dropdown>
            </div>
        );
    }
}

SearchBox.propTypes = {
    projects: PropTypes.array.isRequired,
    profiles: PropTypes.array.isRequired,
    search: PropTypes.func.isRequired,
    miscError: PropTypes.string,
    searching: PropTypes.bool.isRequired,
};