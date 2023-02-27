import React from 'react'
import {ThemeChanger} from './ThemeChanger'
import {TextInput} from './TextInput';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            name: "",
            game_room_id: null,
            status: "nothing",
            name_box: "",
            errors: {},
            processing: false,
        };
        this.echoInitialized = false;

        this.syncState = this.syncState.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        console.log("navBar.componentDidMount");
        document.addEventListener('window.user:changed', this.syncState);
        this.syncState();
    }

    componentWillUnmount() {
        console.log("navBar.componentWillUnmount");
        document.removeEventListener('window.user:changed', this.syncState);
    }

    syncState() {
        console.log("syncing state");
        if (window.user != null)
        {
            console.log(this);
            this.setState({
                id: window.user.id,
                name: window.user.name,
                game_room_id: window.user.game_room_id,
                status: window.user.game_room_status,
                name_box: window.user.name,

            }, () => {
                if (!this.echoInitialized)
                {
                    console.log(`initializing echo App.Models.User.${this.state.id}`);
                    window.Echo.private(`App.Models.User.${this.state.id}`)
                                .listen('UserChangedOnServer', window.setUser );

                    this.echoInitialized = true;
                }
            });
        }
    }


    handleInputChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("submitted");
        this.setState({processing: true});

        window.axios.post('/name', {
            name: this.state.name_box,
        })
        .then((response) => {
            try {/*
                this.setState({
                    errors: {},
                    processing: false,
                });*/
                window.setUser(response.data.user)
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
            <div className="navbar bg-neutral text-neutral-content">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">Home</a>
                </div>
                <ThemeChanger />
                <div className="basis-36 shrink-0 flex flex-nowrap justify-end">
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost normal-case flex-nowrap">
                            <span className="overflow-hidden">{this.state.name}</span>
                            <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                        </label>

                        <ul tabIndex={0} className="dropdown-content bg-base-200 text-base-content shadow mt-3 p-2 rounded-box w-72 overflow-hidden">
                            <li>
                                <form className="" onSubmit={this.handleSubmit}>
                                    <TextInput name="name_box" value={this.state.name_box} label="Change Your Name"
                                        className=""
                                        onChange={this.handleInputChange}>
                                            U
                                    </TextInput>
                                </form>
                            </li>
                            <li className="flex justify-end">
                                <button type="button" className="btn btn-ghost">Leave Game</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}