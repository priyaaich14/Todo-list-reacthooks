import TaskContext from "./TaskContext";
import { useContext } from "react";
export default function TaskItem(props) {
  const { dispatch } = useContext(TaskContext)
  const { id, title, description, isCompleted } = props

  const handleRemove = (id, title) => {
    const userConfirm = window.confirm("Are you sure?")
    if (userConfirm) {
      dispatch({ type: "REMOVE_TASK", payload: id })
    }
  }

  const handleChange = () => {
    dispatch({ type: "UPDATE_TASK", payload: id })
  }

  return (
    <li>
      <input type="checkbox" checked={isCompleted} onChange={handleChange} />
      {title} - {description}
      <button
        onClick={() => {
          handleRemove(id, title)
        }}
      >
        remove
      </button>
    </li>
  )
}
