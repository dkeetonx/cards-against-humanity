import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
    selectGameCode,
    selectGameId,
    selectGameStoreStatus,
    selectGameProgress,
    selectCurrentQuestionerId,
    selectOwner,
    selectCurrentQuestioner,
} from './gameSlice';
import { setShowRejoin } from '../Overlays/overlaysSlice';
import {
    selectCurrentUserId,
    selectPlayingStatus,
    selectCurrentUserReady,
} from '../CurrentUser/currentUserSlice';

import Countdown from './CountDown';

import PlayersList from '../Users/PlayersList';
import SpectatorsList from '../Users/SpectatorsList';
import PrestartUsersList from '../Users/PrestartUsersList';
import {
    fetchAnswerCards,
    fetchQuestionCards,
    selectAllQuestionCards,
    pickQuestionCard,
} from '../Cards/cardsSlice';
import QuestionCard from '../Cards/QuestionCard';
import PlayerHand from './PlayerHand';
import AnswerBoard from './AnswerBoard';
import StatusBoard from './StatusBoard';

export default function Game() {
    const [wrap, setWrap] = useState(true);
    const currentUserId = useSelector(selectCurrentUserId);

    const gameId = useSelector(selectGameId);
    const gameCode = useSelector(selectGameCode);
    const gameProgress = useSelector(selectGameProgress);
    const gameStoreStatus = useSelector(selectGameStoreStatus);
    const currentQuestionerId = useSelector(selectCurrentQuestionerId);
    const { playCode } = useParams();
    const playingStatus = useSelector(selectPlayingStatus);
    const currentUserReady = useSelector(selectCurrentUserReady);
    const questionCards = useSelector(selectAllQuestionCards);
    const currentQuestioner = useSelector(selectCurrentQuestioner);
    const owner = useSelector(selectOwner);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isOwner, setIsOwner] = useState(false);
    useEffect(() => {
        if (owner) {
            setIsOwner(owner.id == currentUserId);
        }
    }, [owner]);

    useEffect(() => {
        dispatch(setShowRejoin(false));

    }, [gameId, dispatch]);

    useEffect(() => {
        if (gameStoreStatus !== 'prestart' && playCode !== gameCode) {
            console.log(`navigating: gameCode = ${gameCode}, gameId = ${gameId}`);
            navigate(`/join/${playCode}`);
        }
    }, [gameStoreStatus, gameCode, navigate]);

    useEffect(() => {
        dispatch(fetchQuestionCards()).unwrap();
        dispatch(fetchAnswerCards()).unwrap();
    }, [gameProgress, playingStatus, dispatch]);

    const [isQuestioner, setIsQuestioner] = useState(false);
    useEffect(() => {
        if (currentQuestionerId === currentUserId) {
            setIsQuestioner(true);
        }
        else {
            setIsQuestioner(false);
        }
    }, [currentQuestionerId, currentUserId]);

    const [answering, setAnswering] = useState(false);
    useEffect(() => {
        if (playingStatus === "playing"
            && currentUserReady !== true
            && gameProgress === "answering"
            && currentQuestionerId !== currentUserId) {
            setAnswering(true);
        }
        else {
            setAnswering(false);
        }
    }, [playingStatus, gameProgress, currentQuestionerId])

    const [spectating, setIsSpectator] = useState(false);
    useEffect(() => {
        if (playingStatus == "spectating") {
            setIsSpectator(true);
        }
        else {
            setIsSpectator(false);
        }
    }, [playingStatus])

    const [questionCardId, setQuestionCardId] = useState(0);
    function handleSetQuestionCardId(newId) {
        if (newId === questionCardId) {
            setQuestionCardId(null);
        }
        else {
            setQuestionCardId(newId);
        }
    }

    const [processing, setProcessing] = useState(false);
    async function handleQuestionCardSubmit(event) {
        event.preventDefault();
        console.log("Selecting Question Card");

        setProcessing(true);
        try {
            const response = await dispatch(pickQuestionCard({
                user_question_card_id: questionCardId,
            })).unwrap();
        }
        catch (error) {

        }
        setProcessing(false);
    }


    if (playingStatus === "waiting") {
        return <div className="flex flex-col flex-grow">
            <div className="flex flex-row justify-center">
                <p>Waiting to be admitted to <span className="font-bold">{playCode}</span></p>
            </div>
        </div>
    }

    console.log("Game");
    console.log(questionCards);
    return (
        <>
            <div className="flex flex-col w-full h-full">
                <div className="w-full flex flex-row justify-center">
                    <Countdown isQuestioner={isQuestioner} onDeadline={() => ""} />
                </div>
                {gameProgress === "prestart" ?
                    <div className="w-full flex flex-col items-center mt-4 space-y-3 ">
                        <p>
                            {isOwner ?
                                "Press Start when everyone has joined."
                                :
                                `Waiting for ${owner.name} to start the game.`
                            }
                        </p>
                        <PrestartUsersList />
                    </div>
                    :
                    <div className="flex flex-col h-full p-2">
                        <div className="h-54 shrink-0 flex flex-row overflow-x-auto overflow-y-clip pb-4">

                            {questionCards.map((uqc) => (
                                gameProgress === "choosing_qcard" ?
                                    (isQuestioner ?
                                        <QuestionCard
                                            key={uqc.id}
                                            text={uqc.card && uqc.card.text}
                                            selectable={true}
                                            selected={uqc.id === questionCardId}
                                            onClick={() => handleSetQuestionCardId(uqc.id)}
                                        />
                                        :
                                        <QuestionCard
                                            key={uqc.id}
                                            selected={false}
                                        />
                                    )
                                    :
                                    <QuestionCard
                                        key={uqc.id}
                                        text={uqc.card && uqc.card.text}
                                        selected={false}
                                    />

                            ))}
                            <div className="w-20 shrink-0 self-end"></div>
                        </div>
                        {isQuestioner && gameProgress === "choosing_qcard" &&
                            <button
                                className={`w-36 btn btn-secondary btn-sm ml-1 ${questionCardId === 0 ? "btn-disabled" : ""} ${processing ? "loading" : ""}`}
                                onClick={handleQuestionCardSubmit}
                            >
                                {processing ? "" : "Pick"}
                            </button>
                        }


                        <div className="flex flex-row items-center">
                            <input type="checkbox"
                                className="toggle m-1"
                                checked={!wrap}
                                onChange={() => setWrap(!wrap)}
                            />
                            <div className="">
                                <p>
                                    {gameProgress === "choosing_qcard" &&
                                        (isQuestioner ?
                                            "Choose a Black Card."
                                            :
                                            `Waiting on ${currentQuestioner.name}`
                                        )
                                    }
                                    {gameProgress === "answering" &&
                                        (isQuestioner ?
                                            "The players are choosing a response."
                                            :
                                            "Pick a response."
                                        )
                                    }
                                    {gameProgress === "picking_winner" &&
                                        (isQuestioner ?
                                            "Pick the winner!"
                                            :
                                            `${currentQuestioner.name} is picking`
                                        )
                                    }
                                    {gameProgress === "revealing_winner" &&
                                        (isQuestioner ?
                                            "Tap Next to continue."
                                            :
                                            "The winner has been revealed."
                                        )
                                    }
                                </p>
                            </div>
                        </div>
                        {answering && !currentUserReady &&
                            <PlayerHand wrap={wrap} />
                        }
                        {(spectating || isQuestioner || currentUserReady) && gameProgress === "answering" ?
                            <StatusBoard wrap={wrap} />
                            : ""
                        }
                        {gameProgress === "picking_winner" &&
                            <AnswerBoard wrap={wrap} isQuestioner={isQuestioner} />
                        }
                        {gameProgress === "revealing_winner" &&
                            <AnswerBoard wrap={wrap} isQuestioner={isQuestioner} reveal={true} />
                        }
                    </div>
                }
            </div>
            <PlayersList />
            <SpectatorsList />
        </>
    );
}
