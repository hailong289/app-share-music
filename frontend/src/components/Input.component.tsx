import React, { forwardRef, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    variant?: 'outlined' | 'filled' | 'standard';
    fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ 
        label, 
        error, 
        helperText, 
        variant = 'outlined', 
        fullWidth = false, 
        className = '', 
        ...props 
    }, ref) => {
        const baseClasses = 'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
        const variantClasses = {
            outlined: 'border-gray-300 bg-white',
            filled: 'border-gray-300 bg-gray-50',
            standard: 'border-0 border-b-2 border-gray-300 rounded-none bg-transparent'
        };
        const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
        const widthClasses = fullWidth ? 'w-full' : '';

        return (
            <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
                {label && (
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`${baseClasses} ${variantClasses[variant]} ${errorClasses} ${widthClasses} ${className}`}
                    {...props}
                />
                {(error || helperText) && (
                    <span className={`text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
                        {error || helperText}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;