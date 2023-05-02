export default function AnswerCard({ name }) {
    return (
        <div className="card shadow border text-sm shrink-0 w-36 h-52 p-2 m-1 flex flex-col justify-center">
            <p className="w-full mb-2">Waiting on...</p>
            <p className="w-full font-bold underline">{name}</p>
        </div>
    );
}