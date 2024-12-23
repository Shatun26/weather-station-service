type WeatherData = {
  id: number;
  temperature: number;
  humidity: number;
  location: string;
  timestamp: Date;
};

const weatherData: WeatherData[] = [];

export const getAllWeatherData = () => {
  return weatherData;
};

export const addWeatherData = (data: { temperature: number; humidity: number; location: string }) => {
  const newData: WeatherData = {
    id: weatherData.length + 1,
    ...data,
    timestamp: new Date(),
  };
  weatherData.push(newData);
  return newData;
};
