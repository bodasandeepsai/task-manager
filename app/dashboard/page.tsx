"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import TaskCard from '@/components/tasks/TaskCard';
import CreateTaskForm from '@/components/tasks/CreateTaskForm';
import AIChatWidget from '@/components/tasks/AIChatWidget';
import { TaskStatus } from '@/types/task';

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { tasks, loading, error } = useTask();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tasksByStatus = (status: TaskStatus) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasksByStatus('COMPLETED').length;
    const inProgress = tasksByStatus('IN_PROGRESS').length;
    const todo = tasksByStatus('TODO').length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, todo, completionRate };
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-500">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Welcome back, {user?.username}!
                </p>
              </div>

              {/* Quick Stats */}
              <div className="hidden md:flex space-x-4">
                <div className="px-4 py-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Total Tasks</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                </div>
                <div className="px-4 py-2 bg-green-50 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-700">{stats.completionRate}%</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Task
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-inner">
                    <span className="text-lg font-medium">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200">
                    <div className="py-2" role="menu">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                        <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="px-4 py-3 border-b">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tasks Today</span>
                          <span className="font-medium text-gray-900">{stats.total}</span>
                        </div>
                        <div className="mt-3 bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${stats.completionRate}%` }}
                          />
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-150 focus:outline-none"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <svg className="mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Task Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Tasks</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
                <p className="text-2xl font-semibold text-gray-900">{stats.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Columns */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Todo Column */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  To Do
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {tasksByStatus('TODO').length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-4 min-h-[300px]">
              {tasksByStatus('TODO').map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  In Progress
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {tasksByStatus('IN_PROGRESS').length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-4 min-h-[300px]">
              {tasksByStatus('IN_PROGRESS').map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>

          {/* Completed Column */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Completed
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {tasksByStatus('COMPLETED').length}
                </span>
              </div>
            </div>
            <div className="p-4 space-y-4 min-h-[300px]">
              {tasksByStatus('COMPLETED').map(task => (
                <TaskCard key={task._id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showCreateForm && (
        <CreateTaskForm onClose={() => setShowCreateForm(false)} />
      )}

      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}
