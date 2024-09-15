import { useState } from "react";
export default function TaskForm(props) {
  const { dispatch } = props
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [clientErrors, setClientErrors] = useState({})
  const errors = {}
  const runClientValidation = () => {
    if (title.trim().length === 0) {
      errors.title = "title cannot be blank"
    }
    if (description.trim().length === 0) {
      errors.description = "description cannot be blank"
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    runClientValidation()
    if (Object.keys(errors).length === 0) {
      const task = {
        id: Number(new Date()),
        title: title,
        description: description,
        isCompleted: false,
      }
      dispatch({ type: "ADD_TASK", payload: task })
      setClientErrors({})
      setTitle("")
      setDescription("")
    } else {
      setClientErrors(errors)
    }
  }

  return (
    <div>
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Enter Title</label> <br />
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
        <br />
        {clientErrors.title && <b> {clientErrors.title} </b>}
        <br />
        <label htmlFor="description">Enter Description</label>
        <br />
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        ></textarea>
        <br />
        {clientErrors.description && <b> {clientErrors.description} </b>}
        <br />
        <input type="submit" />
      </form>
    </div>
  )
}
