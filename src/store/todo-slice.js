import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initState = {
	status: null,
	error: null,
	tasks: [],
}

export const addTodo = createAsyncThunk(
	'todo/addTodo',
	async function (title, { rejectWithValue, dispatch }) {
		try {
			const todo = {
				id: Math.random().toString(),
				title: title,
				completed: false,
			}
			const response = await fetch(
				'https://tasks-392f7-default-rtdb.firebaseio.com/todos.json',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(todo),
				},
			)
			if (!response.ok) {
				throw new Error('Cannot add data.Server error')
			} else {
				dispatch(fetchTodo())
			}
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)
export const fetchTodo = createAsyncThunk(
	'todo/fetchTodo',
	async function (_, { rejectWithValue, dispatch }) {
		try {
			const response = await fetch(
				'https://tasks-392f7-default-rtdb.firebaseio.com/todos.json',
			)
			if (!response.ok) {
				throw new Error('Somthing went wrong')
			}
			const data = await response.json()
			dispatch(todoActions.onAdd(data))
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)
export const toggleStatus = createAsyncThunk(
	'todo/toggleStatus',
	async function (id, { rejectWithValue, dispatch, getState }) {
		const todo = getState().todo.tasks.find((el) => el.key === id)
		try {
			const response = await fetch(
				`https://tasks-392f7-default-rtdb.firebaseio.com/todos/${id}.json/`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						completed: !todo.completed,
					}),
				},
			)
			if (!response.ok) {
				throw new Error('Something went wrong!!!')
			}
		} catch (error) {
			return rejectWithValue(error.message)
		}
		dispatch(todoActions.toggleComplete(id))
	},
)
export const removeTodo = createAsyncThunk(
	'todo/removeTodo',
	async function (id, { rejectWithValue, dispatch }) {
		try {
			const response = await fetch(
				`https://tasks-392f7-default-rtdb.firebaseio.com/todos/${id}.json/`,
				{
					method: 'DELETE',
				},
			)
			if (!response.ok) {
				throw new Error('Somthing went wrong!!!')
			}
			dispatch(todoActions.onDelete(id))
		} catch (error) {
			return rejectWithValue(error.message)
		}
	},
)
const setError = (state, action) => {
	state.status = 'rejected'
	state.error = action.payload
}
const todoSlice = createSlice({
	name: 'todo',
	initialState: initState,
	reducers: {
		onAdd(state, action) {
			const newData = []
			for (let data in action.payload) {
				newData.push({
					key: data,
					title: action.payload[data].title,
					completed: action.payload[data].completed,
				})
			}
			state.tasks = newData
		},
		toggleComplete(state, action) {
			const toggledTodo = state.tasks.find(
				(el) => el.key === action.payload,
			)
			toggledTodo.completed = !toggledTodo.completed
		},
		onDelete(state, action) {
			state.tasks = state.tasks.filter((el) => el.key !== action.payload)
		},
	},
	extraReducers: {
		[fetchTodo.pending]: (state) => {
			state.status = 'loading'
			state.error = null
		},
		[fetchTodo.fulfilled]: (state, action) => {
			state.status = 'resolved'
			state.todos = action.payload
		},
		[fetchTodo.rejected]: setError,
		[addTodo.rejected]: setError,
		[toggleStatus.rejected]: setError,
		[removeTodo.rejected]: setError,
	},
})

export const todoActions = todoSlice.actions
export default todoSlice
