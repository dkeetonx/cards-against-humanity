import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import TextInput from '../../Components/TextInput'
import Range from '../../Components/Range'
import Toggle from '../../Components/Toggle'
import { selectGameId, selectGameCode, createGame } from './gameSlice'
import { selectCurrentUserName } from '../CurrentUser/currentUserSlice'
import { selectAllPacks } from '../Cards/packsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faInfinity,
    faAnglesDown,
    faAnglesUp,
} from '@fortawesome/free-solid-svg-icons';

export default function Create(props) {
    const gameId = useSelector(selectGameId);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userName = useSelector(selectCurrentUserName);

    const [nameError, setNameError] = useState(null);

    const [nameBox, setNameBox] = useState(userName);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setNameBox(userName);
        setNameError(null);
    }, [userName]);


    const [formData, setFormData] = useState({
        max_player_count: 24,
        winning_score: 5,
        has_waiting_room: false,
        two_question_cards: false,
        allow_hand_redraw: true,
        question_card_timer: 1,
        answer_card_timer: 2,
        blank_card_rate: 15,
    });

    const [formErrors, setFormErrors] = useState(
        Object.keys(formData).reduce((pre, key) => ({ ...pre, [key]: null }), {})
    );
    const allPacks = useSelector(selectAllPacks);
    const [packs, setPacks] = useState([]);

    useEffect(() => {
        setPacks(allPacks.map((pack) => ({ ...pack, enabled: pack.official })));
    }, [allPacks, useState])

    const [collapsed, setCollapsed] = useState(true);
    const [filteredPacks, setFilteredPacks] = useState([]);
    useEffect(() => {
        if (collapsed && packs.length > 0) {
            setFilteredPacks([packs[0]]);
        }
        else {
            setFilteredPacks(packs);
        }
    }, [packs, collapsed]);

    function togglePack(id) {
        setPacks(packs.map((pack) => pack.id == id ? { ...pack, enabled: !pack.enabled } : pack));
    }

    function handleChange(event) {
        event.preventDefault();

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
                packs,
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
        <div className="flex flex-grow flex-col items-center h-full overflow-auto pt-4 sm:pt-8">
            <form onSubmit={handleSubmit}
                className="flex grow flex-col items-start space-y-6 w-64">
                <h2 className="text-2xl font-bold">Create a Game</h2>
                <TextInput id="name" name="name" value={nameBox} label="Your Nickname"
                    className="" maxLength="32"
                    tooltipText={nameError}
                    tooltipExtraClasses="tooltip-top tooltip-warning"
                    inputExtraClasses={(nameError && "input-warning border-2")}
                    onChange={(event) => { setNameBox(event.target.value); setNameError(null) }} />

                <div className="card border p-2 flex flex-col space-y-2 w-full">
                    <p className="absolute label-text badge text-primary-content bg-primary -top-2 left-2">
                        Settings
                    </p>

                    <Range
                        min="2" max="24" value={formData.max_player_count}
                        label="Players" name="max_player_count"
                        valueLabelExtraClasses="w-16"
                        tooltipText={formErrors.max_player_count}
                        tooltipExtraClasses="tooltip-top tooltip-warning"
                        inputExtraClasses={(formErrors.max_player_count && "input-warning border-2")}
                        onChange={handleChange}
                    />

                    <Range
                        min="0" max="30" value={formData.winning_score}
                        label="Points" name="winning_score"
                        valueLabelExtraClasses="w-16"
                        formatValue={(v) => v > 0 ? v : <FontAwesomeIcon icon={faInfinity} />}
                        tooltipText={formErrors.winning_score}
                        tooltipExtraClasses="tooltip-top tooltip-warning"
                        inputExtraClasses={(formErrors.winning_score && "input-warning border-2")}
                        onChange={handleChange}
                    />

                    <Toggle label="Screen Joining Players" name="has_waiting_room"
                        checked={formData.has_waiting_room}
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

                    <Range
                        min="1" max="25" value={formData.blank_card_rate}
                        label="Blank Card Rate" name="blank_card_rate"
                        valueLabelExtraClasses="w-24 px-2"
                        formatValue={(v) => `${v}%`}
                        tooltipText={formErrors.blank_card_rate}
                        tooltipExtraClasses="tooltip-top tooltip-warning"
                        inputExtraClasses={(formErrors.blank_card_rate && "input-warning border-2")}
                        onChange={handleChange}
                    />
                </div>

                <div className="relative w-full card border">
                    <p className="absolute label-text badge text-primary-content bg-primary -top-2 left-2">
                        Select Packs
                    </p>
                    <div className="w-full flex flex-col divide-y px-1 pt-2">
                        {filteredPacks.map((pack) => (
                            <label
                                key={pack.id}
                                className={`w-full p-2 cursor-pointer`}
                                htmlFor={`pack[${pack.id}]`}
                            >
                                <p className="">{pack.name}</p>
                                <div className="w-full flex flex-row justify-between">
                                    <input
                                        type="checkbox"
                                        id={`pack[${pack.id}]`}
                                        name={`pack[${pack.id}]`}
                                        className="toggle toggle-primary"
                                        checked={pack.enabled}
                                        onChange={() => togglePack(pack.id)}
                                    />
                                    <p>{pack.q_count}/{pack.a_count}</p>
                                </div>
                            </label>
                        ))}
                        <div>
                            {collapsed ?
                                <label className="h-8 w-full card"></label>
                                :
                                <label className="btn bg-base-100 border-none btn-sm rounded-t-none w-full text-base-content card"
                                    onClick={() => setCollapsed(!collapsed)}
                                >
                                    <FontAwesomeIcon icon={faAnglesUp} />
                                </label>
                            }
                        </div>
                    </div>
                    {collapsed ?
                        <div className="absolute w-full h-full top-0 left-0 flex flex-col">
                            {collapsed ?
                                <div className="bg-gradient-to-t from-base-100 flex-grow">

                                </div>
                                :
                                ""
                            }
                            <label className="btn bg-base-100 border-none btn-sm rounded-t-none w-full text-base-content card"
                                onClick={() => setCollapsed(!collapsed)}
                            >
                                <FontAwesomeIcon icon={faAnglesDown} />
                            </label>
                        </div>
                        : ""
                    }
                </div>
                <div className="card-actions justify-end">
                    <button type="submit" name="create"
                        className={`btn btn-primary w-20 ${processing ? "loading" : ""}`} >
                        {processing ? "" : "Create"}
                    </button>
                </div>

            </form>
            <div className="w-full h-44 shrink-0 self-end"></div>
        </div>
    );
}