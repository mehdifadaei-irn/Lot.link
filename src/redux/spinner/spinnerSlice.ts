import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

interface spinnerSlice{
    value: number
    spinnerActiveIndex: number | undefined
    pieData: { name: string; value: number }[]
}

const initialState: spinnerSlice = {
    value: 23,
    spinnerActiveIndex: undefined,
    pieData: []
}

const spinnerSlice = createSlice({
    name: "spinner",
    initialState,
    reducers:{
        increment: (state)=> {
            state.value += 1 
        },
        decrement: (state)=> {
            state.value -=1
        },
        increamentByAmount: (state, action:PayloadAction<number>)=> {
            state.value +=action.payload
        },
        setSpinnerActiveIndex: (state, action:PayloadAction<number | undefined>)=> {
            state.spinnerActiveIndex = action.payload
        },
        setMainPieData: (state, action:PayloadAction<{ name: string; value: number }[]>)=> {
            state.pieData = action.payload
        },
    },
    extraReducers: (builder)=> {
        builder.addCase(increamentAsync.pending, (state)=> {
            console.log("increamentAsync.pending")
        }),
        builder.addCase(increamentAsync.rejected, (state)=> {
            console.log("increamentAsync is rejected")
        }),
        builder.addCase(increamentAsync.fulfilled, (state, action:PayloadAction<number>)=> {
            state.value +=action.payload
        })
    }
})

export const increamentAsync = createAsyncThunk(
    "spinner/increament",
    async (amount:number) => {
        await new Promise((resolve)=> setTimeout(resolve, 1000))
        return amount;
    }
)

export const {decrement,increment, setSpinnerActiveIndex, setMainPieData} = spinnerSlice.actions

export default spinnerSlice.reducer