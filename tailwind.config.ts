import type { Config } from 'tailwindcss'
import tailwindAnimate from 'tailwindcss-animate'
import { pcVw, spVw, vwPlugin } from './lib/tailwind/vw'

// px変換
const pxVar = (name: string) => `calc(var(${name}) * 1px)`

const config = {
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        screens: {
            md: '768px',
            '2xl': '1440px',
        },
        extend: {
            colors: {
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },

                background: {
                    DEFAULT: 'var(--colorBgBase)',
                    primary: {
                        DEFAULT: 'var(--colorBgPrimary)',
                        hover: 'var(--colorBgPrimaryHover)',
                        active: 'var(--colorBgPrimaryActive)',
                    },
                    surface: {
                        DEFAULT: 'var(--colorBgSurface)',
                        hover: 'var(--colorBgSurfaceHover)',
                        active: 'var(--colorBgSurfaceActive)',
                    },
                    modal: 'var(--colorBgModal)',
                    disabled: 'var(--colorBgDisabled)',
                    transparent: 'var(--colorBgTransparent)',
                    errorSubtle: 'var(--colorBgErrorSubtle)',
                    successSubtle: 'var(--colorBgSuccessSubtle)',
                    warningSubtle: 'var(--colorBgWarningSubtle)',
                },
                border: {
                    DEFAULT: 'var(--colorBorderDefault)',
                    strong: 'var(--colorBorderStrong)',
                    focus: 'var(--colorBorderFocus)',
                    error: 'var(--colorBorderError)',
                    success: 'var(--colorBorderSuccess)',
                    warning: 'var(--colorBorderWarning)',
                    disabled: 'var(--colorBorderDisabled)',
                },
                text: {
                    DEFAULT: 'var(--colorTextPrimary)',
                    secondary: 'var(--colorTextSecondary)',
                    disabled: 'var(--colorTextDisabled)',
                    onPrimary: 'var(--colorTextOnPrimary)',
                    error: 'var(--colorTextError)',
                    success: 'var(--colorTextSuccess)',
                    warning: 'var(--colorTextWarning)',
                },
                status: {
                    error: 'var(--colorStatusError)',
                    success: 'var(--colorStatusSuccess)',
                    warning: 'var(--colorStatusWarning)',
                },
                shadow: 'var(--colorShadowDefault)',
            },
            borderRadius: {
                DEFAULT: pxVar('--radius-sm'),
                'sm-pc': pcVw('--radius-sm'),
                'md-pc': pcVw('--radius-md'),
                'lg-pc': pcVw('--radius-lg'),
                'xl-pc': pcVw('--radius-xl'),
                full: pxVar('--radius-full'),
                'sm-sp': spVw('--radius-sm'),
                'md-sp': spVw('--radius-md'),
                'lg-sp': spVw('--radius-lg'),
                'xl-sp': spVw('--radius-xl'),
            },
            spacing: {
                DEFAULT: pxVar('--space-4'),
                '4-pc': pcVw('--space-4'),
                '8-pc': pcVw('--space-8'),
                '12-pc': pcVw('--space-12'),
                '16-pc': pcVw('--space-16'),
                '24-pc': pcVw('--space-24'),
                '32-pc': pcVw('--space-32'),
                '40-pc': pcVw('--space-40'),
                '48-pc': pcVw('--space-48'),
                '56-pc': pcVw('--space-56'),
                '64-pc': pcVw('--space-64'),
                '96-pc': pcVw('--space-96'),
                '128-pc': pcVw('--space-128'),
                '4-sp': spVw('--space-4'),
                '8-sp': spVw('--space-8'),
                '12-sp': spVw('--space-12'),
                '16-sp': spVw('--space-16'),
                '24-sp': spVw('--space-24'),
                '32-sp': spVw('--space-32'),
                '40-sp': spVw('--space-40'),
                '48-sp': spVw('--space-48'),
                '56-sp': spVw('--space-56'),
                '64-sp': spVw('--space-64'),
                '96-sp': spVw('--space-96'),
                '128-sp': spVw('--space-128'),
            },
            fontFamily: {
                base: ['var(--fontFamilyBase)'],
                english: ['var(--fontFamilyEnglish)'],
            },
            fontSize: {
                'heading-h1-pc': [
                    pcVw('--fontSize-2xl'),
                    {
                        lineHeight: 'var(--lineHeight-md)',
                        fontWeight: 'var(--fontWeight-bold)',
                    },
                ],
                'heading-h2-pc': [
                    pcVw('--fontSize-xl'),
                    {
                        lineHeight: 'var(--lineHeight-sm)',
                        fontWeight: 'var(--fontWeight-semibold)',
                    },
                ],
                'heading-h3-pc': [
                    pcVw('--fontSize-lg'),
                    {
                        lineHeight: 'var(--lineHeight-lg)',
                        fontWeight: 'var(--fontWeight-semibold)',
                    },
                ],
                'body-default-pc': [
                    pcVw('--fontSize-md'),
                    {
                        lineHeight: 'var(--lineHeight-lg)',
                        fontWeight: 'var(--fontWeight-regular)',
                    },
                ],
                'body-strong-pc': [
                    pcVw('--fontSize-md'),
                    {
                        lineHeight: 'var(--lineHeight-lg)',
                        fontWeight: 'var(--fontWeight-semibold)',
                    },
                ],
                'body-small-pc': [
                    pcVw('--fontSize-sm'),
                    {
                        lineHeight: 'var(--lineHeight-md)',
                        fontWeight: 'var(--fontWeight-regular)',
                    },
                ],
                'body-notice-pc': [
                    pcVw('--fontSize-xs'),
                    {
                        lineHeight: 'var(--lineHeight-lg)',
                        fontWeight: 'var(--fontWeight-regular)',
                    },
                ],
                'label-default-pc': [
                    pcVw('--fontSize-md'),
                    {
                        lineHeight: 'var(--lineHeight-md)',
                        fontWeight: 'var(--fontWeight-medium)',
                    },
                ],
                'input-text-pc': [
                    pcVw('--fontSize-md'),
                    {
                        lineHeight: 'var(--lineHeight-lg)',
                        fontWeight: 'var(--fontWeight-regular)',
                    },
                ],
                'heading-h1-sp': [
                    spVw('--fontSize-2xl'),
                    {
                        lineHeight: 'var(--lineHeight-md)',
                        fontWeight: 'var(--fontWeight-bold)',
                    },
                ],
                'heading-h2-sp': [
                    spVw('--fontSize-xl'),
                    {
                        lineHeight: 'var(--lineHeight-sm)',
                        fontWeight: 'var(--fontWeight-semibold)',
                    },
                ],
                'heading-h3-sp': [
                    spVw('--fontSize-lg'),
                    {
                        lineHeight: 'var(--lineHeight-lg)',
                        fontWeight: 'var(--fontWeight-semibold)',
                    },
                ],
                'body-default-sp': [
                    spVw('--fontSize-md'),
                    {
                        lineHeight: 'var(--lineHeight-lg)',
                        fontWeight: 'var(--fontWeight-regular)',
                    },
                ],
                'body-strong-sp': [
                    spVw('--fontSize-md'),
                    {
                        lineHeight: 'var(--lineHeight-lg)',
                        fontWeight: 'var(--fontWeight-semibold)',
                    },
                ],
                'body-small-sp': [
                    spVw('--fontSize-sm'),
                    {
                        lineHeight: 'var(--lineHeight-md)',
                        fontWeight: 'var(--fontWeight-regular)',
                    },
                ],
                'body-notice-sp': [
                    spVw('--fontSize-xs'),
                    {
                        lineHeight: 'var(--lineHeight-lg)',
                        fontWeight: 'var(--fontWeight-regular)',
                    },
                ],
                'label-default-sp': [
                    spVw('--fontSize-md'),
                    {
                        lineHeight: 'var(--lineHeight-md)',
                        fontWeight: 'var(--fontWeight-medium)',
                    },
                ],
                'input-text-sp': [
                    spVw('--fontSize-md'),
                    {
                        lineHeight: 'var(--lineHeight-lg)',
                        fontWeight: 'var(--fontWeight-regular)',
                    },
                ],
            },
            boxShadow: {
                card: '0 0 16px 0 var(--colorShadowDefault)',
            },
            transitionDuration: {
                button: '300ms',
            },
            transitionTimingFunction: {
                button: 'ease-out',
            },
            // keyframes: {
            //     'accordion-down': {
            //         from: { height: '0' },
            //         to: { height: 'var(--radix-accordion-content-height)' },
            //     },
            //     'accordion-up': {
            //         from: { height: 'var(--radix-accordion-content-height)' },
            //         to: { height: '0' },
            //     },
            // },
            // animation: {
            //     'accordion-down': 'accordion-down 0.2s ease-out',
            //     'accordion-up': 'accordion-up 0.2s ease-out',
            // },
        },
    },
    // plugins: [require("tailwindcss-animate")],
    plugins: [tailwindAnimate, vwPlugin],
} satisfies Config

export default config
