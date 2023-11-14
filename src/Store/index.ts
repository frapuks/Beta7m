import { configureStore } from "@reduxjs/toolkit";
// Slices
import selectPlayersSlice from "./Slices/selectPlayersSlice";

export const store = configureStore({
  reducer: {
    selectPlayers: selectPlayersSlice,
  },
});
