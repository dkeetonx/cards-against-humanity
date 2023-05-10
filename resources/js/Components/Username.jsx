export default function Username({ user = {name:""} }) {
    return (
        <span className="font-bold underline">{user.name}</span>
    );
}