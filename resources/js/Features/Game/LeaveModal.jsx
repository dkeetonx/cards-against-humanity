import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import TextInput from '../../Components/TextInput';
import { selectGameCode, leaveGame } from './gameSlice';

import { setShowLeaveModal, selectShowLeaveModal, setShowRejoin } from '../Overlays/overlaysSlice';

export default function LeaveModal(props) {
    const gameCode = useSelector(selectGameCode);
    const show = useSelector(selectShowLeaveModal);
    const dispatch = useDispatch();

    async function handleLeave() {
        console.log("leaving");
        dispatch(setShowLeaveModal(false));
        dispatch(setShowRejoin(false));
        await dispatch(leaveGame()).unwrap();
    }

    return (
        <div>
            <input type="checkbox" className="modal-toggle" id="leave-modal" readOnly checked={show} />
            <label className="modal cursor-pointer" onClick={() => dispatch(setShowLeaveModal(false))}>
                <label className="modal-box relative">
                    <label className="btn btn-sm btn-circle absolute right-2 top-2"
                        onClick={() => dispatch(setShowLeaveModal(false))}>✕</label>
                    <h3 className="font-bold text-lg">Are you sure you want to leave?</h3>
                    <p className="py-4">
                        You are currently playing in game <span className="uppercase">{gameCode}</span>.
                        This action will leave that game.</p>
                    <div className="modal-action">
                        <label className="btn" onClick={handleLeave}>Leave</label>
                    </div>
                </label>
            </label>
        </div>
    );
}