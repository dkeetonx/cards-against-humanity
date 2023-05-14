import { Link } from 'react-router-dom';

export default function Home(props) {
    return (
        <div className="flex flex-col items-center sm:pt-8 w-full overflow-auto">
            <h2 className="text-xl font-bold px-2">Cards Against Humanity Online!</h2>
            <div className="flex flex-col md:flex-row items-center md:justify-center md:items-start ">
                <div className="card w-64 sm:w-80 h-60 bg-base-300 shadow-lg my-2 sm:m-4">
                    <div className="card-body">
                        <h2 className="card-title">Create a game.</h2>
                        <p>Play online with your friends. Create a private game and share the game code.</p>
                        <div className="card-actions justify-end">
                            <Link to="/create" className="btn btn-accent">Create a Game</Link>
                        </div>
                    </div>
                </div>
                <div className="card w-64 sm:w-80 h-60 bg-base-300 shadow-lg my-2 sm:m-4">
                    <div className="card-body">
                        <h2 className="card-title">Join a game.</h2>
                        <p>Use your a 4 digit game code to join a game!</p>
                        <div className="card-actions justify-end">
                            <Link to="/join" className="btn btn-primary">Join a Game</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}