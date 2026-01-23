'use client'

import * as React from 'react'

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Collapsible({ 
  children, 
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  ...props 
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : isOpen

  const toggleOpen = () => {
    const newOpen = !open
    if (!isControlled) {
      setIsOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <div data-slot="collapsible" {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen: open,
            toggleOpen,
            ...child.props
          })
        }
        return child
      })}
    </div>
  )
}

interface CollapsibleTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  asChild?: boolean
  isOpen?: boolean
  toggleOpen?: () => void
}

function CollapsibleTrigger({ 
  children, 
  asChild = false,
  isOpen,
  toggleOpen,
  ...props 
}: CollapsibleTriggerProps) {
  if (asChild) {
    const child = React.Children.only(children)
    return React.cloneElement(child as React.ReactElement, {
      onClick: (e: React.MouseEvent) => {
        toggleOpen?.()
        if (typeof (child as any).props.onClick === 'function') {
          ;(child as any).props.onClick(e)
        }
      },
      'aria-expanded': isOpen,
      'aria-controls': props['aria-controls'],
      ...props
    })
  }

  return (
    <button
      type="button"
      data-slot="collapsible-trigger"
      onClick={toggleOpen}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
    </button>
  )
}

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  isOpen?: boolean
}

function CollapsibleContent({ 
  children, 
  isOpen = false,
  ...props 
}: CollapsibleContentProps) {
  if (!isOpen) return null
  
  return (
    <div 
      data-slot="collapsible-content"
      aria-hidden={!isOpen}
      {...props}
    >
      {children}
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
