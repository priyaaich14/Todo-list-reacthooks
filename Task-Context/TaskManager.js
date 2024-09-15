import { useReducer } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import TaskContext from "./TaskContext";
const reducer = (state, action) => {
  if (action.type === "ADD_TASK") {
    return [...state, action.payload]
  } else if (action.type === "REMOVE_TASK") {
    return state.filter((ele) => ele.id !== action.payload)
  } else if (action.type === "UPDATE_TASK") {
    return state.map((ele) => {
      if (ele.id === action.payload) {
        return { ...ele, isCompleted: !ele.isCompleted }
      } else {
        return { ...ele }
      }
    })
  }
}

export default function TaskManager() {
  const [tasks, dispatch] = useReducer(reducer, [])

  return (
    <div>
      <h2>Listing Tasks - {tasks.length} </h2>
      <TaskContext.Provider value={{ tasks, dispatch }}>
        <TaskList />
        <TaskForm />
      </TaskContext.Provider>
    </div>
  )
}
