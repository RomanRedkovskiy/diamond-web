import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        setUser(state, action) {
            state.id = action.payload?.id;
            state.login = action.payload?.login;
            state.role = action.payload?.role;
            state.inviterLogin = action.payload?.inviterLogin;
            state.balance = action.payload?.balance;
            state.about = action.payload?.about;
            state.registrationTime = action.payload?.registrationTime;
        }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;