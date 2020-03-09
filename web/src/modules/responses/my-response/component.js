import React, {Component} from 'react';

import MainPage from '../../common/main_page/container'
import RequestView from '../../common/request_view/component';
import './styles.scss';

export default class MyResponsePage extends Component {
    static renderResponses() {
        let array = [];
        for (let i = 0; i < 5; i++) {
            array.push((<RequestView key={i}/>));

        }
        return array;
    }

    render() {
        return (
            <MainPage>
                <div className="my-responses">
                    {MyResponsePage.renderResponses()}
                </div>
            </MainPage>
        );
    }
}