import {createSlice} from "@reduxjs/toolkit";


const todoSlice = createSlice({
    name:"todo",
    initialState:[],
    reducers:{
        addTodoItem: (state, action) => {
            state.push(action.payload)
        },

        removeSingleTodoItem : (state,action) =>{
            state.filter((val)=>{
                return val._id !== action.payload
            });
        },

        removeTodoItems : (state,action) =>{
            return []
        },

        updateSingleTodoItem : (state,action) =>{
            const updatedItems = state.map((item) => {
                if (item._id === action.payload.id) {
                  return action.payload.data;
                }
                return item;
              });
              return state = updatedItems;
        }
    }
})

export const {addTodoItem, removeSingleTodoItem, removeTodoItems, updateSingleTodoItem } = todoSlice.actions;

export default todoSlice.reducer;