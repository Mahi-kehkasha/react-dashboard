import { createSlice } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
  backgroundColor: string;
  colorLevel: number;
}

const initialState: CounterState = {
  value: 0,
  backgroundColor: 'hsl(200, 70%, 95%)',
  colorLevel: 0,
};

// Bezier curve function for smooth color transition
const bezierEasing = (t: number): number => {
  // Using a cubic bezier curve (0.4, 0, 0.2, 1)
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.4 * t3 + 0 * t2 + 0.2 * t + 0;
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
      state.colorLevel = Math.min(state.colorLevel + 5, 100); // Increment by 5%, max 100%
      const easedLevel = bezierEasing(state.colorLevel / 100) * 100;
      const lightness = 95 - easedLevel * 0.5; // From 95% to 45% lightness
      const saturation = 70 + easedLevel * 0.3; // From 70% to 100% saturation
      state.backgroundColor = `hsl(200, ${saturation}%, ${lightness}%)`;
    },
    decrement: (state) => {
      state.value -= 1;
      state.colorLevel = Math.max(state.colorLevel - 5, 0); // Decrement by 5%, min 0%
      const easedLevel = bezierEasing(state.colorLevel / 100) * 100;
      const lightness = 95 - easedLevel * 0.5;
      const saturation = 70 + easedLevel * 0.3;
      state.backgroundColor = `hsl(200, ${saturation}%, ${lightness}%)`;
    },
    reset: (state) => {
      state.value = 0;
      state.colorLevel = 0;
      state.backgroundColor = initialState.backgroundColor;
    },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;
