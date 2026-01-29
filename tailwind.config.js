/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 深色主题 - 优化后的舒适暗黑配色 (参考 UX 指南 Dark Mode OLED)
        dark: {
          bg: {
            primary: '#09090b',      // 更深的纯黑，减少蓝调
            secondary: '#0f0f12',    // 微妙的层次
            card: '#141417',         // 卡片背景，更接近主背景
            hover: '#1c1c21',        // 悬停状态
            elevated: '#1a1a1f',     // 提升的元素
          },
          text: {
            primary: '#fafafa',      // 纯净的白色
            secondary: '#a1a1aa',    // 更亮的次要文本
            muted: '#71717a',        // 柔和的禁用文本
          },
          border: {
            DEFAULT: 'rgba(255, 255, 255, 0.04)',  // 更微妙的边框
            subtle: 'rgba(255, 255, 255, 0.02)',   // 几乎不可见
            highlight: 'rgba(255, 255, 255, 0.08)', // 悬停高亮
          },
          // 暗色主题专用阴影（用于替代边框）
          glow: {
            green: 'rgba(61, 214, 140, 0.15)',
            blue: 'rgba(77, 159, 255, 0.15)',
          },
        },
        // 浅色主题
        light: {
          bg: {
            primary: '#fafafa',
            secondary: '#f4f4f5',
            card: '#ffffff',
            hover: '#f8f8fa',
          },
          text: {
            primary: '#18181b',
            secondary: '#52525b',
            muted: '#a1a1aa',
          },
          border: {
            DEFAULT: 'rgba(0, 0, 0, 0.08)',
            subtle: 'rgba(0, 0, 0, 0.04)',
          },
        },
        // 强调色
        accent: {
          green: '#3dd68c',
          'green-glow': 'rgba(61, 214, 140, 0.15)',
          blue: '#4d9fff',
          orange: '#ff9f4d',
          purple: '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'Sora', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'pulse-slow': 'pulse 2s infinite',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      // 暗黑模式下使用阴影代替边框
      boxShadow: {
        'dark-card': '0 1px 2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)',
        'dark-card-hover': '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'dark-elevated': '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        'glow-green': '0 0 20px rgba(61, 214, 140, 0.2)',
        'glow-blue': '0 0 20px rgba(77, 159, 255, 0.2)',
      },
    },
  },
  plugins: [],
}
