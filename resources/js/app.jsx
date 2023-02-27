import './bootstrap';
import '../css/app.css';

import ReactDOM from 'react-dom/client';
import React from 'react'
import {NavBar} from './components/NavBar';
import {JoinDialog} from './components/JoinDialog';
import {Game} from './components/Game';
import {WaitingRoom} from './components/WaitingRoom';
import {Home} from './components/Home';

console.log(window.User);


window.userChangedEvent = new Event("window.user:changed");

window.setUser = (user_data) => {
    window.user = user_data;
    console.log("setUser");
    document.dispatchEvent(window.userChangedEvent);
}

window.gameRoomChangedEvent = new Event("window.game_room:changed");
window.setGameRoom = (room_data) => {
    window.game_room = room_data;
    console.log("setGameRoom");
    window.history.pushState(null, "", "game/abcd");
    document.dispatchEvent(window.gameRoomChangedEvent);
}

import {themeChange} from 'theme-change'


export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: "",
            state: "starting",
            errors: {},
        };

        if (window.url_room_code)
        {
            this.state.state = "joining";
        }
        if (window.game_room != null) {
            if (window.url_room_code != window.game_room.room_code) {
                this.state.state = "joining";
                console.log("setting joining state");
            }
            else {
                switch (window.user.game_room_status)
                {
                    case "waiting":
                        this.state.state = "waiting";
                        break;
                    default:
                        this.state.state = "gaming";
                        break;
                }
            }
        }

        document.addEventListener('window.user:changed', () => {
            if (this.state.user_id == null || window.user.id != this.state.user_id)
            {
                if (window.user.game_room_status == "waiting")
                {
                    window.Echo.join(`WaitingRoom.${window.user.game_room_id}`)
                    .here((users) => {
                        users.forEach((user, idx) => {
                            if (user[0].id == window.user.id)
                                console.log("me");
                            console.log(user);
                        });
                    })
                    .joining((user) => {
                        console.log("joining");
                    })
                    .leaving((user) => {
                        console.log("leaving");
                        console.log(user);
                    })
                    .listen('NewMessage', (e) => { });

                    this.setState({state: "waiting"});
                }
            }
        });

        document.addEventListener('window.game_room:changed', () => {

        })
    }
    componentDidMount() {
        themeChange(!(document.readyState == "complete"));
    }

    render() {
        switch(this.state.state)
        {
            case "starting":
                return (
                    <div className="mx-auto mb-auto mt-20">
                        <Home />
                    </div>
                );
                break;

            case "joining":
                return (
                    <div className="flex mx-auto mb-auto mt-20">
                        <JoinDialog onJoin={this.joined} />
                    </div>
                );
                break;

            case "waiting":
                return (
                    <div className="mx-auto">
                        <h1>Waiting</h1>
                    </div>
                )
        }
    }

    joined(data)
    {
        console.log(data);
        
        window.setUser(data.user);
        window.setGameRoom(data.game_room);
    }
}

ReactDOM.createRoot(document.getElementById('navBar')).render(
    <React.StrictMode>
        <NavBar />
    </React.StrictMode>
);
ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
