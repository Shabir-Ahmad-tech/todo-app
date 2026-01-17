import TodoItem from './TodoItem';
import './TodoList.css';

function TodoList({ todos, onUpdate, onDelete }) {
    if (todos.length === 0) {
        return (
            <div className="empty-state glass">
                <div className="empty-icon">📝</div>
                <h3>No tasks found</h3>
                <p>Add a new task to get started!</p>
            </div>
        );
    }

    // Group todos by category
    const groupedTodos = todos.reduce((acc, todo) => {
        const category = todo.category || 'general';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(todo);
        return acc;
    }, {});

    return (
        <div className="todo-list">
            {Object.entries(groupedTodos).map(([category, categoryTodos]) => (
                <div key={category} className="category-group">
                    <div className="category-header">
                        <h3 className="category-title">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h3>
                        <span className="category-count">{categoryTodos.length}</span>
                    </div>

                    <div className="todos-container">
                        {categoryTodos.map((todo, index) => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TodoList;
