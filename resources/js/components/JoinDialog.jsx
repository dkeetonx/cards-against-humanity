import React from 'react'
import {TextInput} from './TextInput';

export class JoinDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room_code: "",
            name: "",
            errors: {},
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("submitted");
        window.axios.post('/join', {
            room_code: this.state.room_code,
            name: this.state.name,
        })
        .then((response) => {
            this.setState({errors: {}});
            console.log(response.data);
        })
        .catch((error) => {
            this.setState({errors: error.response.data.errors});
            console.log(error.response.data);
        });
    }

    render() {
        return (
            <div className="p-8 w-80 rounded border border-gray-600">
                <ul className="alert alert-errors">
                    {Object.keys(this.state.errors).map((field) =>
                        <li key={field}>{this.state.errors[field]}</li>
                    )}
                </ul>

                <form onSubmit={this.handleSubmit} className="space-y-4">
                    <TextInput id="room_code" name="room_code" value={this.state.room_code} label="Room Code" placeholder="CODE" maxLength="4" onChange={this.handleInputChange} />
                    <TextInput id="name" name="name" value={this.state.name} label="Name" placeholder="Name" onChange={this.handleInputChange} />
                    <input type="submit" className="btn btn-primary rounded-full border border-gray-900 p-2 w-20" name="join" value="Join" />
                </form>
            </div>
        );
    }
}