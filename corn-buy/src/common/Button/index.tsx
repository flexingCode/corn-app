import { BounceLoader } from "react-spinners"

type ButtonProps = {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    type: "submit" | "button" | "reset"
    loading?: boolean
    disabled?: boolean
}

export const Button = (props: ButtonProps) => {
    const { children, className, onClick, type, loading, disabled } = props
    return (
        <button className={`cursor-pointer rounded-md flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white px-4 py-2 gap-4 ${loading || disabled ? 'opacity-50' : ''} ${className}`} onClick={onClick} type={type} disabled={loading || disabled}>
            {loading ? <BounceLoader color="#fff" size={16} /> : null}
            {children}
        </button>
    )
}