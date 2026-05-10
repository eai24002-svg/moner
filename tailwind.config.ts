import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [],
  theme: {
    extend: {
      colors: {
        noir: '#07070a',
        gold: '#d4af37',
        ivory: '#f6f2e9',
        burgundy: '#6f1d1b',
        midnight: '#111322',
        velvet: '#1a1023',
        mist: '#f4efe5',
        ember: '#f59e0b'
      },
      boxShadow: {
        glow: '0 0 24px rgba(212, 175, 55, 0.24)',
        soft: '0 18px 60px rgba(0, 0, 0, 0.45)',
        card: '0 24px 80px rgba(0, 0, 0, 0.36)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)'
      },
      backgroundImage: {
        aurora:
          'radial-gradient(circle at 15% 20%, rgba(212,175,55,0.14), transparent 45%), radial-gradient(circle at 85% 10%, rgba(111,29,27,0.18), transparent 40%), radial-gradient(circle at 45% 80%, rgba(212,175,55,0.08), transparent 35%)',
        mesh:
          'radial-gradient(circle at top right, rgba(212,175,55,0.14), transparent 30%), radial-gradient(circle at bottom left, rgba(111,29,27,0.2), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0))'
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.75', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' }
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        pulseGlow: 'pulseGlow 7s ease-in-out infinite'
      },
      backdropBlur: {
        xs: '2px'
      },
      letterSpacing: {
        luxe: '0.2em'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  }
}
