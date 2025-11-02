import React, { useState, useEffect } from 'react';
import { User, Todo } from '../types';
import { databases } from '../lib/appwriteConfig';
import { DEMO_DATABASE_ID, DEMO_TODOS_COLLECTION_ID } from '../lib/appwriteConfig';
import { ID, Permission, Role, Query } from 'appwrite';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

interface AppwriteDemoPageProps {
  currentUser: User;
}

const AppwriteDemoPage: React.FC<AppwriteDemoPageProps> = ({ currentUser }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await databases.listDocuments(
          DEMO_DATABASE_ID,
          DEMO_TODOS_COLLECTION_ID,
          [Query.equal('userId', currentUser.uid)]
        );
        setTodos(response.documents as unknown as Todo[]);
      } catch (err: any) {
        console.error("Failed to fetch todos:", err);
        setError("Could not load todos. Make sure your Appwrite collection is set up correctly with the right attributes and permissions. You may need to create a 'todos' collection with 'task' (string), 'isComplete' (boolean), and 'userId' (string) attributes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, [currentUser.uid]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    try {
      const response = await databases.createDocument(
        DEMO_DATABASE_ID,
        DEMO_TODOS_COLLECTION_ID,
        ID.unique(),
        {
          task: task,
          isComplete: false,
          userId: currentUser.uid,
        },
        [
          Permission.read(Role.user(currentUser.uid)),
          Permission.write(Role.user(currentUser.uid)),
        ]
      );
      setTodos(prevTodos => [...prevTodos, response as unknown as Todo]);
      setTask('');
    } catch (err) {
      console.error("Failed to add todo:", err);
      setError("Failed to add todo. Please check your Appwrite collection permissions.");
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      await databases.deleteDocument(
        DEMO_DATABASE_ID,
        DEMO_TODOS_COLLECTION_ID,
        todoId
      );
      setTodos(prevTodos => prevTodos.filter(todo => todo.$id !== todoId));
    } catch (err) {
      console.error("Failed to delete todo:", err);
      setError("Failed to delete todo.");
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
        await databases.updateDocument(
            DEMO_DATABASE_ID,
            DEMO_TODOS_COLLECTION_ID,
            todo.$id,
            { isComplete: !todo.isComplete }
        );
        setTodos(prevTodos => 
            prevTodos.map(t => t.$id === todo.$id ? { ...t, isComplete: !t.isComplete } : t)
        );
    } catch (err) {
        console.error("Failed to update todo:", err);
        setError("Failed to update todo.");
    }
  };


  return (
    <div className="container mx-auto px-6 py-12 max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Appwrite Starter Demo</h1>
        <p className="text-lg text-gray-400 mt-2">A simple Todo list using Appwrite Database.</p>
        <div className="w-24 h-1 bg-brand-red mx-auto mt-4"></div>
      </div>

      <div className="bg-brand-card p-8 rounded-lg shadow-lg">
        <form onSubmit={handleAddTodo} className="flex gap-4">
          <Input
            label="New Todo"
            id="todo-task"
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-grow"
          />
          <div className="self-end">
            <Button type="submit">Add</Button>
          </div>
        </form>

        {error && <p className="bg-red-500/20 text-red-400 p-3 rounded-md text-sm mt-6">{error}</p>}
        
        <div className="mt-8">
          {isLoading ? (
            <p className="text-center text-gray-400">Loading todos...</p>
          ) : (
            <ul className="space-y-4">
              {todos.length > 0 ? todos.map(todo => (
                <li key={todo.$id} className="flex items-center justify-between bg-brand-dark/50 p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={todo.isComplete}
                      onChange={() => handleToggleComplete(todo)}
                      className="h-5 w-5 rounded border-gray-500 bg-brand-dark text-brand-red focus:ring-brand-red"
                    />
                    <span className={`text-lg ${todo.isComplete ? 'line-through text-gray-500' : 'text-white'}`}>
                      {todo.task}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteTodo(todo.$id)} className="text-red-500 hover:text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              )) : (
                <p className="text-center text-gray-400">No todos yet. Add one above!</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppwriteDemoPage;