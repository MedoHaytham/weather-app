import { configureStore } from '@reduxjs/toolkit'
import weatherReducer from './weatheApiSlice'

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
  },
})