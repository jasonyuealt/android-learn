import { useThemeBloc } from '../blocs/themeBloc'

/**
 * 背景装饰组件
 * 提供渐变光效和网格背景
 */
export function BackgroundDecoration() {
  const theme = useThemeBloc((state) => state.theme)
  const isDark = theme === 'dark'

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 右上角渐变光效 */}
      <div
        className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[80px] transition-opacity duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(61, 214, 140, 0.08) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(61, 214, 140, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* 左下角渐变光效 */}
      <div
        className="absolute -bottom-[30%] -left-[15%] w-[800px] h-[800px] rounded-full blur-[100px] transition-opacity duration-500"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(77, 159, 255, 0.06) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(77, 159, 255, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* 网格背景 */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
