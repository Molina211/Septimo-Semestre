'use client'

import * as React from 'react'
import * as RadixToast from '@radix-ui/react-toast'
import { X as Cross2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

const ToastProvider = RadixToast.Provider

const Toast = React.forwardRef<
  React.ElementRef<typeof RadixToast.Root>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Root>
>(({ className, ...props }, ref) => (
  <RadixToast.Root
    ref={ref}
    {...props}
    className={cn(
      'group pointer-events-auto relative flex w-full rounded-xl border border-border bg-card px-4 py-3 shadow-lg outline-none transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[swipe=end]:translate-x-0 data-[swipe=start]:translate-x-0 data-[swipe=move]:translate-x-2 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:fade-out-0 data-[swipe=end]:duration-200',
      className,
    )}
  />
))
Toast.displayName = 'Toast'

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof RadixToast.Title>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Title>
>(({ className, ...props }, ref) => (
  <RadixToast.Title
    ref={ref}
    {...props}
    className={cn('text-sm font-semibold text-foreground', className)}
  />
))
ToastTitle.displayName = 'ToastTitle'

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof RadixToast.Description>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Description>
>(({ className, ...props }, ref) => (
  <RadixToast.Description
    ref={ref}
    {...props}
    className={cn('text-sm text-muted-foreground', className)}
  />
))
ToastDescription.displayName = 'ToastDescription'

const ToastAction = React.forwardRef<
  React.ElementRef<typeof RadixToast.Action>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Action>
>(({ className, ...props }, ref) => (
  <RadixToast.Action
    ref={ref}
    {...props}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card',
      className,
    )}
  />
))
ToastAction.displayName = 'ToastAction'

const ToastClose = React.forwardRef<
  React.ElementRef<typeof RadixToast.Close>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Close>
>(({ className, ...props }, ref) => (
  <RadixToast.Close
    ref={ref}
    {...props}
    className={cn(
      'absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card',
      className,
    )}
  >
    <Cross2Icon className="h-3.5 w-3.5" />
  </RadixToast.Close>
))
ToastClose.displayName = 'ToastClose'

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof RadixToast.Viewport>,
  React.ComponentPropsWithoutRef<typeof RadixToast.Viewport>
>(({ className, ...props }, ref) => (
  <RadixToast.Viewport
    ref={ref}
    {...props}
    className={cn(
      'fixed top-4 right-4 z-50 flex flex-col gap-2 rounded-[20px] border border-border bg-card/95 p-4 shadow-2xl backdrop-blur',
      className,
    )}
  />
))
ToastViewport.displayName = 'ToastViewport'

export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
export type ToastActionElement = React.ReactNode

export {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  ToastViewport,
}
