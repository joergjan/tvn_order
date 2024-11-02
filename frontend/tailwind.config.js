/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    theme: {
        extend: {
            colors: {
                tvbluelight: "#4569bf",
                tvblue: "#375398",
                tvyellow: "#E3BE53",
            },
            scale: {
                102: "1.02",
            },
            animation: {
                wiggle: "wiggle 1s ease-in-out infinite",
            },
            keyframes: {
                wiggle: {
                    "0%, 100%": { transform: "rotate(-5deg)" },
                    "50%": { transform: "rotate(5deg)" },
                },
            },
        },
        zIndex: {
            '0': 0,
           '10': 10,
           '20': 20,
           '30': 30,
           '40': 40,
           '50': 50,
           '25': 25,
           '50': 50,
           '75': 75,
           '100': 100,
            'auto': 'auto',
          }
    },

    future: {
        hoverOnlyWhenSupported: true,
    },

    corePlugins: {
        aspectRatio: false,
    },
    plugins: [require("@tailwindcss/aspect-ratio"), "@tailwindcss/forms"],
};
