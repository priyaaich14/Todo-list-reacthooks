const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const port = 3040

app.use(express.json())
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/task-management-app')
  .then(() => {
    console.log('Connected to DB')
  })
  .catch((err) => {
    console.error('Error connecting to DB:', err)
  })

const { Schema, model } = mongoose

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'in progress', 'completed'],
    default: 'pending',
  },
  
},{ timestamps: true })

const Task = model('Task', taskSchema)

// Create Task
app.post('/api/tasks', (req, res) => {
  const body = req.body
  const task = new Task(body) // Include status in the task creation
  task.save()
    .then((savedTask) => {
      // Send the saved task as response with timestamps in IST format
      res.json(convertToIST(savedTask))
    })
    .catch((err) => {
      res.status(500).json({ error: err.message })
    })
})

//Get Tasks
// app.get('/api/tasks', (req, res) => {
//     Task.find()
//       .then((tasks) => {
//         // Convert tasks dates to IST format before sending response
//         const tasksWithIST = tasks.map(task => convertToIST(task))
//         res.json(tasksWithIST)
//       })
//       .catch((err) => {
//         res.status(500).json({ error: err.message })
//       })
//   })
// // Get Tasks with Filtering, Sorting, and Pagination
// app.get('/api/task', (req, res) => {
//   const { status, sortBy, sortOrder, page, limit } = req.query
  
//   // Define filter criteria
//   const filter = {}
//   if (status && ['pending', 'in progress', 'completed'].includes(status)) {
//     filter.status = status
//   }

//   // Define sort options
//   let sort = {}
//   if (sortBy && ['createdAt', 'updatedAt'].includes(sortBy)) {
//     sort[sortBy] = sortOrder === 'desc' ? -1 : 1
//   }

//   // Pagination options
//   const options = {
//     sort,
//     skip: (parseInt(page) - 1) * parseInt(limit), // Convert page and limit to integers
//     limit: parseInt(limit)
//   }

//   Task.find(filter, null, options)
//     .then((tasks) => {
//       // Convert tasks dates to IST format before sending response
//       const tasksWithIST = tasks.map(task => convertToIST(task))
//       res.json(tasksWithIST)
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err.message })
//     })
// })
app.get('/api/tasks', (req, res) => {
  const { status, sortBy, sortOrder, page, limit } = req.query
  
  // Define filter criteria
  const filter = {}
  if (status && ['pending', 'in progress', 'completed'].includes(status)) {
    filter.status = status
  }

  // Define sort options
  let sort = {}
  if (sortBy && ['createdAt', 'updatedAt'].includes(sortBy)) {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1
  }

  // Pagination options
  const options = {
    sort,
    skip: (parseInt(page) - 1) * parseInt(limit), // Convert page and limit to integers
    limit: parseInt(limit)
  }

  Task.find(filter, null, options)
    .then((tasks) => {
      // Convert tasks dates to IST format before sending response
      const tasksWithIST = tasks.map(task => convertToIST(task))
      res.json(tasksWithIST)
    })
    .catch((err) => {
      res.status(500).json({ error: err.message })
    })
})


// Get Task by ID
app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params
  Task.findById(id)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: 'Task not found' })
      }
      // Convert task dates to IST format before sending response
      res.json(convertToIST(task))
    })
    .catch((err) => {
      res.status(500).json({ error: err.message })
    })
})

// Update Task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params
  const body = req.body
  Task.findByIdAndUpdate(id, {...body }, { new: true, runValidators: true })
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' })
      }
      // Send the updated task as response with timestamps in IST format
      res.json(convertToIST(updatedTask))
    })
    .catch((err) => {
      res.status(500).json({ error: err.message })
    })
})

// Delete Task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params
  Task.findByIdAndDelete(id)
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' })
      }
      // Send the deleted task as response with timestamps in IST format
      res.json(convertToIST(deletedTask))
    })
    .catch((err) => {
      res.status(500).json({ error: err.message })
    })
})

// Function to convert timestamps to IST format
function convertToIST(task) {
  return {
    ...task.toObject(),
    createdAt: new Date(task.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    updatedAt: new Date(task.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
