import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeTodo, toggleStatus } from '../store/todo-slice'
import Input from '../ui/Input'
import './List.css'

function List() {
	const todos = useSelector((state) => state.todo)
	const dispatch = useDispatch()
	return (
		<div>
			{todos.tasks.map((el) => (
				<div key={el.key} className='card'>
					<label className={el.completed ? 'toggled' : ''}>
						{el.title}
					</label>
					<Input
						className='checkbox'
						type={'checkbox'}
						onChange={() => dispatch(toggleStatus(el.key))}
						checked={el.completed}
					/>
					<span
						className='btn1'
						onClick={() => dispatch(removeTodo(el.key))}
					>
						&times;
					</span>
				</div>
			))}
		</div>
	)
}

export default List
