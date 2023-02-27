import React from 'react'
import {TextInput} from './TextInput';
import {Alert} from './Alert';

export class JoinDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room_code: window.url_room_code,
            name: window.user != null ? window.user.name : "",
            processing: false,
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
        this.setState({processing: true});

        window.axios.post('/join', {
            room_code: this.state.room_code,
            name: this.state.name,
        })
        .then((response) => {
            try {
                this.setState({
                    errors: {},
                    processing: false,
                });
                this.props.onJoin(response.data);
            } catch (e)
            {
                console.log(e);
            }
        })
        .catch((error) => {
            if (error.response) {
                this.setState({
                    errors: error.response.data.errors,
                    processing: false,
                });
                console.log(error.response.data);
            } else if (error.request)
            {
                console.log(error.request);
            } else {
                throw error;
            }
        });
    }

    render() {
        return (
            <div className="card bg-base-300 text-base-content shadow">
                <div className="card-body">
                    {Object.keys(this.state.errors).map((field) =>
                        <Alert text={this.state.errors[field]} key={field}/>
                    )}
                    <h2 className="card-title">Join a Game</h2>
                    <form onSubmit={this.handleSubmit} className="">
                        <TextInput id="room_code" name="room_code" value={this.state.room_code}
                            label="Room Code" maxLength="4" className="mb-2"
                            onChange={this.handleInputChange} />

                        <TextInput id="name" name="name" value={this.state.name} label="Nickname"
                            className="mb-2"
                            onChange={this.handleInputChange} />

                        <div className="card-actions justify-end">
                            <button type="submit" name="join"
                                className={"btn btn-primary w-20 " + (this.state.processing && "loading")} >
                                { this.state.processing ? "" : "Join" }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}