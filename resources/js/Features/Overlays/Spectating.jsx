import { useSelector, useDispatch } from 'react-redux';
import {
    selectPlayingStatus,
    updateCurrentUser,
} from '../CurrentUser/currentUserSlice';

export default function Spectating(props) {
    const playingStatus = useSelector(selectPlayingStatus);
    const dispatch = useDispatch();

    if (playingStatus !== "spectating") {
        return null;
    }

    return (
        <div className="absolute bottom-0 left-0 w-screen bg-success text-success-content text-center">
            You are spectating. <button
                className="btn btn-primary btn-xs py-0"
                onClick={() => dispatch(updateCurrentUser({ playing_status: "playing" }))}>Play</button>
        </div>
    );
}
