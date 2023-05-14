import { useSelector } from 'react-redux';
import {
    selectCurrentUserId,
} from '../CurrentUser/currentUserSlice';
import {
    selectCurrentQuestionerId
} from '../Game/gameSlice';

export default function Questioning(props) {
    const userId = useSelector(selectCurrentUserId);
    const questionerId = useSelector(selectCurrentQuestionerId);

    if (userId !== questionerId) {
        return null;
    }

    return (
        <div className="absolute bottom-0 left-0 w-screen bg-accent text-accent-content text-center">
            You are the Czar!
        </div>
    );
}
