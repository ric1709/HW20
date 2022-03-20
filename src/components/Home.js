import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { addTodo, fetchTodo } from '../store/todo-slice'
import './Home.css'
import List from './List'

function Home() {
	const [data, setData] = useState('')
	const dispatch = useDispatch()

	const onChangeDataHandler = (e) => {
		setData(e.target.value)
	}

	const onAddDataHandler = (e) => {
		e.preventDefault()
		if(data.trim().length > 0){
            dispatch(addTodo(data))
        }
        setData('')
	}
	useEffect(() => {
		dispatch(fetchTodo())
	}, [dispatch])

	return (
		<form onSubmit={onAddDataHandler} className="form">
			<label className="title">Let's do it</label>
			<div className='main'>
				<Input
                    className="input"
                    value={data}
					placeholder={'Add your todos'}
					onChange={onChangeDataHandler}
				/>
				<Button className="btn" type={'submit'}>Add</Button>
			</div>
			<List />
		</form>
	)
}

export default Home
