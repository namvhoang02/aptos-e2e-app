import {
  fetchListRequest,
  fetchListSuccess,
  fetchListFailure,
  completeTask,
  addTask,
  deleteTask,
} from './actions';
import {
  FETCH_LIST_REQUEST,
  FETCH_LIST_SUCCESS,
  FETCH_LIST_FAILURE,
  COMPLETE_TASK,
  ADD_TASK,
  DELETE_TASK,
} from './constants';
import { type Task } from './types';

describe('components/landing/context/actions', () => {
  describe('fetchListRequest', () => {
    it('should create an action to fetch the task list', () => {
      const expectedAction = {
        type: FETCH_LIST_REQUEST,
      };

      expect(fetchListRequest()).toEqual(expectedAction);
    });
  });

  describe('fetchListSuccess', () => {
    it('should create an action for successfully fetching the task list', () => {
      const tasks: Task[] = [
        { id: '1', name: 'Task 1', completed: false },
        { id: '2', name: 'Task 2', completed: true },
      ];
      const expectedAction = {
        type: FETCH_LIST_SUCCESS,
        payload: tasks,
      };

      expect(fetchListSuccess(tasks)).toEqual(expectedAction);
    });
  });

  describe('fetchListFailure', () => {
    it('should create an action for failed fetching of task list', () => {
      const error = new Error('Failed to fetch tasks');
      const expectedAction = {
        type: FETCH_LIST_FAILURE,
        payload: error,
        error: true,
      };

      expect(fetchListFailure(error)).toEqual(expectedAction);
    });
  });

  describe('completeTask', () => {
    it('should create an action to complete a task', () => {
      const taskId = '123';
      const expectedAction = {
        type: COMPLETE_TASK,
        payload: taskId,
      };

      expect(completeTask(taskId)).toEqual(expectedAction);
    });
  });

  describe('addTask', () => {
    it('should create an action to add a new task', () => {
      const task: Task = { id: '123', name: 'New Task', completed: false };
      const expectedAction = {
        type: ADD_TASK,
        payload: task,
      };

      expect(addTask(task)).toEqual(expectedAction);
    });
  });

  describe('deleteTask', () => {
    it('should create an action to delete a task', () => {
      const task: Task = { id: '123', name: 'Task to delete', completed: false };
      const expectedAction = {
        type: DELETE_TASK,
        payload: task,
      };

      expect(deleteTask(task)).toEqual(expectedAction);
    });
  });
});
