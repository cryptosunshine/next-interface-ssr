import { createSlice } from '@reduxjs/toolkit';

const initialState = { name: '', email: '', authToken: '' }
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        name: action.payload.name,
        email: action.payload.email,
      };
    },
    setAuthToken: (state, action) => {
      console.log(state, action)
      return {
        ...state,
        authToken: action.payload.authToken,
      };
    }
  },
});

export const { setUser, setAuthToken } = userSlice.actions;
export default userSlice.reducer;
