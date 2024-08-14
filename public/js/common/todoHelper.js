class TodoHelper {
    constructor() {
        this.todos = {};
    }

    // 추후 DB 연결 시 DB 데이터 조회 후 처리 과정 필요
    init() {
    }

    /**
     * Todo 등록
     * @param {String} day 
     * @param {String} id 
     * @param {String} todo 
     */
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

    /**
     * 해당 날짜의 Todo 가져오기 (day없으면 전체 Todo 가져오기)
     * @param {String} day 
     * @returns {Array}
     */
    getTodos(day) {
        return !day ? this.todos : this.todos[day] || [];
    }

    /**
     * Todo 제거
     * @param {String} day 
     * @param {String} id 
     */
    removeTodo(day, id) {
        if(!day || !id) return;
        this.todos[day] = this.todos[day].filter(todo => todo.id !== id)
    }

    /**
     * Todo 상태 변경
     * @param {String} day 
     * @param {String} id 
     * @param {Boolean} isFinish 
     */
    changeStateTodo(day, id, isFinish) {
        if(!day || !id) return;
        this.todos[day].find(todo => todo.id === id).isFinish = isFinish;
    }

    /**
     * Todo 할일 변경
     * @param {String} day 
     * @param {String} id 
     * @param {String} todo 
     */
    updateTodo(day, id, todo) {
        if(!day || !id) return;
        this.todos[day].find(todo => todo.id === id).todo = todo;
    }
}

export default new TodoHelper();