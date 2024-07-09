import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TodosPage = () => {
  const navigate = useNavigate();

  // Retrieve current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser.id;

  // State variables
  const [todos, setTodos] = useState([]); // Holds all todos fetched from the server
  const [newTodoTitle, setNewTodoTitle] = useState(''); // Holds the title of a new todo being added
  const [sortCriteria, setSortCriteria] = useState('sequential'); // Holds the current sorting criteria
  const [searchCriteria, setSearchCriteria] = useState({ // Holds the current search criteria
    id: '',
    title: '',
    completed: '',
  });
  const [filteredTodos, setFilteredTodos] = useState([]); // Holds todos filtered based on search criteria
  const [editingTodoId, setEditingTodoId] = useState(null); // Holds the id of the todo being edited
  const [editingTodoTitle, setEditingTodoTitle] = useState(''); // Holds the title of the todo being edited

  // Effect to fetch todos from the server when userId changes
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3001/todos?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);
        setFilteredTodos(data); // Set the initial filtered todos to all fetched todos
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [userId]);

  // Effect to filter and sort todos based on search and sort criteria
  useEffect(() => {
    let data = [...todos]; // Copy todos to avoid mutating state directly

    // Filtering logic based on search criteria
    data = data.filter(todo =>
      (!searchCriteria.id || todo.id.toString().includes(searchCriteria.id)) &&
      (!searchCriteria.title || todo.title.toLowerCase().includes(searchCriteria.title.toLowerCase())) &&
      (searchCriteria.completed === '' || todo.completed === (searchCriteria.completed === 'true'))
    );

    // Sorting logic based on selected criteria
    switch (sortCriteria) {
      case 'sequential':
        // No sorting needed for sequential order
        break;
      case 'completed':
        data = data.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
        break;
      case 'alphabetical':
        data = data.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'random':
        data = data.sort(() => Math.random() - 0.5);
        break;
      default:
        break;
    }

    setFilteredTodos(data); // Update filtered todos state
  }, [todos, sortCriteria, searchCriteria]);

  // Function to calculate the maximum todo id for generating a new id
  const getMaxTodoId = () => {
    const maxId = todos.reduce((max, todo) => (parseInt(todo.id) > max ? parseInt(todo.id) : max), 0);
    return maxId + 1; // Return the maximum id incremented by 1
  };

  // Function to handle checkbox change for marking todo as completed or not
  const handleCheckboxChange = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }), // Toggle completed status
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo // Update completed status for the specific todo
      );
      setTodos(updatedTodos); // Update todos state with the updated todo list
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Function to handle deletion of a todo by id
  const handleDeleteTodo = async id => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      const updatedTodos = todos.filter(todo => todo.id !== id); // Filter out the deleted todo
      setTodos(updatedTodos); // Update todos state without the deleted todo
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Function to handle addition of a new todo
  const handleAddTodo = async e => {
    e.preventDefault();
    try {
      const newTodo = {
        userId: parseInt(userId), // Convert userId to number if needed
        id: getMaxTodoId(), // Generate a new id for the todo
        title: newTodoTitle,
        completed: false, // Default completed status is false for new todos
      };
      const response = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo), // Send new todo data to the server
      });
      if (!response.ok) {
        throw new Error('Failed to add new todo');
      }
      setTodos([...todos, newTodo]); // Add the new todo to the todos state
      setNewTodoTitle(''); // Clear the new todo title input field
    } catch (error) {
      console.error('Error adding new todo:', error);
    }
  };

  // Function to handle change in sorting criteria
  const handleSortChange = e => {
    setSortCriteria(e.target.value); // Update sort criteria based on user selection
  };

  // Function to handle updating the title of a todo
  const handleUpdateTodo = async id => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editingTodoTitle }), // Send updated title to the server
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, title: editingTodoTitle } : todo // Update title for the specific todo
      );
      setTodos(updatedTodos); // Update todos state with the updated todo list
      setEditingTodoId(null); // Clear editing state
      setEditingTodoTitle(''); // Clear editing state
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Function to initiate editing of a todo
  const startEditingTodo = (id, title) => {
    setEditingTodoId(id); // Set the id of the todo being edited
    setEditingTodoTitle(title); // Set the title of the todo being edited
  };

  // JSX rendering
  return (
    <div>
      <h2>Todos List</h2>
      {/* Form for adding a new todo */}
      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          placeholder="Enter new todo title"
          required
        />
        <button type="submit">Add Todo</button>
      </form>
      {/* Form for filtering todos */}
      <form>
        <input
          type="text"
          value={searchCriteria.id}
          onChange={e => setSearchCriteria({ ...searchCriteria, id: e.target.value })}
          placeholder="Search by ID"
        />
        <input
          type="text"
          value={searchCriteria.title}
          onChange={e => setSearchCriteria({ ...searchCriteria, title: e.target.value })}
          placeholder="Search by Title"
        />
        <select
          value={searchCriteria.completed}
          onChange={e => setSearchCriteria({ ...searchCriteria, completed: e.target.value })}
        >
          <option value="">Any</option>
          <option value="true">Completed</option>
          <option value="false">Not Completed</option>
        </select>
        <button type="button" onClick={() => setSearchCriteria(searchCriteria)}>Search</button>
      </form>
      {/* Form for sorting todos */}
      <div>
        <label>Sort by:</label>
        <select value={sortCriteria} onChange={handleSortChange}>
          <option value="sequential">Sequential</option>
          <option value="completed">Completed</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="random">Random</option>
        </select>
      </div>
      {/* List of todos */}
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            {/* Checkbox for marking todo as completed */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleCheckboxChange(todo.id, todo.completed)}
            />
            {/* Conditional rendering based on whether todo is being edited */}
            {editingTodoId === todo.id ? (
              <>
                {/* Input for editing todo title */}
                <input
                  type="text"
                  value={editingTodoTitle}
                  onChange={e => setEditingTodoTitle(e.target.value)}
                />
                {/* Buttons for saving or canceling edit */}
                <button onClick={() => handleUpdateTodo(todo.id)}>Save</button>
                <button onClick={() => setEditingTodoId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {/* Display todo id and title */}
                <span>{`${todo.id} - ${todo.title}`}</span>
                {/* Buttons for editing and deleting todo */}
                <button onClick={() => startEditingTodo(todo.id, todo.title)}>Edit</button>
                <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      {/* Button to navigate back to home page */}
      <button onClick={() => navigate(`/home/${currentUser.username}`)}>Return to Home</button>
    </div>
  );
};

export default TodosPage;
