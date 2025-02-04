import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface UserState {
  users: UserData[];
  currentForm: Partial<UserData>;
  hasUnsavedChanges: boolean;
}

const initialState: UserState = {
  users: [],
  currentForm: {},
  hasUnsavedChanges: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateFormField: (
      state,
      action: PayloadAction<{ field: keyof UserData; value: string }>
    ) => {
      state.currentForm = {
        ...state.currentForm,
        [action.payload.field]: action.payload.value,
      };
      state.hasUnsavedChanges = true;
    },
    saveUser: (state) => {
      const newUser = {
        ...state.currentForm,
        id: uuidv4(),
      } as UserData;
      state.users.push(newUser);
      state.currentForm = {};
      state.hasUnsavedChanges = false;
    },
    resetForm: (state) => {
      state.currentForm = {};
      state.hasUnsavedChanges = false;
    },
    setHasUnsavedChanges: (state, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
    },
  },
});

export const { updateFormField, saveUser, resetForm, setHasUnsavedChanges } =
  userSlice.actions;
export default userSlice.reducer;
