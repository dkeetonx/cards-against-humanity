export default function AnswerCard({ onClick, text, selected = false, pick, of}) {
    return (
        <label
            className={selected ?
                "relative card shadow border border-black bg-white outline outline-accent outline-4 text-black text-sm shrink-0 w-36 h-52 p-2 m-1"
                :
                "relative card shadow border border-black bg-white text-black text-sm shrink-0 w-36 h-52 p-2 m-1"
            }
            onClick={() => onClick && onClick()}
        >
            <p>{text}</p>
            {pick ?
                <p className="absolute font-bold text-xl bottom-1 right-3">{pick}/{of}</p>
                :
                ""
            }
        </label>
    );
}