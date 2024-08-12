function Five() {
    const data = [
        { name: '一', val: 38 },
        { name: '二', val: 34 },
        { name: '三', val: 45 },
        { name: '四', val: 23 },
        { name: '五', val: 9 },
        { name: '六', val: 57 },
    ];
    return (
        <div className="h-1/4 w-full flex justify-center p-2.5 flex-wrap content-start">
            <h3 className="w-full text-lg text-gray-600 h-7">营养液剩余</h3>
            {data.map(item => (
                <section key={item.name} className="text-white w-1/3 flex justify-center items-center flex-col mt-2">
                    <span className="text-2xl mb-1">{item.name}</span>
                    <span className="text-5xl">{item.val}</span>
                </section>
            ))}
        </div>
    );
}

export default Five;
