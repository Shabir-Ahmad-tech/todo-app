import { useState } from 'react';
import './TodoItem.css';

function TodoItem({ todo, onUpdate, onDelete, style }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editDescription, setEditDescription] = useState(todo.description || '');

    const handleToggle = () => {
        onUpdate(todo.id, { ...todo, completed: !todo.completed });
    };

    const handleSave = () => {
        if (editTitle.trim()) {
            onUpdate(todo.id, {
                ...todo,
                title: editTitle.trim(),
                description: editDescription.trim(),
            });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditTitle(todo.title);
        setEditDescription(todo.description || '');
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            onDelete(todo.id);
        }
    };

    const getPriorityColor = () => {
        switch (todo.priority) {
            case 'high': return 'var(--priority-high)';
            case 'medium': return 'var(--priority-medium)';
            case 'low': return 'var(--priority-low)';
            default: return 'var(--text-secondary)';
        }
    };

    const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

    return (
        <div
            className={`todo-item glass ${todo.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
            style={style}
        >
            <div className="todo-main">
                <button
                    className="checkbox"
                    onClick={handleToggle}
                    aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                    {todo.completed && <span className="checkmark">✓</span>}
                </button>

                <div className="todo-content">
                    {isEditing ? (
                        <div className="edit-form">
                            <input
                                type="text"
                                className="edit-title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                autoFocus
                            />
                            <textarea
                                className="edit-description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                placeholder="Description (optional)"
                                rows="2"
                            />
                            <div className="edit-actions">
                                <button className="save-button" onClick={handleSave}>
                                    Save
                                </button>
                                <button className="cancel-button" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h4 className="todo-title">{todo.title}</h4>
                            {todo.description && (
                                <p className="todo-description">{todo.description}</p>
                            )}

                            <div className="todo-meta">
                                <span
                                    className="priority-badge"
                                    style={{ backgroundColor: getPriorityColor() }}
                                >
                                    {todo.priority}
                                </span>

                                {todo.dueDate && (
                                    <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                                        📅 {new Date(todo.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {!isEditing && (
                <div className="todo-actions">
                    <button
                        className="action-button edit"
                        onClick={() => setIsEditing(true)}
                        title="Edit task"
                    >
                        ✏️
                    </button>
                    <button
                        className="action-button delete"
                        onClick={handleDelete}
                        title="Delete task"
                    >
                        🗑️
                    </button>
                </div>
            )}
        </div>
    );
}

export default TodoItem;
