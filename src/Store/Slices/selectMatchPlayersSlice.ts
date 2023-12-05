import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    goalkeepers: [],
    shooters: [],
};

const selectMatchPlayersSlice = createSlice({
    name: "selectMatchPlayers",
    initialState,
    reducers: {
        setGoalkeepers: (state, action) => {
            state.goalkeepers = action.payload;
        },
        setShooters: (state, action) => {
            state.shooters = action.payload;
        },
    },
});

export const { setGoalkeepers, setShooters } = selectMatchPlayersSlice.actions;
export default selectMatchPlayersSlice.reducer;