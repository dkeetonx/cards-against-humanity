import React, { useState, useEffect, createContext, useSyncExternalStore } from 'react'

export let App = {
    user: null,
    gameRoom: null,
    navigation: null,
};

App.user = {
    id: null,
    name: "",
    game_room_id: null,
    status: "nothing",
};

App.setUser = (user_data) => {

    if (user_data.id != App.user.id) {

        if (App.user.id) {
            console.log(`stopListening App.Models.User.${App.user.id}`)
            window.Echo.private(`App.Models.User.${App.user.id}`)
                .stopListening('UserChangedOnServer', App.setUser);
        }

        console.log(`initializing echo App.Models.User.${user_data.id}`);
        window.Echo.private(`App.Models.User.${user_data.id}`)
            .listen('UserChangedOnServer', App.setUser);
    }

    App.user = user_data;
    console.log("setUser");
    window.dispatchEvent(new Event("App.user:changed"));

}

export const UserContext = createContext(null);

export function useUser() {
    const user = useSyncExternalStore((callback) => {
        if (!App.user.id) {
            window.axios.get('/api/user')
                .then(response => {
                    if (response.data && response.data.id != null)
                        App.setUser(response.data)
                });
        }
        console.log("subscribe to App.user:changed");
        window.addEventListener('App.user:changed', callback);

        return () => {
            console.log("unscubscribe to App.user:changed");
            window.removeEventListener('App.user:changed', callback);
        };
    }, () => App.user);

    return user;
}


App.gameRoom = {
    id: null,
    room_code: "",
}
App.setGameRoom = (room_data) => {
    if (room_data.id != App.gameRoom.id) {

        if (App.gameRoom.id) {
            console.log(`stopListening App.Models.User.${App.gameRoom.id}`)
            window.Echo.private(`App.Models.GameRoom.${App.gameRoom.id}`)
                .stopListening('GameRoomChanged', App.setGameRoom);
        }

        console.log(`initializing echo App.Models.GameRoom.${room_data.id}`);
        window.Echo.private(`App.Models.GameRoom.${room_data.id}`)
            .listen('GameRoomChanged', App.setGameRoom);
    }

    App.gameRoom = room_data;
    console.log("setGameRoom");
    window.dispatchEvent(new Event("App.gameRoom:changed"));
}

export const GameRoomContext = createContext(null);

export function useGameRoom() {
    const gameRoom = useSyncExternalStore((callback) => {
        if (App.user.game_room_id) {
            if (!App.gameRoom || App.gameRoom.id != App.user.game_room_id) {
                window.axios.get(`/api/game/${App.user.game_room_id}/data`)
                    .then(response => {
                        console.log(response.data);
                        if (response.data && response.data.id != null) {
                            App.setGameRoom(response.data)
                        }
                    });

                /*window.axios.get(`/api/game/${App.user.game_room_id/users})
                    .then(response => App.setUsers(response.data))
                    */
            }
        }

        console.log("subscribe to App.gameRoom:changed");
        window.addEventListener('App.gameRoom:changed', callback);

        return () => {
            console.log("unscubscribe to App.gameRoom:changed");
            window.removeEventListener('App.gameRoom:changed', callback);
        };
    }, () => App.gameRoom);

    return gameRoom;
}


export class NotificationStore {
    constructor() {
        this.items = new Array();
    }

    add(priority, duration, component) {
        setTimeout(() => {
            this.remove(component);
            console.log("setTimeout()");
        }, duration);

        this.items.add(component);
    }

    remove(component) {
        this.items.map((item) => {
            ;
        });
    }
}
