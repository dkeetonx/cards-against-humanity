import React, { useState, useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { selectGameId, selectGameCode, createGame } from './gameSlice'
import TextInput from '../../Components/TextInput';

export default function Timer({ className }) {
    const gameId = useSelector(selectGameId);
    const [input, setInput] = useState(null);
    const [copied, setCopied] = useState(false);

    const gameCode = useSelector(selectGameCode);
    const [shareableUrl, setShareableUrl] = useState("");
    useEffect(() => {
        setShareableUrl(`${window.location.origin}/join/${gameCode}`);
    }, [gameCode]);

    function handleCopy(timeout) {
        input?.select();
        setCopied(true);
        setTimeout(() => setCopied(false), timeout * 1000);
    }

    return (
        <div className={className}>
            <div className="dropdown">
                <CopyToClipboard text={shareableUrl} onCopy={() => handleCopy(4)}>
                    <label tabIndex={0} className="uppercase font-mono font-bold p-2 cursor-pointer">
                        {gameCode}
                    </label>
                </CopyToClipboard>
                <div tabIndex={0} className="dropdown-content bg-base-200 text-base-content rounded-btn shadow mt-3 p-2 py-6 space-y-2 -left-8 w-64">
                    <div className={`${copied && "tooltip tooltip-open tooltip-bottom"} flex flex-col`}
                        data-tip="Copied to clipboard."
                    >
                        <TextInput label="Share" value={shareableUrl}
                            inputRef={(el) => setInput(el)}
                            inputExtraClasses="w-56 text-xs input-sm sm:text-md sm:input-md"
                            onChange={()=>""}
                        >
                        </TextInput>
                    </div>
                    <CopyToClipboard text={shareableUrl} onCopy={() => handleCopy(10)}>
                        <span className={`btn btn-secondary mt-3 ${copied && "btn-disabled"}`}>
                            Copy
                        </span>
                    </CopyToClipboard>
                </div>
            </div>
        </div>
    );
}