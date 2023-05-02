import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectCurrentUserId,
} from '../CurrentUser/currentUserSlice';
import {
    selectAnswerCount,
} from './gameSlice';
import {
    selectAllAnswerCards,
    pickAnswerCards,
} from '../Cards/cardsSlice';
import AnswerCard from '../Cards/AnswerCard';

export default function PlayerHand({ wrap }) {
    const currentUserId = useSelector(selectCurrentUserId);

    const answerCards = useSelector(selectAllAnswerCards);
    const answerCount = useSelector(selectAnswerCount);
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
        console.log("Selecting Answer cards");

        setProcessing(true);
        try {
            const response = await dispatch(pickAnswerCards(answers)).unwrap();
        }
        catch (error) {

        }
        setProcessing(false);
    }

    return (
        <>
            <button
                className={`w-36 btn btn-secondary btn-sm ml-1 ${picks >= answerCount ? "" : "btn-disabled"} ${processing ? "loading":""}`}
                onClick={handleAnswersSubmit}
            >
                {processing ? "" : "Pick"}
            </button>
            <div
                id="PlayerHand"
                className={wrap ?
                    "flex flex-rows flex-wrap w-full overflow-y-auto justify-start h-54 pb-2"
                    :
                    "flex flex-rows w-full overflow-auto justify-start h-54 pb-2"
                }
            >
                {answerCards.map(uac => (uac.user_id === currentUserId && (
                    <AnswerCard
                        key={uac.id}
                        text={uac.card && uac.card.text}
                        selected={uac.id in answers}
                        pick={uac.id in answers && answers[uac.id]}
                        of={answerCount}
                        onClick={() => handleAnswerSelect(uac.id)}
                    />
                )))}
            </div>
        </>
    )
}