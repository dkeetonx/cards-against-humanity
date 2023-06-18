import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectCurrentQuestionerId,
} from './gameSlice';
import { selectAllPlaying } from '../Users/usersSlice';
import AnswerCard from '../Cards/AnswerCard';
import PlaceholderCard from '../Cards/PlaceholderCard';

export default function StatusBoard({ wrap }) {
    const currentQuestionerId = useSelector(selectCurrentQuestionerId);
    const players = useSelector(selectAllPlaying);
    
    return (
        <div className={wrap ?
            "flex flex-rows flex-wrap w-full overflow-y-auto justify-start h-54 pb-2"
            :
            "flex flex-rows w-full overflow-auto justify-start h-54 pb-2"
        }>
            {players.filter(p => p.id != currentQuestionerId).map(player => {
                    if (player.ready) {
                        return <AnswerCard key={player.id} selectable={false} />;
                    }
                    else {
                        return <PlaceholderCard user={player} key={player.id} />
                    }
            })}
            <div className="w-56 h-32 shrink-0 self-end"></div>
        </div>
    )
}