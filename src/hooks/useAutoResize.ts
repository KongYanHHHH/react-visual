import {
    useState,
    useCallback,
    useEffect,
    useRef,
    useImperativeHandle,
    Ref,
} from 'react';
import debounce from '@/uilts/debounce';

function observerDomResize(dom: HTMLElement, callback: MutationCallback) {
    const MutationObserver = window.MutationObserver;

    const observer = new MutationObserver(callback);

    observer.observe(dom, {
        attributes: true,
        attributeFilter: ['style'],
        attributeOldValue: true,
    });

    return observer;
}

export default function useAutoResize(ref: HTMLElement) {
    const [state, setState] = useState({ width: 0, height: 0 });

    const domRef = useRef(null);

    const setWH = useCallback(() => {
        const { clientWidth, clientHeight } = domRef.current || {
            clientWidth: 0,
            clientHeight: 0,
        };

        setState({ width: clientWidth, height: clientHeight });

        if (!domRef.current) {
            console.warn(
                'DataV: Failed to get dom node, component rendering may be abnormal!',
            );
        } else if (!clientWidth || !clientHeight) {
            console.warn(
                'DataV: Component width or height is 0px, rendering abnormality may occur!',
            );
        }
    }, []);

    useImperativeHandle(ref as unknown as Ref<unknown>, () => ({ setWH }), [
        setWH,
    ]);

    useEffect(() => {
        const debounceSetWHFun = debounce(setWH, 100);

        debounceSetWHFun();

        const domObserver = observerDomResize(
            domRef.current as unknown as HTMLElement,
            debounceSetWHFun,
        );

        window.addEventListener('resize', debounceSetWHFun);

        return () => {
            window.removeEventListener('resize', debounceSetWHFun);

            if (!domObserver) {
                return;
            }

            domObserver.disconnect();
            domObserver.takeRecords();
        };
    }, [setWH]);

    return { ...state, domRef, setWH };
}
