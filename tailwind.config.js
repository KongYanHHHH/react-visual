/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            height: {
                topbox: '9%',
                h88: '88%',
                calcBorder: 'calc(100% - 6px)',
                turnBorder: '110%',
                calcSmbox: 'calc(100% - 40px)',
                '5/12': '41.666667%;',
            },
            width: {
                w27: '27%',
                w30: '30%',
                calcBorder: 'calc(100% - 6px)',
            },
            inset: {
                calcBorder: '3px',
            },
            margin: {
                mb10px: '10.8px',
                t40: '40% 0 0 0',
            },
            animation: {
                spin3s: 'spin 3s linear infinite',
                spin4s: 'spin 4s linear infinite',
                spin5s: 'spin 5s linear infinite',
                reverseSpin3s: 'reverseSpin 3s linear infinite',
            },
            keyframes: {
                reverseSpin: {
                    from: { transform: 'rotate(360deg)' },
                    to: { transform: 'rotate(0deg)' },
                },
            },
        },
    },
    plugins: [],
};
