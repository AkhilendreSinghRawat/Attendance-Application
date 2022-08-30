import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  employeesData: [],
  selectedCheckboxIds: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    getEmployeesData(state, action) {
      state.employeesData = action.payload;
      return state;
    },
    setEmployeesData(state, action) {
      state.employeesData.push(action.payload);
      return state;
    },
    clearEmployeeData(state, action) {
      state.employeesData = state.employeesData.filter(
        item => item.id !== action.payload,
      );
      return state;
    },
    setSelectedCheckboxIds(state, action) {
      state.selectedCheckboxIds = action.payload;
      return state;
    },
  },
});

export const {
  getEmployeesData,
  setEmployeesData,
  clearEmployeeData,
  setSelectedCheckboxIds,
} = appSlice.actions;

export default appSlice.reducer;
