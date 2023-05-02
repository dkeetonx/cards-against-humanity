
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home(props) {
    return (
        <div className="flex flex-col">
            <Link to="/create" className="btn btn-link">Create</Link>
            <Link to="/join" className="btn btn-link">Join</Link>
        </div>
    );
}