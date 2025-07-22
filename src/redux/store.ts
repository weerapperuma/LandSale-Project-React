import {configureStore} from "@reduxjs/toolkit";

export const store= configureStore({
    reducer: {

    },
    devTools : import.meta.env.MODE !== 'production',
});

// 🔁 Types for TS autocompletion
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;