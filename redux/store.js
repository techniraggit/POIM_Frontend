import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loading',
  initialState: {
    loading: false
  },
  reducers: {
    SET_LOADING: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const store =  configureStore({
    reducer: {
      loader: loaderSlice.reducer
    }
});

export const { SET_LOADING } = loaderSlice.actions;
export default loaderSlice.reducer;