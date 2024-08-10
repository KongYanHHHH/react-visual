type ForecastsData = {
    [key: string]: string;
};

function Forecasts({ forecastsData }: { forecastsData: ForecastsData }) {
    const { dayTemp, nightTemp } = forecastsData;
    return (
        <div className="flex justify-center items-center flex-col border-l p-2 border-dashed border-l-stone-500">
            <span>{forecastsData.date.slice(5)}</span>
            <span>{forecastsData.dayWeather}</span>
            <span>
                {dayTemp >= nightTemp
                    ? `${nightTemp}~${dayTemp}°C`
                    : `${dayTemp}~${nightTemp}°C`}
            </span>
        </div>
    );
}

export default Forecasts;
