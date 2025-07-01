import { forwardRef } from "react"

type InputStatus = 'default' | 'error' | 'success'

type InputProps = {
    value?: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
    helperText?: string
    status?: InputStatus
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { value, onChange, className, placeholder, helperText, status = 'default', inputProps } = props

    const helperTextClass = status === 'error' ? 'text-red-500' : status === 'success' ? 'text-green-500' : 'text-gray-500'

    const inputClass = {
        'default': 'border-gray-300',
        'error': 'border-red-500',
        'success': 'border-green-500',
    }

    return (
        <div>
            <input
                ref={ref}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`rounded-md border-2 px-4 py-2 ${inputClass[status || 'default']} ${className}`}
                placeholder={placeholder}
                {...inputProps}
            />
            {helperText && <p className={`text-xs ${helperTextClass}`}>{helperText}</p>}
        </div>
    )
})