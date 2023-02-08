import './bootstrap';
import '../css/app.css';

import ReactDOM from 'react-dom/client';

import {JoinDialog} from './components/JoinDialog';

ReactDOM.createRoot(document.getElementById('app')).render(
    <JoinDialog />
);