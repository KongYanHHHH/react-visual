import { useLayoutEffect, forwardRef } from 'react'

import useAutoResize from '@/hooks/useAutoResize';

interface FullScreenContainerProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

const FullScreenContainer = forwardRef<HTMLElement, FullScreenContainerProps>(
    (props, ref) => {
        const { children, className, style } = props;
        const { domRef } = useAutoResize(ref as unknown as HTMLElement);

        useLayoutEffect(() => {
            const { width, height } = window.screen;

            const dom = domRef.current as unknown as HTMLElement;

            Object.assign(dom.style, {
                width: `${width}px`,
                height: `${height}px`,
            });

            dom.style.transform = `scale(${document.body.clientWidth / width})`;
        });

        return (
            <div
                className={`fixed top-0 left-0 overflow-hidden origin-top-left bg-slate-950 ${
                    className ?? ''
                }`}
                style={style}
                ref={domRef}
            >
                {children}
            </div>
        );
    },
);

export default FullScreenContainer;
