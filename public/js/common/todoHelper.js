import { handleApiResponse } from './common.js';
import { request } from "./axios.js";

class TodoHelper {
    constructor() {
        this.todos = {};
    }

    /**
     * Todo Setting
     * @param {Integer} id 
     */
    async init(id) {
        const dbData = await this.#synchronizationDB(`/${id}`, 'get', null);
        if(!!dbData)
            this.todos = dbData;
    }

    /**
     * Todo 등록
     * @param {String} day 
     * @param {String} id 
     * @param {String} todo 
     * @param {Boolean} isSynchronization
     */
    setTodo(day, id, todo, isSynchronization = false) {
        if(!day || !id || !todo) return;

        const todos = this.todos[day] || [];
        const data = {
            id: id,
            todo: todo,
            completedYn: 'N',
            dayOrder: todos.length + 1
        };
        todos.push(data);
        this.todos[day] = todos;

        if(isSynchronization) {
            data.day = day;
            data.createUserId = _userId;
            this.#synchronizationDB('/register', 'post', data);
        }
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
     * @param {Boolean} isSynchronization
     */
    removeTodo(day, id, isSynchronization = false) {
        if(!day || !id) return;
        this.todos[day] = this.todos[day].filter(todo => todo.id !== id)
        if(isSynchronization) {
            this.#synchronizationDB(`/${id}`, 'delete', null);
        }
    }

    /**
     * Todo 상태 변경
     * @param {String} day 
     * @param {String} id 
     * @param {"Y" | "N"} completedYn 
     * @param {Boolean} isSynchronization
     */
    changeStateTodo(day, id, completedYn, isSynchronization = false) {
        if(!day || !id) return;
        this.todos[day].find(todo => todo.id === id).completedYn = completedYn;
        if(isSynchronization) {
            this.#synchronizationDB('', 'patch', {id, completedYn, updateUserId: _userId});
        }
    }

    /**
     * Todo 할일 변경
     * @param {String} day 
     * @param {String} id 
     * @param {String} todo 
     * @param {Boolean} isSynchronization
     */
    updateTodo(day, id, todo, isSynchronization = false) {
        if(!day || !id) return;
        this.todos[day].find(todo => todo.id === id).todo = todo;
        if(isSynchronization) {
            this.#synchronizationDB('', 'patch', {id, todo, updateUserId: _userId});
        }
    }

    /**
     * DB 동기화
     * @param {String} url 
     * @param {String} apiType 
     * @param {Object} data 
     * @returns 
     */
    async #synchronizationDB(url, apiType, data) {
        if(!apiType)
            return null;

        return handleApiResponse(
            () => request(apiType, `/api/todo${url}`,  data),
            (res) => res?.data || null,
            false,
            ''
        );
    }
}

export default new TodoHelper();