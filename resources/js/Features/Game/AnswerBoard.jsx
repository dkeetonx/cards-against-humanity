import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectAnswerCardsInPlay,
    revealAnswerCard,
} from '../Cards/cardsSlice';
import {
    selectAnswerCount,
    selectWinningGroupId,
    submitWinner,
    selectCurrentQuestionerId,
} from './gameSlice';
import { selectCurrentUserId } from '../CurrentUser/currentUserSlice';
import { selectAllPlaying, selectAllUsers } from '../Users/usersSlice';
import AnswerCard from '../Cards/AnswerCard';

import pseudoRandom from 'pseudo-random';

export default function AnswerBoard({ wrap, isQuestioner, reveal = false }) {
    const winningGroupId = useSelector(selectWinningGroupId);
    const currentQuestionerId = useSelector(selectCurrentQuestionerId);
    const currentUserId = useSelector(selectCurrentUserId);
    const answerCards = useSelector(selectAnswerCardsInPlay);
    const answerCount = useSelector(selectAnswerCount);
    const users = useSelector(selectAllUsers);
    const dispatch = useDispatch();

    const [groupIds, setGroupIds] = useState([]);
    const [groups, setGroups] = useState({});
    useEffect(() => {
        let newGroups = {};
        for (const uac of answerCards) {
            if (uac.user_id in newGroups) {
                newGroups[uac.user_id].cards.push(uac);
            }
            else {
                newGroups[uac.user_id] = {
                    user: users.reduce((found, user) => user.id === uac.user_id ? user : found, {}),
                    cards: [uac]
                };
            }
        }
        const newGroupIds = shuffle(Object.keys(newGroups), currentQuestionerId);
        setGroupIds(newGroupIds);
        setGroups(newGroups);
    }, [answerCards, currentQuestionerId, users]);

    async function handleRevealCard(uac) {

        try {
            const response = await dispatch(revealAnswerCard(uac)).unwrap();
        }
        catch (error) {
            console.log(error);
        }
    }
    const [winnerGroup, setWinnerGroup] = useState(0);
    function handleSetWinnerGroup(id) {
        if (isQuestioner) {
            setWinnerGroup(id);
        }
    }

    const [processing, setProcessing] = useState(false);
    async function handleSubmitWinner(event) {
        console.log("Submitting winner!");

        setProcessing(true);
        try {
            const response = await dispatch(submitWinner(winnerGroup)).unwrap();
        }
        catch (error) {
            console.log(error);
        }
        setProcessing(false);
    }
    return (
        <>
            {isQuestioner &&
                <button
                    className={`w-36 btn btn-secondary btn-xs sm:btn-sm ml-1 mb-1 ${winnerGroup ? "" : "btn-disabled"} ${processing ? "loading" : ""}`}
                    onClick={handleSubmitWinner}
                >
                    {processing ? "" : "Pick"}
                </button>
            }
            <div id="answerBoard" className={wrap ?
                "flex flex-rows flex-wrap w-full overflow-y-auto justify-start h-54 pb-2"
                :
                "flex flex-rows w-full overflow-auto justify-start h-54 space-x-2 pb-2"
            }>
                {groupIds.map(user_id => (
                    <div key={user_id} className={`relative card flex flex-row ${answerCount > 1 ? "mt-1 border-t-4 border-primary" : ""}`}>
                        {groups[user_id].cards.map(uac => (
                            uac.revealed ?
                                <AnswerCard
                                    key={uac.id}
                                    uac={uac}
                                    selectable={currentUserId == currentQuestionerId}
                                    selected={winnerGroup == uac.user_id}
                                    pick={uac.order}
                                    of={answerCount}
                                    onClick={() => handleSetWinnerGroup(user_id)}
                                />
                                :
                                <AnswerCard
                                    key={uac.id}
                                    onClick={() => handleRevealCard(uac)}
                                    selectable={currentUserId == currentQuestionerId}
                                />
                        ))}
                        {reveal &&
                            <div className="absolute flex flex-col justify-between items-center w-full h-full left-0 top-0">
                                <p className="px-1 bg-accent rounded-btn text-accent-content font-semibold w-28 text-xs text-center truncate">
                                    {groups[user_id].user.name}
                                </p>
                                {winningGroupId == user_id &&
                                    <p className="bg-primary mb-4 text-primary-content w-full shadow px-1 text-sm text-center">
                                        Winner!
                                    </p>
                                }
                            </div>
                        }
                    </div>
                ))}
                <div className="w-56 h-32 shrink-0 self-end"></div>
            </div>
        </>
    )
}

function shuffle(array, seed) {
    console.log("shuffling");
    if (array.length < 2)
        return array;

    const prng = pseudoRandom(seed);

    for (let i = array.length - 1; i > 0; i--) {
        const random = prng.random();
        const j = Math.floor(Math.abs(random) * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}
