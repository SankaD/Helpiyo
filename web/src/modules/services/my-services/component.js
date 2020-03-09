import React, {Component} from 'react';

import MainPage from '../../common/main_page/container'
import RequestView from '../../common/request_view/component';
import './styles.scss';
import RequestEditor from '../../common/request_editor/component';

export default class MyServicesPage extends Component {
    static renderServices() {
        let array = [];
        for (let i = 0; i < 5; i++) {
            array.push((<RequestView key={i}/>));

        }
        return array;
    }

    renderFloatingButton() {
        return (
            <RequestEditor/>
        );
    }

    render() {
        return (
            <MainPage>
                {this.renderFloatingButton()}
                <div className="my-services">
                    {MyServicesPage.renderServices()}
                </div>
            </MainPage>
        );
    }
}