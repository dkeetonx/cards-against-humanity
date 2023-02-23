import React from 'react'
import {ThemeChanger} from './ThemeChanger'

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            echoInitialized: false,
            id: null,
            name: "",
            game_room_id: null,
            status: "nothing",
        };
        document.addEventListener('window.user:changed', this.syncState.bind(this));
        this.componentDidMount = this.syncState;
    }
    syncState() {
        console.log("syncing state");
        if (window.user != null)
        {
            this.setState({
                id: window.user.id,
                name: window.user.name,
                game_room_id: window.user.game_room_id,
                status: window.user.status,

            }, () => {
                if (!this.state.echoInitialized)
                {
                    console.log(`initializing echo App.Models.User.${this.state.id}`);
                    window.Echo.join(`App.Models.User.${this.state.id}`)
                             .listen('UserChangedOnServer', window.setUser );

                    this.setState({echoInitialized: true});
                }
            });
        }
    }

    render() {
        return (
            <div className="navbar bg-neutral text-neutral-content">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">Home</a>
                </div>
                <ThemeChanger />
                <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost normal-case bg-neutral text-neutral-content">
                    {this.state.name}
                    <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
                </label>
                <ul className="dropdown-content menu bg-base-200 text-base-content shadow mt-3 p-2 rounded-box w-52">
                    <li><a>Submenu 1</a></li>
                    <li><a>Submenu 2</a></li>
                </ul>
            </div>
            </div>
        );
    }
}