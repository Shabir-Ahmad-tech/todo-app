import './Header.css';

function Header({ theme, toggleTheme, stats, onStatsClick }) {
    return (
        <header className="header glass">
            <div className="container header-content">
                <div className="header-left">
                    <h1 className="logo gradient-text">✨ TodoFlow</h1>
                    <p className="tagline">Your Premium Task Manager</p>
                </div>

                <div className="header-right">
                    <div className="stats-summary">
                        <div className="stat-item">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value completed">{stats.completed}</span>
                            <span className="stat-label">Done</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value active">{stats.active}</span>
                            <span className="stat-label">Active</span>
                        </div>
                    </div>

                    <button
                        className="icon-button stats-button"
                        onClick={onStatsClick}
                        title="Toggle Statistics"
                    >
                        📊
                    </button>

                    <button
                        className="theme-toggle icon-button"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;
