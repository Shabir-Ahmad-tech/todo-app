import { useState } from 'react';
import './TodoInput.css';

const CATEGORIES = ['general', 'work', 'personal', 'shopping', 'health', 'learning'];
const PRIORITIES = ['low', 'medium', 'high'];

function TodoInput({ onAdd }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('general');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAdd({
            title: title.trim(),
            description: description.trim(),
            category,
            priority,
            dueDate: dueDate || null,
            completed: false,
        });

        // Reset form
        setTitle('');
        setDescription('');
        setCategory('general');
        setPriority('medium');
        setDueDate('');
        setShowAdvanced(false);
    };

    return (
        <form className="todo-input glass" onSubmit={handleSubmit}>
            <div className="input-header">
                <input
                    type="text"
                    className="title-input"
                    placeholder="What needs to be done? ✨"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                />
                <button
                    type="button"
                    className="advanced-toggle"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    {showAdvanced ? '▲' : '▼'}
                </button>
            </div>

            {showAdvanced && (
                <div className="advanced-options">
                    <textarea
                        className="description-input"
                        placeholder="Add a description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="2"
                    />

                    <div className="options-grid">
                        <div className="option-group">
                            <label>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="option-group">
                            <label>Priority</label>
                            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                {PRIORITIES.map(pri => (
                                    <option key={pri} value={pri}>
                                        {pri.charAt(0).toUpperCase() + pri.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="option-group">
                            <label>Due Date</label>
                            <input
                                type="datetime-local"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <button type="submit" className="add-button gradient-primary" disabled={!title.trim()}>
                <span>Add Task</span>
                <span className="button-icon">+</span>
            </button>
        </form>
    );
}

export default TodoInput;
