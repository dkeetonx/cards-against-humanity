
export default function Avatar({ user, className }) {
    const names = user.name.split(' ');
    const abbreviation = names.map(name => name.charAt(0)).join("");

    return (
        <div className="avatar placeholder">
            <div className={`bg-green-600 text-white rounded-full border-none ${className} `}>
                <span className="">{abbreviation}</span>
            </div>
        </div>
    );
}