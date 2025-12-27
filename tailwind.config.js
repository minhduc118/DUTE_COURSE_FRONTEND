/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#e6195d",
                "background-light": "#f8f6f6",
                "background-dark": "#211116",
                "text-main": "#181113",
                "text-secondary": "#88636f",
                "border-subtle": "#e5dcdf",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
