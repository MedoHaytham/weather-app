/* eslint-disable react-hooks/set-state-in-effect */
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import dayjs from 'dayjs';
import {toast}  from 'react-toastify';

import 'dayjs/locale/ar';


const toArabicNumbers = (string) => {
  const arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
  return string.replace(/[0-9]/g, (w) => arabicNumbers[+w]);
};

function App() {

  const { t, i18n } = useTranslation();
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [weather, setWeather] = useState({
    name: '',
    temp: null,
    description: '',
    min: null,
    max: null,
    icon: '',
  });
  const [dateAndTime, setDateAndTime] = useState('');
  const [locale, setLocale] = useState('ar');
  const direction = locale === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => toast.error('Geolocation error:' + err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(()=>{
    if (!coords.lat || !coords.lon) return;
    async function fetchWeather() {
      try {
        let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=e6e5cdf4bbf0ab6cf484e5b6adea6562&lang=${i18n.language}`)
        const name = response.data.name;
        const temp = Math.round(response.data.main.temp - 272.15);
        const description = response.data.weather[0].description;
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const icon = response.data.weather[0].icon;
        setWeather({
          name,
          temp,
          description,
          min,
          max,
          icon,
        });
      } catch (error) {
        toast.error('Error on fetch Weather' + error);
      }
    }
    fetchWeather();
  },[coords.lat, coords.lon, i18n.language]);

  useEffect(() => {
    dayjs.locale('ar');
    setDateAndTime(dayjs().format('dddd D MMMM YYYY'));
  },[]);

  useEffect(() => {
    i18n.changeLanguage('ar');
  },[]);

  function langHandler() {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
    dayjs.locale(newLocale);
    setDateAndTime(dayjs().format('dddd D MMMM YYYY'));
  }

  return (
    <section>
      <Container maxWidth="sm" className='h-screen relative flex flex-col justify-center items-center'>
        <div className="card w-full rounded-[15px] text-white bg-[rgba(28,52,91,0.36)] p-2.5 shadow-[0px_11px_1px_rgba(0,0,0,0.05)]">
          <div className="content">
            <div className="city-time flex justify-start items-end gap-5 mb-2.5" dir={direction}>
              <Typography variant="h2" className=' text-[20px]! md:text-[45px]! mr-5! font-semibold!'>
                {t(weather.name)}
              </Typography>
              <Typography variant="h5" className='text-[16px]! md:text-[24px]!'> 
                {dateAndTime}
              </Typography>
            </div>
            <hr />
            <div className='flex justify-around' dir={direction}>
              <div className="degree">
                <div className='temp flex justify-center items-center'>
                  <Typography variant="h1" className='text-[76px]! md:text-[96px]!'>
                    {locale === 'en'? weather.temp : weather.temp !== null ? toArabicNumbers(weather.temp.toString()) : ''}
                  </Typography>
                  <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} className='w-15 md:w-full' alt="icon" />
                </div>
                <Typography variant="h6" className='text-[15px]! md:text-[20px]!'>
                  {t(weather.description)}
                </Typography>
                <div className='min-max flex items-center'>
                  <h5 className='capitalize'>{t('min')} : {locale === 'en' ? weather.min : weather.min !== null ? toArabicNumbers(weather.min.toString()) : ''}</h5> 
                  <h5 className='mx-1.5'>|</h5> 
                  <h5 className='capitalize'>{t('max')} : {locale === 'en' ? weather.max : weather.max !== null ? toArabicNumbers(weather.max.toString()) : ''}</h5>
                </div>
              </div>
              <CloudIcon className='text-[135px]! md:text-[200px]! text-white!'/>
            </div>
          </div>
        </div>
        <div className='w-full flex justify-end' dir={direction}>
          <Button variant="text" className='mt-2.5 md:mt-5! text-white! capitalize!' onClick={langHandler}>{locale === 'en' ? 'Arabic' : 'إنجليزى'}</Button>
        </div>
      </Container>
    </section>
  )
}

export default App
