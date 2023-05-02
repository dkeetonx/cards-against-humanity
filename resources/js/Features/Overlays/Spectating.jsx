import { useSelector } from 'react-redux';
import { selectPlayingStatus } from '../CurrentUser/currentUserSlice';

export default function Spectating(props) {
    const playingStatus = useSelector(selectPlayingStatus);

    if (playingStatus !== "spectating")
    {
        return null;
    }

    return (
        <div className="absolute bottom-0 left-0 w-screen bg-success text-success-content text-center">
                Spectating
        </div>
    );
}
