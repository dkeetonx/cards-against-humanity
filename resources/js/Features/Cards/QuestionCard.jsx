
export default function QuestionCard({ onClick, text, selectable = false, selected = false }) {

    function formatText(t) {
        if (!t) return t;
        return t.replace(/_/sg, "_____");
    }
    return (
        <label
            className={`card bg-black text-white border border-base-300 select-none text-sm shrink-0 w-40 h-52 p-2 m-1 flex flex-col justify-between overflow-y-auto ${selectable ? "cursor-pointer":""} ${selected ? "outline outline-4 outline-accent":""}`}
            onClick={() => onClick && onClick()}
        >
            <p className="">{formatText(text)}</p>
        </label>
    );
}