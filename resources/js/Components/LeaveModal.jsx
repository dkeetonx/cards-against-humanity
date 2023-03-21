import React, { useContext } from 'react'
import TextInput from './TextInput';
import { GameRoomContext, useGameRoom } from './AppHooks';

export default function LeaveModal(props) {
    const gameRoom = useContext(GameRoomContext);

    function handleClick() {
        console.log("leaving");
        window.axios.post('/leave', {
        })
            .then((response) => {
                try {
                    App.setGameRoom(response.data);
                } catch (e) {
                    console.log(e);
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                } else if (error.request) {
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