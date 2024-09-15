import TaskItem from "./TaskItem";
import { useState, useContext } from "react";
import TaskContext from "./TaskContext";
export default function TaskList() {
  const { tasks } = useContext(TaskContext)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const statusTypes = ["all", "completed", "pending"]
  const filterTasksByStatus = () => {
    if (selectedStatus === "all") {
      return tasks;
    } else if (selectedStatus === "completed") {
      return tasks.filter((ele) => ele.isCompleted)
    } else if (selectedStatus === "pending") {
      return tasks.filter((ele) => !ele.isCompleted)
    }
  }
  return (
    <div>
      {statusTypes.map((status) => {
        return (
          <>
            <input
              type="radio"
              name="status"
              id={status}
              checked={selectedStatus === status}
              onChange={() => setSelectedStatus(status)}
            />
            <label htmlFor={status}>
              {status[0].toUpperCase() + status.slice(1).toLowerCase()}
            </label>
          </>
        )
      })}

      <ul>
        {filterTasksByStatus().map((ele) => {
          return (
            <TaskItem
              key={ele.id}
              // option 1
              title={ele.title}
              id={ele.id}
              description={ele.description}
              isCompleted={ele.isCompleted}
            />
          )
        })}
      </ul>
    </div>
  )
}
