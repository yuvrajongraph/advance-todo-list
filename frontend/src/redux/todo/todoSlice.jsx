import {createSlice} from "@reduxjs/toolkit";


const todoSlice = createSlice({
    name:"todo",
    initialState:[],
    reducers:{
        addTodoItem: (state, action) => {
            state.push(action.payload)
        },

        removeSingleTodoItem : (state,action) =>{
           const remainingItem = state.filter((val)=>{
                return val?._id !== action.payload
            });
            return remainingItem
        },

        removeTodoItems : (state,action) =>{
            return []
        },

        updateSingleTodoItem : (state,action) =>{
           const updatedItems = state.map((item) => {
                if (item?._id === action.payload?.id) {
                  return {...item, title: action.payload.data?.title, category: action.payload.data?.category, dateTime: action.payload.data?.dateTime, startTime: action.payload.data?.startTime, endTime: action.payload.data?.endTime};
                }
                return item;
              });
              return updatedItems;
        }
    }
})

export const {addTodoItem, removeSingleTodoItem, removeTodoItems, updateSingleTodoItem } = todoSlice.actions;

export default todoSlice.reducer;