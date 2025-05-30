import { useState, useEffect } from 'react'
import './App.css'
import TaskInput from './components/TaskInput'
import TaskList from './components/TaskList'
import TranscriptInput from './components/TranscriptInput'
import { parseTask } from './utils/parser'

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
  }

  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    )
  }

  const handleDeleteTask = (taskToDelete) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskToDelete.id)
    )
  }

  const handleParsedTasks = (parsedTasks) => {
    const newTasks = parsedTasks.map(task => {
      let parsedDueDate = null;
      if (task.dueDate) {
        const result = parseTask(`dummy task by dummy ${task.dueDate}`);
        parsedDueDate = result.dueDate;
      }

      return {
        ...task,
        assignee: task.assignedTo,
        dueDate: parsedDueDate,
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        status: 'pending'
      };
    });
    setTasks(prevTasks => [...prevTasks, ...newTasks]);
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Natural Language Task Manager
        </h1>
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add Tasks</h2>
            <div className="space-y-6">
              <TaskInput onAddTask={handleAddTask} />
              <div className="border-t border-gray-200 pt-6">
                <TranscriptInput onTasksParsed={handleParsedTasks} />
              </div>
            </div>
          </div>
          <TaskList
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </div>
    </div>
  )
}

export default App
