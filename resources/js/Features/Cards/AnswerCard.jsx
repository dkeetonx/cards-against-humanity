export default function AnswerCard({ onClick, text, selectable = true, selected = false, pick, of}) {
    return (
        <div className="relative">
        <label
            className={selected ?
                `card shadow border border-black bg-white outline outline-accent outline-4 select-none text-black text-sm shrink-0 w-36 h-52 p-2 m-1 overflow-y-auto ${selectable?"cursor-pointer":""}`
                :
                `card shadow border border-black bg-white text-black select-none text-sm shrink-0 w-36 h-52 p-2 m-1 overflow-y-auto ${selectable?"cursor-pointer":""}`
            }
            onClick={() => onClick && onClick()}
        >
            <p>{text}</p>
        </label>
        {pick ?
                <p className="absolute text-black font-bold text-xl bottom-1 right-3">{pick}/{of}</p>
                :
                ""
            }
        </div>
    );
}