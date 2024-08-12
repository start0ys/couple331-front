class TodoHelper {
    constructor() {
        this.todos = {};
    }

    // 추후 DB 연결 시 DB 데이터 조회 후 처리 과정 필요
    init() {
    }

    setTodo(day, id, todo) {
        if(!day || !id || !todo) return;

        const todos = this.todos[day] || [];
        todos.push({
            id: id,
            todo: todo,
            isFinish: false
        });
        this.todos[day] = todos;
    }

    getTodos(day) {
        return !day ? this.todos : this.todos[day] || [];
    }

    removeTodo(day, id) {
        if(!day || !id) return;
        this.todos[day] = this.todos[day].filter(todo => todo.id !== id)
    }

    changeStateTodo(day, id, isFinish) {
        if(!day || !id) return;
        this.todos[day].find(todo => todo.id === id).isFinish = isFinish;
    }

    updateTodo(day, id, todo) {
        if(!day || !id) return;
        this.todos[day].find(todo => todo.id === id).todo = todo;
    }
}

export default new TodoHelper();