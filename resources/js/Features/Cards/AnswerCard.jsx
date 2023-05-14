import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectBlankById,
    upsertBlankCard,
    removeBlankCard,
} from './cardsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck
} from '@fortawesome/free-solid-svg-icons';

export default function AnswerCard({ uac, onClick, selectable = true, selected = false, pick, of }) {
    const blankCard = useSelector(state => selectBlankById(state, uac?.id));
    const [isDirty, setIsDirty] = useState(false);
    const [customAnswer, setCustomAnswer] = useState("");
    const [charsRemaining, setCharsRemaining] = useState(100);
    const [saveTimer, setSaveTimer] = useState(null);
    const dispatch = useDispatch();

    useState(() => {
        if (blankCard) {
            setCustomAnswer(blankCard.text);
        }
    }, [blankCard]);

    useEffect(() => {
        clearTimeout(saveTimer);
        setSaveTimer(
            setTimeout(() => {
                console.log("saving custom answer card");
                if (customAnswer.length > 1) {
                    dispatch(upsertBlankCard({
                        user_answer_card_id: uac.id,
                        user_id: uac.user_id,
                        text: customAnswer,
                    }));
                }
                else if (blankCard) {
                    dispatch(removeBlankCard(blankCard.user_answer_card_id));
                }
                setIsDirty(false);
            }, 1000)
        );

    }, [customAnswer]);

    function handleChange(event) {
        const newCharsRemaining = 100 - event.target.value.length;

        if (newCharsRemaining < 0) {
            return;
        }
        setCharsRemaining(newCharsRemaining);
        setCustomAnswer(event.target.value);
        setIsDirty(true);
    }

    return (
        <div className="relative">
            <label
                className={selected ?
                    `card shadow border border-black bg-white outline outline-accent outline-4 select-none text-black text-sm shrink-0 w-40 h-52 p-2 m-1 overflow-y-auto ${selectable ? "cursor-pointer" : ""}`
                    :
                    `card shadow border border-black bg-white text-black select-none text-sm shrink-0 w-40 h-52 p-2 m-1 overflow-y-auto ${selectable ? "cursor-pointer" : ""}`
                }
                onClick={() => onClick && onClick()}
            >
                {!uac ?
                    <p></p>
                    :
                    uac.answer_card_id ?
                            <p>{uac.card ? uac.card.text : ""}</p>
                            :
                            <>
                                <textarea
                                    placeholder="Write your own answer."
                                    className="textarea p-0 bg-white text-black rounded-box"
                                    rows="8"
                                    maxLength={100}
                                    onChange={handleChange}
                                    value={customAnswer}
                                />
                                {(blankCard?.user_answer_card_id && !isDirty) ?
                                    <p><input type="checkbox" checked={true} className="checkbox checkbox-success" readOnly /></p>
                                    : <p>{charsRemaining}<input type="checkbox" checked={true} className="checkbox checkbox-success invisible" readOnly /></p>
                                }
                            </>
                    
                }
            </label>
            {pick ?
                <p className="absolute text-black font-bold text-xl bottom-1 right-3">{pick}/{of}</p>
                :
                ""
            }
        </div>
    );
}