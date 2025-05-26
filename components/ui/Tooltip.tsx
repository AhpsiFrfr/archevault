import { ReactNode, useState } from 'react'

interface TooltipProps {
  text: string
  children: ReactNode
}

export function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-black/80 rounded-lg backdrop-blur-md border border-cyan-500/30 whitespace-nowrap z-50">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-500/30"></div>
        </div>
      )}
    </div>
  )
} 