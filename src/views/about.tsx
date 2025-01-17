import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    // 数据集组件
    DatasetComponent,
    // 内置数据转换器组件 (filter, sort)
    TransformComponent,
    LegendComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { SVGRenderer } from 'echarts/renderers';

import FullScreenContainer from '@/components/fullScreenContainer';
import One from '@/components/chartBox/one';
import Two from '@/components/chartBox/two';
import Three from '@/components/chartBox/three';
import Four from '@/components/chartBox/four';
import Five from '@/components/chartBox/five';
import Six from '@/components/chartBox/six';

import Weather from '@/components/chartBox/weather';
import SimulateMonitor from '@/components/chartBox/simulateMonitor';

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    BarChart,
    LineChart,
    LabelLayout,
    UniversalTransition,
    SVGRenderer,
    LegendComponent,
]);

export default function About() {
    return (
        <FullScreenContainer>
            <div className="text-center border-b h-topbox mb-mb10px">About</div>
            <div className="w-w30 h-h88 inline-block overflow-auto">
                <One echartsObj={echarts} />
                <Two echartsObj={echarts} />
                <Three echartsObj={echarts} />
            </div>
            <div className="w-2/5 h-h88 inline-block overflow-auto">
                <SimulateMonitor />
                <Weather />
            </div>
            <div className="w-w30 h-h88 inline-block overflow-auto">
                <Four echartsObj={echarts} />
                <Five />
                <Six />
            </div>
        </FullScreenContainer>
    );
}
