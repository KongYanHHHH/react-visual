import { useEffect, useLayoutEffect, useRef } from 'react';

import { useImmer } from 'use-immer';

import type { LineSeriesOption } from 'echarts/charts';
import type {
    TitleComponentOption,
    TooltipComponentOption,
    GridComponentOption,
    DatasetComponentOption,
    LegendComponentOption,
} from 'echarts/components';
import { type ComposeOption, type EChartsType } from 'echarts/core';

import useFetchWrapper from '@/hooks/useFetchWrapper';

type ECOption = ComposeOption<
    | LineSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | DatasetComponentOption
    | LegendComponentOption
>;

type EchartsType =
    typeof import('d:/job/react-visual/node_modules/echarts/core');

const legendTextStyle = { color: '#fff' };

function Four({ echartsObj }: { echartsObj: EchartsType }) {
    const lineRef = useRef(null);
    const fetchInstance = useFetchWrapper();

    const instance = useRef<EChartsType>();

    const [option, updateOption] = useImmer<ECOption>({
        xAxis: {},
        yAxis: { type: 'value', name: '%RH' },
        legend: {},
        series: [],
        title: {
            text: '湿度',
        },
        tooltip: {
            trigger: 'axis',
        },
    });

    async function getData() {
        const data = await fetchInstance.get(fetchInstance.apiUri.getTwo);

        const seriesData: any[] = [];
        const legendData: string[] = [];
        const xAxisData: string[] = [];

        if (Array.isArray(data)) {
            data.forEach((item, idx) => {
                legendData.push(item.name);
                seriesData.push({
                    name: item.name,
                    type: 'line',
                    smooth: true,
                    data: [],
                });

                for (const _d of item.data.reverse()) {
                    if (!idx) {
                        xAxisData.push(_d.time);
                    }

                    seriesData[idx].data.push(_d.humidness);
                }
            });

            updateOption(draft => {
                draft.legend = { textStyle: legendTextStyle, data: legendData };
                draft.xAxis = {
                    type: 'category',
                    boundaryGap: true,
                    data: xAxisData,
                };
                draft.series = seriesData;
            });
        }
    }

    useEffect(() => {
        let timer: NodeJS.Timer | undefined = setInterval(
            getData,
            3 * 60 * 1000,
        );

        getData();

        return () => {
            clearInterval(timer);
            timer = undefined;
        };
    }, []);

    useLayoutEffect(() => {
        if (!instance.current) {
            instance.current = echartsObj.init(lineRef.current, {
                universalTransition: true,
            });
        } else {
            instance.current.resize();
        }
        instance.current.setOption(option);
    }, [option]);

    return (
        <div className="h-1/3 w-full relative p-2.5">
            <div
                className="w-full h-full relative rounded-2xl overflow-hidden 
                before:absolute before:w-2/3 before:h-turnBorder before:bg-orange-600 before:-z-20 before:left-1/2 before:top-1/2 before:animate-reverseSpin3s before:origin-top-left 
                after:absolute after:-z-10 after:bg-slate-950 after:w-calcBorder after:h-calcBorder after:left-calcBorder after:top-calcBorder after:rounded-2xl"
            ></div>
            <div
                ref={lineRef}
                className="absolute left-0 top-0 w-full h-full p-3.5"
            ></div>
        </div>
    );
}

export default Four;
