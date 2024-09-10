import { HTTP_STATUS } from '@/lib/constants';
import {
  handleListRequest,
  handleListSuccess,
  handleListFailure,
  handleCompleteTask,
  handleAddTask,
  handleDeleteTask,
} from './tasks';
import { type InitialLandingState, type Task } from '../types';

describe('components/landing/context/reducer/tasks', () => {
  let initialState: InitialLandingState;

  beforeEach(() => {
    initialState = {
      fetchStatus: null,
      errors: null,
      list: [],
      data: {},
    };
  });

  describe('handleListRequest', () => {
    it('should set fetchStatus to LOADING and clear errors', () => {
      const newState = handleListRequest(initialState);
      expect(newState.fetchStatus).toBe(HTTP_STATUS.LOADING);
      expect(newState.errors).toBeNull();
    });
  });

  describe('handleListSuccess', () => {
    it('should populate the list and data from the tasks', () => {
      const tasks: Task[] = [
        { id: '1', name: 'Task 1', completed: false },
        { id: '2', name: 'Task 2', completed: true },
      ];
      const action = { payload: tasks };
      const newState = handleListSuccess(initialState, action);

      expect(newState.fetchStatus).toBe(HTTP_STATUS.LOADED);
      expect(newState.list).toEqual(['1', '2']);
      expect(newState.data).toEqual({
        '1': tasks[0],
        '2': tasks[1],
      });
    });

    it('should return the original state if action is undefined', () => {
      const newState = handleListSuccess(initialState, undefined);
      expect(newState).toEqual(initialState);
    });
  });

  describe('handleListFailure', () => {
    it('should set fetchStatus to FAILED and set the error', () => {
      const error = new Error('Failed to fetch tasks');
      const action = { payload: error };
      const newState = handleListFailure(initialState, action);

      expect(newState.fetchStatus).toBe(HTTP_STATUS.FAILED);
      expect(newState.errors).toBe(error);
    });
  });

  describe('handleCompleteTask', () => {
    it('should mark the task as completed', () => {
      initialState = {
        ...initialState,
        data: {
          '1': { id: '1', name: 'Task 1', completed: false },
        },
      };

      const action = { payload: '1' };
      const newState = handleCompleteTask(initialState, action);

      expect(newState.data['1'].status).toBe('done');
    });

    it('should return the original state if task ID is not found', () => {
      const action = { payload: '2' };
      const newState = handleCompleteTask(initialState, action);
      expect(newState).toEqual(initialState);
    });
  });

  describe('handleAddTask', () => {
    it('should add a new task to the state', () => {
      const task: Task = { id: '1', name: 'New Task', completed: false };
      const action = { payload: task };
      const newState = handleAddTask(initialState, action);

      expect(newState.list).toEqual(['1']);
      expect(newState.data['1']).toEqual(task);
    });

    it('should not add the task if it already exists', () => {
      initialState = {
        ...initialState,
        data: {
          '1': { id: '1', name: 'Task 1', completed: false },
        },
        list: ['1'],
      };

      const task: Task = { id: '1', name: 'Task 1', completed: false };
      const action = { payload: task };
      const newState = handleAddTask(initialState, action);

      expect(newState.list).toEqual(['1']);
      expect(newState.data['1']).toEqual(task);
    });
  });

  describe('handleDeleteTask', () => {
    it('should delete the task from the state', () => {
      initialState = {
        ...initialState,
        list: ['1'],
        data: {
          '1': { id: '1', name: 'Task 1', completed: false },
        },
      };

      const task: Task = { id: '1', name: 'Task 1', completed: false };
      const action = { payload: task };
      const newState = handleDeleteTask(initialState, action);

      expect(newState.list).toEqual([]);
      expect(newState.data['1']).toBeUndefined();
    });

    it('should return the original state if task does not exist', () => {
      const task: Task = { id: '2', name: 'Nonexistent Task', completed: false };
      const action = { payload: task };
      const newState = handleDeleteTask(initialState, action);

      expect(newState).toEqual(initialState);
    });
  });
});
