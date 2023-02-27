import React from 'react'
import {TextInput} from './TextInput';
import {Alert} from './Alert';

export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className="card bg-base-300 text-base-content shadow w-72 h-96">
                <div className="card-body items-center text-center">
                    <h2 className="card-title">Welcome!</h2>
                </div>
            </div>
        );
    }
}