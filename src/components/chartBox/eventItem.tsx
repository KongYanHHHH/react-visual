import React from 'react';

type Props = {
    message: {
        text: string;
    };
};

const EventItem: React.FC<Props> = props => {
    const { message } = props;

    return (
        <section className="flex items-center text-white pl-2">
            <span></span>
            <p>{message.text}</p>
            <span></span>
        </section>
    );
};

export default EventItem;
