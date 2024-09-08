import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { buttonVariants } from './button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { IconComponent } from '../types';

const buttonIconVariants = cva('', {
  variants: {
    size: {
      xs: 'w-4 h-4',
      sm: 'w-[18px] h-[18px]',
      default: 'w-5 h-5',
      lg: 'w-5 h-5',
      icon: 'h-10 w-10',
      xl: 'w-5 h-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const iconButtonVariants = cva(
  // ring-offset-background
  'rounded-full cursor-pointer whitespace-nowrap inline-flex gap-2 items-center justify-center font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-blue',
  {
    variants: {
      variant: {
        default:
          'bg-blue hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-600 text-white',
        destructive:
          'bg-red hover:bg-red-600 focus:bg-red-700 active:bg-red-600 text-white',
        warning:
          'bg-amber-400 hover:bg-amber-500 focus:bg-amber-600 active:bg-amber-500 text-amber-900',
        outline:
          'border dark:border-slate-200/5 border-gray-900/5 hover:bg-muted focus:bg-accent',
        secondary: 'bg-secondary hover:bg-muted focus:bg-accent',
        ghost: 'hover:bg-secondary focus:bg-accent',
        link: 'text-blue hover:text-blue-700 font-semibold !p-0 !h-[unset] !min-h-[unset]',
      },
      size: {
        xs: 'min-h-[26px] h-[26px] min-w-[26px] w-[26px] text-xs',
        xl: 'min-h-[52px] h-[52px] min-w-[52px] w-[52px]',
        default: 'min-h-[40px] h-[40px] min-w-[40px] w-[40px] text-sm',
        sm: 'min-h-[36px] h-[36px] min-w-[36px] w-[36px] text-sm',
        lg: 'min-h-[44px] h-[44px] min-w-[44px] w-[44px',
        icon: 'min-h-[24px] h-[24px] min-w-[24px] w-[24px]', // Add icon size here
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon: IconComponent | string;
  iconProps?: Omit<React.ComponentProps<'svg'>, 'width' | 'height'>;
  name: string;
  description?: string;
  testId?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      children,
      asChild,
      icon: Icon,
      iconProps,
      description,
      size,
      variant = 'secondary',
      name: _name,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'span';

    const button = (
      <Comp
        role='button'
        className={iconButtonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      >
        {typeof Icon === 'string' ? (
          <span
            className={buttonIconVariants({
              size,
              className: iconProps?.className,
            })}
          >
            {Icon}
          </span>
        ) : (
          <Icon
            {...iconProps}
            className={buttonIconVariants({
              size,
              className: iconProps?.className,
            })}
          />
        )}
        {children ? children : null}
      </Comp>
    );

    if (description) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side='bottom'>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  },
);
IconButton.displayName = 'ButtonNew';

export { IconButton, iconButtonVariants };
