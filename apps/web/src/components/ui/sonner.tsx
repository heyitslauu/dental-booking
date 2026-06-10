import type React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:border-border group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg",
          success:
            "group-[.toaster]:border-primary/25 group-[.toaster]:bg-primary group-[.toaster]:text-primary-foreground",
          warning:
            "group-[.toaster]:border-yellow-500/30 group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-950",
          error:
            "group-[.toaster]:border-destructive/30 group-[.toaster]:bg-destructive group-[.toaster]:text-destructive-foreground",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast[data-type='success']]:text-primary-foreground/85 group-[.toast[data-type='warning']]:text-yellow-900/80 group-[.toast[data-type='error']]:text-destructive-foreground/85",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
