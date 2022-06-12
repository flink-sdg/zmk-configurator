module.exports = {
    content: ['./src/**/*.{vue,html,js}'],
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        fontFamily: {
            sans: ['ubuntu', 'ui-sans-serif'],
        }
    },
    plugins: [],
    safelist: [
        'p-2',
        'text-white'
    ]
}
