import './Stats.css';

function Stats({ todos, stats }) {
    const categoryStats = todos.reduce((acc, todo) => {
        const cat = todo.category || 'general';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const priorityStats = todos.reduce((acc, todo) => {
        acc[todo.priority] = (acc[todo.priority] || 0) + 1;
        return acc;
    }, {});

    const upcomingTasks = todos.filter(todo => {
        if (!todo.dueDate || todo.completed) return false;
        const daysUntil = Math.ceil((new Date(todo.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysUntil >= 0 && daysUntil <= 7;
    });

    return (
        <div className="stats-panel glass">
            <h2 className="stats-title">📊 Statistics</h2>

            <div className="stat-card glass">
                <h3>Completion Rate</h3>
                <div className="progress-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" className="progress-bg" />
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            className="progress-bar"
                            style={{
                                strokeDashoffset: 283 - (283 * stats.completionRate) / 100
                            }}
                        />
                    </svg>
                    <div className="progress-text">
                        <span className="progress-value">{stats.completionRate}%</span>
                    </div>
                </div>
            </div>

            <div className="stat-card glass">
                <h3>By Category</h3>
                <div className="stat-list">
                    {Object.entries(categoryStats).map(([category, count]) => (
                        <div key={category} className="stat-item">
                            <span className="stat-label">{category}</span>
                            <span className="stat-badge">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="stat-card glass">
                <h3>By Priority</h3>
                <div className="stat-list">
                    {Object.entries(priorityStats).map(([priority, count]) => (
                        <div key={priority} className="stat-item">
                            <span className="stat-label">{priority}</span>
                            <span className="stat-badge priority-badge" data-priority={priority}>
                                {count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {upcomingTasks.length > 0 && (
                <div className="stat-card glass upcoming">
                    <h3>📅 Due This Week</h3>
                    <div className="upcoming-list">
                        {upcomingTasks.map(todo => (
                            <div key={todo.id} className="upcoming-item">
                                <span className="upcoming-title">{todo.title}</span>
                                <span className="upcoming-date">
                                    {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stats;
