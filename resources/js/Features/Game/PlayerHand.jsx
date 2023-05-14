import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectCurrentUserId,
    selectHasFreeRedraw,
} from '../CurrentUser/currentUserSlice';
import {
    selectAnswerCount,
} from './gameSlice';
import {
    selectAllAnswerCards,
    pickAnswerCards,
    selectAllBlankCards,
} from '../Cards/cardsSlice';
import AnswerCard from '../Cards/AnswerCard';
import PlaceholderCard from '../Cards/PlaceholderCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { setShowRedrawModal } from '../Overlays/overlaysSlice';

export default function PlayerHand({ wrap }) {
    const currentUserId = useSelector(selectCurrentUserId);
    const hasFreeRedraw = useSelector(selectHasFreeRedraw);
    const answerCards = useSelector(selectAllAnswerCards);
    const answerCount = useSelector(selectAnswerCount);
    const blanks = useSelector(selectAllBlankCards);
    const dispatch = useDispatch();

    const [picks, setPicks] = useState(0);
    const [answers, setAnswers] = useState({});

    function handleAnswerSelect(uacId) {
        let newAnswers = Object.assign({}, answers);

        if (uacId in answers) {
            delete newAnswers[uacId];
            setAnswers(newAnswers);
        }
        else {
            if (picks >= answerCount) {

                let [maxId] = Object.entries(answers)
                    .reduce(([maxId, max], [k, v]) => v > max ? [k, v] : [maxId, max], [0, 0]);

                delete newAnswers[maxId];
                newAnswers[uacId] = picks;
            }
            else {
                newAnswers[uacId] = picks + 1;
            }
            setAnswers(newAnswers);
        }
        let last = 0;
        for (const o of Object.values(newAnswers).sort((a, b) => a - b)) {
            if (o - last > 1) {
                break;
            }
            last = o;
        }
        setPicks(last);
    }
    const [processing, setProcessing] = useState(false);
    async function handleAnswersSubmit(event) {
        event.preventDefault();

        setProcessing(true);
        try {
            const response = await dispatch(pickAnswerCards({ blanks, answers })).unwrap();
        }
        catch (error) {

        }
        setProcessing(false);
    }

    function handleRedrawHand(event) {
        event.preventDefault();

        dispatch(setShowRedrawModal(true));
    }

    return (
        <>
            <div className="flex flex-row space-x-2">
                <button
                    className={`w-36 btn btn-secondary btn-xs sm:btn-sm ml-1 mb-1 ${picks >= answerCount ? "" : "btn-disabled"} ${processing ? "loading" : ""}`}
                    onClick={handleAnswersSubmit}
                >
                    {processing ? "" : "Pick"}
                </button>
                <div className="tooltip" data-tip="Redraw Hand">
                    <button
                        className={"btn btn-square btn-xs sm:btn-sm " + (hasFreeRedraw ? "" : "btn-disabled")}
                        onClick={handleRedrawHand}
                    >
                        <FontAwesomeIcon icon={faStar} />
                    </button>
                </div>
            </div>
            <div
                id="PlayerHand"
                className={wrap ?
                    "flex flex-rows flex-wrap w-full overflow-y-auto justify-start h-54 pb-2"
                    :
                    "flex flex-rows w-full overflow-auto justify-start h-54 pb-2"
                }
            >
                {answerCards.filter(uac => uac.user_id == currentUserId && uac.status == "in_hand").map(uac => (
                    <AnswerCard
                        key={uac.id}
                        uac={uac}
                        selectable={true}
                        selected={uac.id in answers}
                        pick={uac.id in answers && answers[uac.id]}
                        of={answerCount}
                        onClick={() => handleAnswerSelect(uac.id)}
                    />
                ))}
                <PlaceholderCard className="invisible" />
                <PlaceholderCard className="invisible" />
            </div>
        </>
    )
}