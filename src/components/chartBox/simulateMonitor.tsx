import { Empty, Modal, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { createRef, RefObject, useEffect, useRef, useState } from 'react';

interface MonitorOp {
    [key: string]: {
        isCreate: boolean;
        info: { value: string; label: string };
        dom: RefObject<HTMLVideoElement>;
        stream?: MediaStream;
    };
}

function SimulateMonitor() {
    const monitorOp = useRef<MonitorOp>({});

    const [selectedCamera, setSelectedCamera] = useState<string[]>([]);

    const selectOptionList = [
        { value: 'd1', label: '第一个' },
        { value: 'd2', label: '第二个' },
        { value: 'd3', label: '第三个' },
        { value: 'd4', label: '第四个' },
        { value: 'd5', label: '第五个' },
        { value: 'd6', label: '第六个' },
        { value: 'd7', label: '第七个' },
        { value: 'd8', label: '第八个' },
        { value: 'd9', label: '第九个' },
    ];

    useEffect(() => {
        const _val = Object.values(monitorOp.current);
        _val.forEach(async item => {
            if (!item.isCreate) {
                try {
                    item.isCreate = true;
                    item.stream = await navigator.mediaDevices.getDisplayMedia({
                        video: true,
                    });

                    if (item.dom.current) {
                        item.dom.current.autoplay = true;
                        item.dom.current.srcObject = item.stream;
                    }
                } catch (error) {
                    deselectFn(item.info.value);
                    setSelectedCamera(_prev =>
                        _prev.filter(_key => _key !== item.info.value),
                    );
                    if (!navigator.mediaDevices) {
                        Modal.info({
                            title: '提示',
                            content: (
                                <div>
                                    调用录制屏幕时，只能在https localhost
                                    和file网站中使用，http中不起作用，http协议不受信任。
                                    解决方法：谷歌浏览器打开配置页面
                                    <code>
                                        chrome://flags/#unsafely-treat-insecure-origin-as-secure
                                    </code>
                                    在输入框中添加要调用的网页地址（此时地址显示到域名），按钮改成enabled
                                    保存重启即可
                                </div>
                            ),
                            getContainer: () =>
                                document.getElementById(
                                    'visual',
                                ) as HTMLElement,
                        });
                    }
                }
            }
        });
    }, [selectedCamera]);

    useEffect(() => {
        const _current = monitorOp.current;
        return () => {
            const _val = Object.values(_current);
            _val.forEach(item => {
                const tracks = item.stream?.getTracks();
                tracks?.forEach(track => track.stop());
            });
        };
    }, []);

    function selectedFn(val: string, info: { value: string; label: string }) {
        monitorOp.current[val] = {
            info,
            isCreate: false,
            dom: createRef<HTMLVideoElement>(),
        };
    }

    function deselectFn(val: string) {
        const _del = monitorOp.current[val];
        const tracks = _del.stream?.getTracks();
        tracks?.forEach(track => track.stop());
        Reflect.deleteProperty(monitorOp.current, val);
    }

    function createVideo() {
        const _val = Object.values(monitorOp.current);
        const _h = ['h-1/3', 'h-full', 'h-1/2'];

        let _clsname = 'relative h-1/2 w-1/3';

        if (_val.length <= 3) {
            _clsname = `relative w-full ${_h[_val.length % 3]}`;
        }

        return _val.length ? (
            _val.map(item => {
                return (
                    <div key={item.info.value} className={_clsname}>
                        <video ref={item.dom} className="w-full h-full"></video>
                        <span className="absolute top-0 left-1 text-xs text-orange-300 before:w-1 before:h-1 before:mr-1 before:bg-lime-600 before:inline-block before:mb-0.5">
                            {item.info.label}
                        </span>
                    </div>
                );
            })
        ) : (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={false}
                className="m-t40"
            />
        );
    }

    return (
        <div
            className="w-full h-4/5 flex flex-col justify-between"
            id="simulatemonitor"
        >
            <Select
                className="m-auto w-4/5"
                mode="multiple"
                maxCount={6}
                onChange={setSelectedCamera}
                onSelect={selectedFn}
                onDeselect={deselectFn}
                value={selectedCamera}
                suffixIcon={
                    <>
                        <span>
                            {selectedCamera.length} / {6}
                        </span>
                        <DownOutlined />
                    </>
                }
                placeholder="模拟视频监控.."
                options={selectOptionList}
                getPopupContainer={() =>
                    document.getElementById('visual') as HTMLElement
                }
            />
            <section className="w-full h-calcSmbox flex flex-wrap justify-center">
                {createVideo()}
            </section>
        </div>
    );
}

export default SimulateMonitor;
