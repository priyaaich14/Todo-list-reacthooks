export default function TaskItem(props) {
    const { id, title, description, isCompleted } = props
  
    const handleRemove = (id, title) => {
      const userConfirm = window.confirm("Are you sure?")
      if (userConfirm) {
        props.dispatch({ type: "REMOVE_TASK", payload: id })
      }
    }
  
    const handleChange = () => {
      props.dispatch({ type: "UPDATE_TASK", payload: id })
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
  