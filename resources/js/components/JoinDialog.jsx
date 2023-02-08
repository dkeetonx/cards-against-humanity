import React from 'react'
import {TextInput} from './TextInput';
import {Alert} from './Alert';

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
            <div className="card card-compact w-96 shadow">
                <div className="card-body">
                    {Object.keys(this.state.errors).map((field) =>
                        <Alert text={this.state.errors[field]} />
                    )}
                    <h2 className="card-title">Join a Game</h2>

                    <form onSubmit={this.handleSubmit} className="">
                        <TextInput id="room_code" name="room_code" value={this.state.room_code} label="Room" placeholder="CODE" maxLength="4" onChange={this.handleInputChange} />
                        <TextInput id="name" name="name" value={this.state.name} label="Name" placeholder="Name" onChange={this.handleInputChange} />
                        <div className="card-actions justify-end">
                            <input type="submit" className="btn btn-secondary btn-outline" name="join" value="Join" />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}