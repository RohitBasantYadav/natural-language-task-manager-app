import { useState } from 'react';
import { formatDate } from '../utils/parser';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      P1: 'bg-red-500',
      P2: 'bg-orange-500',
      P3: 'bg-yellow-500',
      P4: 'bg-gray-500',
    };
    return colors[priority] || 'bg-yellow-500';
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg ring-1 ring-gray-100 transition-all duration-200 hover:shadow-xl">
        <div className="space-y-4">
          <input
            type="text"
            value={editedTask.taskName}
            onChange={(e) => setEditedTask({ ...editedTask, taskName: e.target.value })}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base lg:text-lg"
            placeholder="Task name"
          />
          <input
            type="text"
            value={editedTask.assignee || ''}
            onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base lg:text-lg"
            placeholder="Assignee"
          />
          <input
            type="datetime-local"
            value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().slice(0, 16) : ''}
            onChange={(e) => setEditedTask({ ...editedTask, dueDate: new Date(e.target.value) })}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base lg:text-lg"
          />
          <select
            value={editedTask.priority}
            onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base lg:text-lg"
          >
            <option value="P1">P1 - Highest Priority</option>
            <option value="P2">P2 - High Priority</option>
            <option value="P3">P3 - Medium Priority</option>
            <option value="P4">P4 - Low Priority</option>
          </select>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-base lg:text-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base lg:text-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 group h-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 h-full">
        <div className="flex-1 space-y-2 lg:space-y-1.5 lg:flex lg:flex-col lg:justify-center min-w-0">
          <h3 className="text-lg lg:text-xl xl:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 break-words">
            {task.taskName}
          </h3>
          <div className="space-y-1.5 lg:space-y-1.5 lg:flex-col lg:items-center lg:gap-4">
            <p className="text-sm lg:text-base xl:text-lg text-gray-600 flex items-center gap-2">
              <span className="font-medium whitespace-nowrap">Assignee:</span>
              {task.assignee ? (
                <span className="text-gray-800 truncate">{task.assignee}</span>
              ) : (
                <span className="text-gray-400 italic">Unassigned</span>
              )}
            </p>
            <p className="text-sm lg:text-base xl:text-lg text-gray-600 flex items-center gap-2">
              <span className="font-medium whitespace-nowrap">Due:</span>
              <span className="text-gray-800">{formatDate(task.dueDate)}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 mt-4 sm:mt-0 lg:ml-auto">
          <span className={`px-3 py-1 rounded-full text-sm lg:text-base xl:text-lg font-medium text-white ${getPriorityColor(task.priority)} shadow-sm whitespace-nowrap`}>
            {task.priority}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              aria-label="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              aria-label="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;