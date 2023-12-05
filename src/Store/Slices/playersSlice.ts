import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    players: [],
};

const playersSlice = createSlice({
    name: "players",
    initialState,
    reducers: {
        setPlayers: (state, action) => {
            state.players = action.payload;
        },
    },
});

export const { setPlayers } = playersSlice.actions;
export default playersSlice.reducer;