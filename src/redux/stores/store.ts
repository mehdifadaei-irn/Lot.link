import {configureStore} from "@reduxjs/toolkit"
import spinnerReducer from "@/redux/spinner/spinnerSlice"

export const store = configureStore({
    reducer:{
        spinner: spinnerReducer
    }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch