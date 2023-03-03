import React from 'react'
import TextInput from './TextInput';
import { useGameRoom } from './AppHooks';

export default function LeaveModal(props) {
    let gameRoom = useGameRoom();
/*
    constructor(props) {
        super(props);
        if (window.game_room) {
            this.state = {room_code: window.game_room.room_code};
        }
        else {
            this.state = {room_code: null};
        }

        this.handleClick = this.handleClick.bind(this, this.setRoomCode.bind(this));
    }

    componentDidMount() {
        if (window.game_room)
            this.setState({room_code: window.game_room.room_code});

        document.addEventListener('window.game_room:changed', this.setRoomCode);
    }
    componentWillUnmount() {
        document.removeEventListener('window.game_room:changed', this.setRoomCode);
    }

    setRoomCode() {
        this.setState({room_code: window.game_room.room_code});
    }
*/
    function handleClick() {
        console.log("leaving");
        window.axios.post('/leave', {
        })
        .then((response) => {
            try {
                window.setGameRoom(response.data);
            } catch (e)
            {
                console.log(e);
            }
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response.data);
            } else if (error.request)
            {
                console.log(error.request);
            } else {
                throw error;
            }
        });
    }

        return (
            <div>
                <input type="checkbox" className="modal-toggle" id="leave-modal" /> {/*+ (!gameRoom && "-disabled")} */}
                <label className="modal cursor-pointer" htmlFor="leave-modal">
                    <label className="modal-box relative">
                        <label htmlFor="leave-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                        <h3 className="font-bold text-lg">Are you sure you want to leave?</h3>
                        <p className="py-4">You are currently playing in game <span className="uppercase">{gameRoom.room_code}</span>. This action will leave that game.</p>
                        <div className="modal-action">
                            <label htmlFor="leave-modal" className="btn" onClick={handleClick}>Leave</label>
                        </div>
                    </label>
                </label>
            </div>
        );
}