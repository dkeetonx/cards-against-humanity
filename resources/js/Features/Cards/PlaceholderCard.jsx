import Username from "../../Components/Username";

export default function PlaceholderCard({ user = {name:""}, className=""}) {
    return (
        <div className={`card shadow border text-sm shrink-0 w-40 h-52 p-2 m-1 flex flex-col justify-center ${className}`}>
            <p className="w-full mb-2">Waiting on...</p>
            <p className="w-full"><Username user={user} /></p>
        </div>
    );
}