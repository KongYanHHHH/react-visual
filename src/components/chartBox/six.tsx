import { lazy } from 'react';

const EventItem = lazy(() => import('./eventItem'));

function Six() {
    return (
        <div className="h-5/12 w-full p-2.5">
            <h3 className="w-full text-lg text-gray-600 h-7">预警事件</h3>
            <div className='border-t border-dotted m-auto mt-3 mb-3'></div>
            <EventItem message={{ text: '啊~五只剩9了' }} />
        </div>
    );
}

export default Six;
