"use client";

import { useState } from 'react';
import { ITask } from '@/types/task';
import { useTask } from '@/contexts/TaskContext';

interface TaskCardProps {
  task: ITask;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTask();
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    try {
      setIsLoading(true);
      await updateTask(task._id, { status: newStatus as any });
      setShowStatusMenu(false);
    } catch (error) {
      console.error('Failed to update task status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setIsLoading(true);
        await deleteTask(task._id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-50 text-red-700 border-red-100';
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'LOW': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'TODO':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-100',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ),
          label: 'To Do'
        };
      case 'IN_PROGRESS':
        return {
          color: 'bg-yellow-50 text-yellow-700 border-yellow-100',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: 'In Progress'
        };
      case 'COMPLETED':
        return {
          color: 'bg-green-50 text-green-700 border-green-100',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          label: 'Completed'
        };
      default:
        return {
          color: 'bg-gray-50 text-gray-700 border-gray-100',
          icon: null,
          label: status
        };
    }
  };

  const currentStatus = getStatusConfig(task.status);

  return (
    <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 ${
      isLoading ? 'opacity-75' : ''
    }`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {task.title}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`group px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1 border ${
                  currentStatus.color
                } hover:shadow-sm transition-all duration-200`}
                disabled={isLoading}
              >
                {currentStatus.icon}
                <span className="ml-1">{currentStatus.label}</span>
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${showStatusMenu ? 'rotate-180' : ''} opacity-60 group-hover:opacity-100`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showStatusMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 animate-fadeIn">
                  <div className="py-1">
                    {['TODO', 'IN_PROGRESS', 'COMPLETED'].map((status) => {
                      const statusConfig = getStatusConfig(status);
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-50 transition-colors duration-150 ${
                            task.status === status ? 'bg-gray-50' : ''
                          }`}
                        >
                          <div className={`p-1 rounded-full ${statusConfig.color}`}>
                            {statusConfig.icon}
                          </div>
                          <span>{statusConfig.label}</span>
                          {task.status === status && (
                            <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div 
          className={`text-gray-600 text-sm mb-4 ${
            showDetails ? '' : 'line-clamp-2'
          }`}
        >
          {task.description}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(task.dueDate)}
            </div>
            <div className="flex items-center text-gray-500">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs mr-1">
                {(task.assignedTo as any).username?.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-[100px]">
                {(task.assignedTo as any).username}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              title={showDetails ? "Show less" : "Show more"}
            >
              <svg className={`w-5 h-5 transform transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
              disabled={isLoading}
              title="Delete task"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 