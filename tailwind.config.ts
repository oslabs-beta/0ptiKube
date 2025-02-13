import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy_blue: {
          DEFAULT: '#000080',
          100: '#00001a',
          200: '#000033',
          300: '#00004d',
          400: '#000066',
          500: '#000080',
          600: '#0000cc',
          700: '#1a1aff',
          800: '#6666ff',
          900: '#b3b3ff',
        },
        zaffre: {
          DEFAULT: '#111aa3',
          100: '#030520',
          200: '#070b41',
          300: '#0a1061',
          400: '#0e1581',
          500: '#111aa3',
          600: '#1724de',
          700: '#4b56ec',
          800: '#878ef2',
          900: '#c3c7f9',
        },
        international_klein_blue: {
          DEFAULT: '#002ca9',
          100: '#000922',
          200: '#001243',
          300: '#001b65',
          400: '#002487',
          500: '#002ca9',
          600: '#003fed',
          700: '#3269ff',
          800: '#769bff',
          900: '#bbcdff',
        },
        palatinate_blue: {
          DEFAULT: '#2832dc',
          100: '#07092d',
          200: '#0f1259',
          300: '#161b86',
          400: '#1d25b3',
          500: '#2832dc',
          600: '#535ae3',
          700: '#7e83ea',
          800: '#a9adf1',
          900: '#d4d6f8',
        },
        risd_blue: {
          DEFAULT: '#3b50f9',
          100: '#02093b',
          200: '#041177',
          300: '#061ab2',
          400: '#0722ed',
          500: '#3b50f9',
          600: '#6173fa',
          700: '#8896fb',
          800: '#b0b9fd',
          900: '#d7dcfe',
        },
        fluorescent_cyan: {
          DEFAULT: '#3fece2',
          100: '#053734',
          200: '#0b6e69',
          300: '#10a49d',
          400: '#16dbd1',
          500: '#3fece2',
          600: '#67f0e9',
          700: '#8df4ef',
          800: '#b3f7f4',
          900: '#d9fbfa',
        },
        light_sky_blue: {
          DEFAULT: '#87cefa',
          100: '#032e49',
          200: '#065d93',
          300: '#098bdc',
          400: '#3baff7',
          500: '#87cefa',
          600: '#9dd7fb',
          700: '#b6e1fc',
          800: '#ceebfd',
          900: '#e7f5fe',
        },
        columbia_blue: {
          DEFAULT: '#cfe5f3',
          100: '#123348',
          200: '#246690',
          300: '#3e97cf',
          400: '#86bee1',
          500: '#cfe5f3',
          600: '#d8eaf5',
          700: '#e2eff8',
          800: '#ebf4fa',
          900: '#f5fafd',
        },
        white: {
          DEFAULT: '#ffffff',
          100: '#333333',
          200: '#666666',
          300: '#999999',
          400: '#cccccc',
          500: '#ffffff',
          600: '#ffffff',
          700: '#ffffff',
          800: '#ffffff',
          900: '#ffffff',
        },
        bright_blue: {
          DEFAULT: '#00a8ff', // Base bright blue
          100: '#002b47', // Darkest
          200: '#00568e', // Dark
          300: '#0081d5', // Medium
          400: '#00a8ff', // Bright
          500: '#00c2ff', // Brighter
          600: '#00dcff', // Very bright
          700: '#00f6ff', // Neon
          800: '#00ffff', // Full neon
          900: '#e6ffff', // Lightest
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
