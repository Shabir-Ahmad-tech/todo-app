import { useState, useEffect } from 'react';
import Header from './components/Header';
import TodoInput from './components/TodoInput';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';
import Stats from './components/Stats';
import AnimatedBackground from './components/AnimatedBackground';
import Footer from './components/Footer';
import { todosAPI } from './api/storage';
import { checkDetails, sendNotification } from './utils/notifications';
import './App.css';

function App() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved || 'dark';
    });

    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showStats, setShowStats] = useState(false);

    // Request notification permission on load
    useEffect(() => {
        if (Notification.permission === 'default') {
            checkDetails.requestPermission();
        }
    }, []);

    // Check for due tasks every minute
    useEffect(() => {
        const checkDueTasks = () => {
            const now = new Date();
            todos.forEach(todo => {
                if (!todo.completed && todo.dueDate && !todo.notified) {
                    const due = new Date(todo.dueDate);
                    const timeDiff = due - now;

                    // Notify if due within notification window (e.g., just passed or due in 1 min)
                    if (timeDiff <= 0 && timeDiff > -60000) {
                        sendNotification(
                            `Task Due: ${todo.title}`,
                            `Time to finish: ${todo.title}!`
                        );
                        markAsNotified(todo.id);
                    }
                }
            });
        };

        const interval = setInterval(checkDueTasks, 60000); // Check every minute
        checkDueTasks(); // Initial check

        return () => clearInterval(interval);
    }, [todos]);

    const markAsNotified = async (id) => {
        setTodos(prev => prev.map(t =>
            t.id === id ? { ...t, notified: true } : t
        ));
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const data = await todosAPI.getAll();
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async (todoData) => {
        try {
            const newTodo = await todosAPI.create(todoData);
            setTodos([newTodo, ...todos]);
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const updateTodo = async (id, updates) => {
        try {
            const updatedTodo = await todosAPI.update(id, updates);
            setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await todosAPI.delete(id);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const clearCompleted = async () => {
        try {
            await todosAPI.clearCompleted();
            setTodos(todos.filter(todo => !todo.completed));
        } catch (error) {
            console.error('Error clearing completed todos:', error);
        }
    };

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    const getFilteredTodos = () => {
        let filtered = todos;

        // Filter by completion status
        if (filter === 'active') {
            filtered = filtered.filter(todo => !todo.completed);
        } else if (filter === 'completed') {
            filtered = filtered.filter(todo => todo.completed);
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(todo => todo.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(todo =>
                todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return filtered;
    };

    const stats = {
        total: todos.length,
        completed: todos.filter(todo => todo.completed).length,
        active: todos.filter(todo => !todo.completed).length,
        completionRate: todos.length > 0 ? Math.round((todos.filter(todo => todo.completed).length / todos.length) * 100) : 0,
    };

    return (
        <div className="app">
            <AnimatedBackground />

            <Header
                theme={theme}
                toggleTheme={toggleTheme}
                stats={stats}
                onStatsClick={() => setShowStats(!showStats)}
            />

            <main className="main-content container">
                <div className="app-grid">
                    <div className="main-column">
                        <TodoInput onAdd={addTodo} />

                        <FilterBar
                            filter={filter}
                            setFilter={setFilter}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            onClearCompleted={clearCompleted}
                            hasCompleted={todos.some(todo => todo.completed)}
                        />

                        <TodoList
                            todos={getFilteredTodos()}
                            onUpdate={updateTodo}
                            onDelete={deleteTodo}
                        />
                    </div>

                    {showStats && (
                        <div className="stats-column">
                            <Stats todos={todos} stats={stats} />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;
