import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { toast } from 'react-toastify';


const initialState = {
  weather: {},
  isLoading : false,
}

export const fetchWeather = createAsyncThunk('weather/fetchWeather', async ({lat, lon, lang}, { rejectWithValue }) => {
  try {
    let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&lang=${lang}`);
    const name = response.data.name;
    const temp = Math.round(response.data.main.temp - 273.15); 
    const description = response.data.weather[0].description; 
    const min = Math.round(response.data.main.temp_min - 273.15); 
    const max = Math.round(response.data.main.temp_max - 273.15); 
    const icon = response.data.weather[0].icon;
  
    return { name, temp, description, min, max, icon}
  } catch (error) {
    toast.error('Error on fetch Weather' + error);
    return rejectWithValue(error.message);
  }
});


export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchWeather.pending, (state) => {
      state.isLoading = true;
    }).addCase(fetchWeather.fulfilled, (state, action) => {
      state.isLoading = false;
      state.weather = action.payload;
    }).addCase(fetchWeather.rejected, (state) => {
      state.isLoading = false;
    })
  }
});


export default weatherSlice.reducer;
