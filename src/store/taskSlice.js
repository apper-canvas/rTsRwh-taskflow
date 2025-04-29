import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  currentTask: null,
  stats: {
    completed: 0,
    pending: 0,
    total: 0,
  },
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
      // Update stats
      const completed = action.payload.filter(task => task.is_completed).length;
      state.stats = {
        completed,
        pending: action.payload.length - completed,
        total: action.payload.length,
      };
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      // Update stats
      state.stats.total += 1;
      if (action.payload.is_completed) {
        state.stats.completed += 1;
      } else {
        state.stats.pending += 1;
      }
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.Id === action.payload.Id);
      if (index !== -1) {
        const oldTask = state.tasks[index];
        state.tasks[index] = action.payload;
        
        // Update stats if completion status changed
        if (oldTask.is_completed !== action.payload.is_completed) {
          if (action.payload.is_completed) {
            state.stats.completed += 1;
            state.stats.pending -= 1;
          } else {
            state.stats.completed -= 1;
            state.stats.pending += 1;
          }
        }
      }
    },
    removeTask: (state, action) => {
      const taskToRemove = state.tasks.find(task => task.Id === action.payload);
      state.tasks = state.tasks.filter(task => task.Id !== action.payload);
      
      // Update stats
      state.stats.total -= 1;
      if (taskToRemove && taskToRemove.is_completed) {
        state.stats.completed -= 1;
      } else if (taskToRemove) {
        state.stats.pending -= 1;
      }
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setCurrentTask,
  setLoading,
  setError,
} = taskSlice.actions;

// Selectors
export const selectTasks = (state) => state.tasks.tasks;
export const selectTaskById = (state, taskId) => 
  state.tasks.tasks.find(task => task.Id === taskId);
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;
export const selectCurrentTask = (state) => state.tasks.currentTask;
export const selectTaskStats = (state) => state.tasks.stats;

export default taskSlice.reducer;