// localStorage-based storage (no backend needed!)
const STORAGE_KEY = 'todoflow_tasks';

export const todosAPI = {
    // Get all todos
    async getAll() {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    // Get single todo
    async getById(id) {
        const todos = await this.getAll();
        return todos.find(todo => todo.id === id);
    },

    // Create new todo
    async create(todoData) {
        const todos = await this.getAll();
        const newTodo = {
            id: Date.now(),
            ...todoData,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        todos.unshift(newTodo);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        return newTodo;
    },

    // Update todo
    async update(id, updates) {
        const todos = await this.getAll();
        const index = todos.findIndex(todo => todo.id === id);
        if (index === -1) throw new Error('Todo not found');

        todos[index] = { ...todos[index], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        return todos[index];
    },

    // Delete todo
    async delete(id) {
        const todos = await this.getAll();
        const filtered = todos.filter(todo => todo.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return { message: 'Todo deleted successfully' };
    },

    // Clear completed
    async clearCompleted() {
        const todos = await this.getAll();
        const active = todos.filter(todo => !todo.completed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
        return { message: `Deleted ${todos.length - active.length} completed todos` };
    },
};
