import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import TextInput from '../../Components/TextInput'
import Range from '../../Components/Range'
import Toggle from '../../Components/Toggle'
import { selectGameId, selectGameCode, createGame } from './gameSlice'
import { setShowRejoin } from '../Overlays/overlaysSlice';
import { selectCurrentUserName } from '../CurrentUser/currentUserSlice'

export default function Create(props) {
    const gameId = useSelector(selectGameId);
    const gameCode = useSelector(selectGameCode);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (gameId) {
            dispatch(setShowRejoin(true));
        }
    }, [gameId, dispatch]);

    const userName = useSelector(selectCurrentUserName);

    const [nameError, setNameError] = useState(null);

    const [nameBox, setNameBox] = useState(userName);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setNameBox(userName);
        setNameError(null);
    }, [userName]);


    const [formData, setFormData] = useState({
        max_player_count: 16,
        has_waiting_room: true,
        two_question_cards: true,
        allow_hand_redraw: true,
        question_card_timer: 2,
        answer_card_timer: 8,
    });

    const [formErrors, setFormErrors] = useState(
        Object.keys(formData).reduce((pre, key) => ({ ...pre, [key]: null }), {})
    );


    function handleChange(event) {
        if (event.target.type === "checkbox") {
            setFormData({
                ...formData,
                [event.target.name]: !formData[event.target.name]
            });
        }
        else {
            setFormData({
                ...formData,
                [event.target.name]: event.target.value
            });
        }
        setFormErrors({
            ...formErrors,
            [event.target.name]: null,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        console.log("Create Submitted");

        setProcessing(true);
        try {
            const response = await dispatch(createGame({
                ...formData,
                name: nameBox,
            })).unwrap();
            navigate(`/play/${response.room_code}`);
        }
        catch (error) {
            if (error.errors) {
                console.log(error.errors);

                if (error.errors["name"][0]) {
                    setNameError(error.errors["name"][0]);
                }

                setFormErrors(Object.keys(error.errors).reduce((pre, key) => {
                    if (key in formErrors) {
                        return { ...pre, [key]: error.errors[key][0] };
                    }
                    else {
                        return pre;
                    }
                }, formErrors));
            }
        }
        setProcessing(false);
    }

    return (
        <div className="flex flex-grow flex-col items-center">
            <form onSubmit={handleSubmit}
                className="flex grow flex-col items-start space-y-6 w-64">
                <h2 className="text-3xl font-bold">Create a Game</h2>
                <TextInput id="name" name="name" value={nameBox} label="Your Nickname"
                    className="" maxLength="32"
                    tooltipText={nameError}
                    tooltipExtraClasses="tooltip-top tooltip-warning"
                    inputExtraClasses={(nameError && "input-warning border-2")}
                    onChange={(event) => { setNameBox(event.target.value); setNameError(null) }} />

                <Range
                    min="2" max="24" value={formData.max_player_count}
                    label="Players" name="max_player_count"
                    valueLabelExtraClasses="w-16"
                    tooltipText={formErrors.max_player_count}
                    tooltipExtraClasses="tooltip-top tooltip-warning"
                    inputExtraClasses={(formErrors.max_player_count && "input-warning border-2")}
                    onChange={handleChange}
                />

                <Toggle label="Screen New Players" name="has_waiting_room"
                    checked={!formData.has_waiting_room}
                    valueLabelExtraClasses="w-36"
                    tooltipText={formErrors.has_waiting_room}
                    tooltipExtraClasses="tooltip-top tooltip-warning"
                    inputExtraClasses={(formErrors.has_waiting_room && "input-warning border-2")}
                    onChange={handleChange}
                />

                <Toggle label="Two Question Cards" name="two_question_cards"
                    checked={formData.two_question_cards}
                    valueLabelExtraClasses="w-36"
                    tooltipText={formErrors.two_question_cards}
                    tooltipExtraClasses="tooltip-top tooltip-warning"
                    inputExtraClasses={(formErrors.two_question_cards && "input-warning border-2")}
                    onChange={handleChange}
                />

                <Toggle label="One Free Redraw" name="allow_hand_redraw"
                    checked={formData.allow_hand_redraw}
                    valueLabelExtraClasses="w-36"
                    tooltipText={formErrors.allow_hand_redraw}
                    tooltipExtraClasses="tooltip-top tooltip-warning"
                    inputExtraClasses={(formErrors.allow_hand_redraw && "input-warning border-2")}
                    onChange={handleChange}
                />

                <Range
                    min="1" max="10" value={formData.question_card_timer}
                    label="Question Timer" name="question_card_timer"
                    valueLabelExtraClasses="w-24 px-2"
                    formatValue={(v) => `${v} min`}
                    tooltipText={formErrors.question_card_time}
                    tooltipExtraClasses="tooltip-top tooltip-warning"
                    inputExtraClasses={(formErrors.question_card_timer && "input-warning border-2")}
                    onChange={handleChange}
                />

                <Range
                    min="1" max="20" value={formData.answer_card_timer}
                    label="Answer Timer" name="answer_card_timer"
                    valueLabelExtraClasses="w-24 px-2"
                    formatValue={(v) => `${v} min`}
                    tooltipText={formErrors.answer_card_timer}
                    tooltipExtraClasses="tooltip-top tooltip-warning"
                    inputExtraClasses={(formErrors.answer_card_timer && "input-warning border-2")}
                    onChange={handleChange}
                />

                <div className="card-actions justify-end">
                    <button type="submit" name="create"
                        className={`btn btn-primary w-20 ${(processing && "loading")}`} >
                        {processing ? "" : "Create"}
                    </button>
                </div>

            </form>
            <div className="w-32 h-32 shrink-0 content-end"></div>
        </div>
    );
}