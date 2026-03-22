import { Link } from "react-router"
import "../../styles/UIComponents.css"

export const Button = ({ 
    variant = "primary",
    className = "", ...props
}) => (
    <Link
        className={`ui-element ui-button-${variant} ${className}`}
        { ...props } 
    />
)

export const Input = ({
    label,
    className = "",
    ...props
}) => (
    <div
        className={`ui-element ui-input-group`}
    >
        { label && <label className="ui-label">{ label }</label>}
        <input
            className={`ui-element ui-input ${className}`}
            { ...props}
        />
    </div>
)

export const Select = ({
    label,
    options,
    className = "",
    ...props
}) => (
    <div
        className={`ui-element ui-select ${className}`} 
    >
        { label && <label className="ui-label">{ label }</label>}

        <select className={`ui-element ui-select ${className}`} {...props}>
            {
                options.map((opt) => (
                    <option
                        key={opt.value}
                        value={opt.value}
                    >
                        {opt.label}
                    </option>
                ))
            }
        </select>
    </div>
)