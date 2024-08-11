import AMapLoader from '@amap/amap-jsapi-loader';
import { useEffect, useState } from 'react';
import Forecasts from './forecasts';

interface WeatherForecasts {
    [key: string]: string;
}

interface WeatherData {
    [key: string]: string | WeatherForecasts[] | undefined;
    forecasts?: WeatherForecasts[];
}

function Weather() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    // @ts-ignore
    window._AMapSecurityConfig = {
        securityJsCode: '8992297c0d669a79a1b75e7802d7b1ad',
    };

    useEffect(() => {
        AMapLoader.load({
            key: '6307d0f539f39f3d3e056363bcfb177f', // 申请好的Web端开发者Key，首次调用 load 时必填
            version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            plugins: ['AMap.Weather', 'AMap.CitySearch'], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
        }).then(AMap => {
            new AMap.CitySearch().getLocalCity(function (
                status: string,
                result: { info: string; city: any },
            ) {
                if (status === 'complete' && result.info === 'OK') {
                    const weatherObj = new AMap.Weather();

                    weatherObj.getForecast(
                        result.city,
                        function (err: any, data: any) {
                            if (data.info === 'OK' && data.forecasts) {
                                setWeather(_prve => ({ ..._prve, ...data }));
                            }
                        },
                    );

                    weatherObj.getLive(
                        result.city,
                        function (err: any, data: any) {
                            if (data.info === 'OK') {
                                setWeather(_prve => ({
                                    ..._prve,
                                    ...{
                                        temperature: data.temperature,
                                        humidity: data.humidity,
                                        windDirection: data.windDirection,
                                        windPower: data.windPower,
                                        weather: data.weather,
                                    },
                                }));
                            }
                        },
                    );
                }
            });
        });
    }, []);

    function generatedLayout() {
        if (weather) {
            const { dayTemp, nightTemp } = weather.forecasts?.[0] ?? {};

            return (
                <>
                    <div className="flex flex-col justify-center items-center mr-2 p-2">
                        <span className="text-xs">{weather.city + ''}</span>
                        <span className="text-4xl">
                            {weather.temperature + '°'}
                        </span>
                    </div>
                    <div className="flex flex-col justify-center items-center mr-4">
                        <span>{weather.weather + ''}</span>
                        <span>{`${weather.windDirection}风${
                            typeof weather.windPower === 'string'
                                ? weather.windPower.match(/\d+/)?.[0]
                                : weather.windPower
                        }级`}</span>
                        <span>
                            {dayTemp >= nightTemp
                                ? `${nightTemp}~${dayTemp}°C`
                                : `${dayTemp}~${nightTemp}°C`}
                        </span>
                    </div>
                    {weather.forecasts?.map((_val, _idx) => {
                        if (_idx) {
                            return (
                                <Forecasts forecastsData={_val} key={_idx} />
                            );
                        }
                    })}
                </>
            );
        } else {
            return <div></div>;
        }
    }

    return (
        <div className="h-1/3 w-full p-2.5 text-white flex justify-center items-center">
            {weather ? generatedLayout() : <p>Loading...</p>}
        </div>
    );
}

export default Weather;
