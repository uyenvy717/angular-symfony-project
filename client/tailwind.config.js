const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const appColors = {
    primary: {
        lighter: '#A094A6',
        light: '#8D7E94',
        DEFAULT: '#41284D',
        dark: '#34203e',
        darker: '#27182e'
    },
    secondary: {
        lighter: '#fcfcfc',
        light: '#f5f5f5',
        DEFAULT: '#F2F2F2',
        dark: '#c2c2c2',
        darker: '#797979'
    },
    magenta: {
        lighter: '#ff81ab',
        light: '#ff3579',
        DEFAULT: '#FF0357',
        dark: '#CC0246',
        darker: '#80022c',
        radial: '#ff03571f'
    },
    orange: {
        primary: '#FF7B02',
        secondary: '#dc9e67',
        lighter: '#ffbd81',
        light: '#FF9635',
        DEFAULT: '#FF7B02',
        dark: '#CE6300',
        darker: '#803e01',
        radial: '#FF7B021f'
    },
    gold: {
        primary: '#FAA90E',
        secondary: '#FFCF15',
        lighter: '#fee5b7',
        light: '#fccb6e',
        DEFAULT: '#FAA90E',
        dark: '#966508',
        darker: '#4b3304',
        radial: '#FAA90E1f'
    },
    malachite: {
        primary: '#51C185',
        secondary: '#4CE593',
        lighter: '#cbecda',
        light: '#85d4aa',
        DEFAULT: '#51C185',
        dark: '#39875d',
        darker: '#183a28',
        radial: '#51C1851f'
    },
    cobalt: {
        primary: '#0295FF',
        secondary: '#2FB1E9',
        lighter: '#cceaff',
        light: '#67bfff',
        DEFAULT: '#0295FF',
        dark: '#015999',
        darker: '#001e33',
        radial: '#0295FF1f'
    }
}

module.exports = {
    important: true,
    content: ['./src/**/*.{html,ts}'],
    safelist: [
        {
            pattern: /bg-(primary|secondary|magenta|intel|data|orange|create|gold|sign|malachite|manage|cobalt)+/,
        },
        {
            pattern: /text-(primary|secondary|magenta|intel|data|orange|create|gold|sign|malachite|manage|cobalt)+/,
        },
        {
            pattern: /border-(primary|secondary|magenta|intel|data|orange|create|gold|sign|malachite|manage|cobalt)+/,
        },
    ],
    theme: {
        extend: {
            colors: {
                fuchsia: colors.fuchsia,
                error: colors.red,
                danger: colors.red,
                warning: colors.orange,
                success: colors.green,
                info: colors.sky,
                ...appColors,
                create: appColors.gold,
                sign: appColors.malachite,
                manage: appColors.cobalt,
                intel: appColors.magenta,
                data: appColors.orange
            },
            backgroundImage: {
                'radial-l-moon': 'radial-gradient(30% 45% at right, var(--tw-gradient-stops))',
                'radial-r-moon': 'radial-gradient(30% 45% at left, var(--tw-gradient-stops))',
                'gradient-hover': 'linear-gradient(-45deg, var(--tw-gradient-stops), var(--tw-gradient-stops))'
            },
            dropShadow: {
                static: ['0px 2px 3px rgba(65, 40, 77, 0.1)', '0px 4px 6px rgba(65, 40, 77, 0.2)'],
                hover: ['0px 2px 3px rgba(65, 40, 77, 0.1)', '0px 4px 6px rgba(65, 40, 77, 0.2)'],
                active: ['0px 0px 2px rgba(65, 40, 77, 0.4)', '0px 2px 3px rgba(65, 40, 77, 0.1)']
            },
            keyframes: {
                loaderHorizontal: {
                    '0%': {transform: 'translateX(-20vw)'},
                    '100%': {transform: 'translateX(100vw)'}
                },
                gradientFlow: {
                    '0%': {'background-position': '0 0'},
                    '100%': {'background-position': '100% 0'}
                }
            },
            animation: {
                'loader-h': 'loaderHorizontal 1500ms linear infinite',
                'gradient-hover': 'gradientFlow 3s linear infinite'
            },
            fontFamily: {
                body: [
                    'Quicksand',
                    ...defaultTheme.fontFamily.sans
                ]
            },
            minWidth: ({theme}) => ({
                ...theme('width')
            }),
            maxWidth: ({theme}) => ({
                ...theme('width')
            }),
            screens: {
                '2xl': '1536px'
            },
            gridTemplateAreas: {
                'main-default': [
                    'breadcrumbs panel',
                    'content panel'
                ],
                'ws-default': [
                    'quickactions quickactions quickactions',
                    'navpanel main main',
                    'banner banner banner'
                ],
                'ws-user': [
                    'quickactions quickactions useractions',
                    'navpanel main userpanel',
                    'banner banner banner'
                ],
                'ws-main': [
                    'quickactions quickactions useractions',
                    'main main main',
                    'banner banner banner'
                ],
                'ws-main-user': [
                    'quickactions quickactions useractions',
                    'main main userpanel',
                    'banner banner banner'
                ]
            }
        },
    },
    plugins: [
        // function({ addBase, theme }) {
        //   function extractColorVars(colorObj, colorGroup = '') {
        //     return Object.keys(colorObj).reduce((vars, colorKey) => {
        //       const value = colorObj[colorKey];
        //
        //       const newVars =
        //         typeof value === 'string'
        //           ? { [`--color${colorGroup}-${colorKey}`]: value }
        //           : extractColorVars(value, `-${colorKey}`);
        //
        //       return { ...vars, ...newVars };
        //     }, {});
        //   }
        //
        //   addBase({
        //     ':root': extractColorVars(theme('colors')),
        //   });
        // },
        // require('@tailwindcss/forms'),
        // require('@tailwindcss/typography'),
        require('@savvywombat/tailwindcss-grid-areas')
    ]
};
