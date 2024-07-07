import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../style/TodosPage.css';
import '../style/style.css';

const TodosPage = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const userId = currentUser.id;

  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [sortCriteria, setSortCriteria] = useState('sequential'); // Default sort criteria
  const [searchCriteria, setSearchCriteria] = useState({
    id: '',
    title: '',
    completed: '',
  });
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3001/todos?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);
        setFilteredTodos(data); // Set the initial filtered todos
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [userId]);

  useEffect(() => {
    let data = [...todos];

    // Filtering logic based on search criteria
    data = data.filter(todo =>
      (!searchCriteria.id || todo.id.toString().includes(searchCriteria.id)) &&
      (!searchCriteria.title || todo.title.toLowerCase().includes(searchCriteria.title.toLowerCase())) &&
      (searchCriteria.completed === '' || todo.completed === (searchCriteria.completed === 'true'))
    );

    // Sorting logic based on selected criteria
    switch (sortCriteria) {
      case 'sequential':
        // No sorting needed
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

    setFilteredTodos(data);
  }, [todos, sortCriteria, searchCriteria]);

  const getMaxTodoId = () => {
    const maxId = todos.reduce((max, todo) => (parseInt(todo.id) > max ? parseInt(todo.id) : max), 0);
    return maxId + 1;
  };

  const handleCheckboxChange = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      );
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async id => {
    try {      
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleAddTodo = async e => {
    e.preventDefault();
    try {
      const newTodo = {
        userId: parseInt(userId),
        id: getMaxTodoId(),
        title: newTodoTitle,
        completed: false,
      };
      const response = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) {
        throw new Error('Failed to add new todo');
      }
      setTodos([...todos, newTodo]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error adding new todo:', error);
    }
  };

  const handleSortChange = e => {
    setSortCriteria(e.target.value);
  };

  const handleUpdateTodo = async id => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editingTodoTitle }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, title: editingTodoTitle } : todo
      );
      setTodos(updatedTodos);
      setEditingTodoId(null);
      setEditingTodoTitle('');
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const startEditingTodo = (id, title) => {
    setEditingTodoId(id);
    setEditingTodoTitle(title);
  };
  
  return (
    <div>
      <h2>Todos List</h2>
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
      <label>Sort by:</label>
      <select value={sortCriteria} onChange={handleSortChange}>
        <option value="sequential">Sequential</option>
        <option value="completed">Completed</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="random">Random</option>
      </select>
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
      <ul>
        {filteredTodos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleCheckboxChange(todo.id, todo.completed)}
            />
            {editingTodoId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editingTodoTitle}
                  onChange={e => setEditingTodoTitle(e.target.value)}
                />
                <button onClick={() => handleUpdateTodo(todo.id)}>Save</button>
                <button onClick={() => setEditingTodoId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{`${todo.id} - ${todo.title}`}</span>
                <button onClick={() => startEditingTodo(todo.id, todo.title)}>Edit</button>
                <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/home/${currentUser.username}`)}>Return to Home</button>
    </div>
  );
};

export default TodosPage;
