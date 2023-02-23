import './bootstrap';
import '../css/app.css';

import ReactDOM from 'react-dom/client';
import React from 'react'
import {NavBar} from './components/NavBar';
import {JoinDialog} from './components/JoinDialog';
import {Game} from './components/Game';
import {WaitingRoom} from './components/WaitingRoom';


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
    document.dispatchEvent(window.userGameRoomChangedEvent);
}
export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: "",
            errors: {},
        };

        document.addEventListener('window.user:changed', () => {
            if (this.state.user_id == null || window.user.id != this.state.user_id)
            {
                if (window.user.status == "waiting")
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
                }
            }
        });
    }

    render() {
        return (
            <div className="flex mx-auto mb-auto mt-20">
                <JoinDialog onJoin={this.joined.bind(this)} />
            </div>
        );
    }

    joined(data)
    {
        console.log(data);
        
        window.setUser(data.user);
    }
}

ReactDOM.createRoot(document.getElementById('navBar')).render(<NavBar />);
ReactDOM.createRoot(document.getElementById('app')).render(<App />);
