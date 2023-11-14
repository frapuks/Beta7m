import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    goalkeepers: [],
    players: [],
};

const selectPlayersSlice = createSlice({
    name: "selectPlayers",
    initialState,
    reducers: {
        setGoalkeepers: (state, action) => {
            state.goalkeepers = action.payload;
        },
        setPlayers: (state, action) => {
            state.players = action.payload;
        },
    },
});

export const { setGoalkeepers, setPlayers } = selectPlayersSlice.actions;
export default selectPlayersSlice.reducer;