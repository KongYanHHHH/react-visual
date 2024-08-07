import { useEffect, useLayoutEffect, useRef } from 'react';

import { useImmer } from 'use-immer';

import type { BarSeriesOption } from 'echarts/charts';
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
    | BarSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | DatasetComponentOption
    | LegendComponentOption
>;

type EchartsType =
    typeof import('d:/job/react-visual/node_modules/echarts/core');

const legendTextStyle = { color: '#fff' };

function Three({ echartsObj }: { echartsObj: EchartsType }) {
    const lineRef = useRef(null);
    const fetchInstance = useFetchWrapper();

    const instance = useRef<EChartsType>();

    const [option, updateOption] = useImmer<ECOption>({
        xAxis: {},
        yAxis: [
            {
                type: 'value',
                name: 'O₂ %',
                min: 15,
                max: 25,
                splitLine: { lineStyle: { type: 'dotted' } },
                // axisLabel: {
                //     formatter: '{value} %',
                // },
            },
            {
                type: 'value',
                name: 'CO₂ ppm',
                min: 500,
                max: 1500,
                splitLine: { lineStyle: { type: 'dotted' } },
            },
        ],
        legend: {},
        series: [],
        title: {
            text: 'O₂/CO₂',
        },
        tooltip: {
            trigger: 'axis',
        },
    });

    async function getData() {
        const data = await fetchInstance.get(fetchInstance.apiUri.getThree);

        const seriesData: any[] = [];
        const legendData: string[] = [];
        const xAxisData: string[] = [];

        if (Array.isArray(data)) {
            data.forEach(item => {
                const _legendName1 = 'O₂-' + item.name;
                const _legendName2 = 'CO₂-' + item.name;
                legendData.push(...[_legendName1, _legendName2]);

                const _series1: { name: string; type: 'line'; data: number[] } =
                    { name: _legendName1, type: 'line', data: [] };
                const _series2: {
                    name: string;
                    type: 'bar';
                    yAxisIndex: number;
                    data: number[];
                } = {
                    name: _legendName2,
                    type: 'bar',
                    yAxisIndex: 1,
                    data: [],
                };

                for (const _d of item.data.reverse()) {
                    if (!xAxisData.includes(_d.time)) {
                        xAxisData.push(_d.time);
                    }

                    _series1.data.push(_d.oxygen);
                    _series2.data.push(_d.carbonDioxide);
                }

                seriesData.push(...[_series1, _series2]);
            });

            updateOption(draft => {
                draft.legend = {
                    type: 'scroll',
                    width: '80%',
                    right: 0,
                    textStyle: legendTextStyle,
                    data: legendData,
                };
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
                before:absolute before:w-2/3 before:h-turnBorder before:bg-orange-600 before:-z-20 before:left-1/2 before:top-1/2 before:animate-spin3s before:origin-top-left 
                after:absolute after:-z-10 after:bg-slate-950 after:w-calcBorder after:h-calcBorder after:left-calcBorder after:top-calcBorder after:rounded-2xl"
            ></div>
            <div
                ref={lineRef}
                className="absolute left-0 top-0 w-full h-full p-3.5"
            ></div>
        </div>
    );
}

export default Three;
