import { configureStore } from "@reduxjs/toolkit";
// Slices
import selectMatchPlayersSlice from "./Slices/selectMatchPlayersSlice";
import playerSlice from "./Slices/playersSlice";

export const store = configureStore({
  reducer: {
    selectMatchPlayers: selectMatchPlayersSlice,
    players: playerSlice,
  },
});
