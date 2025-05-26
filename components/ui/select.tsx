import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps {
  children: React.ReactNode
  onValueChange?: (value: string) => void
  defaultValue?: string
  disabled?: boolean
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export interface SelectContentProps {
  children: React.ReactNode
}

export interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
}

const SelectContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  value: '',
  onValueChange: () => {},
  isOpen: false,
  setIsOpen: () => {}
})

const Select: React.FC<SelectProps> = ({ children, onValueChange, defaultValue = '', disabled = false }) => {
  const [value, setValue] = React.useState(defaultValue)
  const [isOpen, setIsOpen] = React.useState(false)

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  return (
    <SelectContext.Provider value={{ value, onValueChange: handleValueChange, isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setIsOpen } = React.useContext(SelectContext)
    
    return (
      <button
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext)
  return <span>{value || placeholder}</span>
}

const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  const { isOpen } = React.useContext(SelectContext)
  
  if (!isOpen) return null
  
  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-600 bg-gray-700 shadow-lg">
      {children}
    </div>
  )
}

const SelectItem = React.forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { onValueChange } = React.useContext(SelectContext)
    
    return (
      <button
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center py-2 px-3 text-sm text-white hover:bg-gray-600 focus:bg-gray-600 focus:outline-none",
          className
        )}
        ref={ref}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } 