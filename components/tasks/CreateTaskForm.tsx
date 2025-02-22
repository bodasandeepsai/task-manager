import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
}

interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignee: string;
}

const CreateTaskForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'LOW',
    assignee: '',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsFetchingUsers(true);
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsFetchingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dueDate' ? new Date(value).toISOString().split('T')[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
  };

  const getPriorityClass = (priority: string, isSelected: boolean) => {
    const base = 'px-4 py-2 border rounded-lg text-sm font-medium transition-all';
    if (isSelected) {
      return `${base} ${priority === 'HIGH' ? 'bg-red-600 text-white' : priority === 'MEDIUM' ? 'bg-yellow-600 text-white' : 'bg-green-600 text-white'}`;
    }
    return `${base} bg-white text-gray-700 border-gray-300 hover:bg-gray-50`;
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <label className="block font-medium">Title</label>
            <input name="title" type="text" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />

            <label className="block mt-3 font-medium">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />

            <label className="block mt-3 font-medium">Due Date</label>
            <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />

            <label className="block mt-3 font-medium">Priority</label>
            <div className="flex gap-2 mt-1">
              {['LOW', 'MEDIUM', 'HIGH'].map(priority => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' }))}
                  className={getPriorityClass(priority, formData.priority === priority)}
                >
                  {priority}
                </button>
              ))}
            </div>

            <button type="button" onClick={() => setStep(2)} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block font-medium">Assign To</label>
            {isFetchingUsers ? (
              <div className="flex justify-center p-4">
                <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : (
              <select name="assignee" value={formData.assignee} onChange={handleChange} className="w-full p-2 border rounded mt-1">
                <option value="">Select Assignee</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            )}
            {error && <p className="text-red-600 mt-2">{error}</p>}

            <div className="flex justify-between mt-4">
              <button type="button" onClick={() => setStep(1)} className="bg-gray-600 text-white px-4 py-2 rounded">Back</button>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Create Task</button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CreateTaskForm;
