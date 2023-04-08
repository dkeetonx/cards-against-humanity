import React from 'react'

export default props => {
    const formatValue = props.formatValue ?? (() => props.value);
    return (
        <div className={props.className}>
            <div className={`tooltip ${props.tooltipExtraClasses ?? ""} flex flex-row`}
                data-tip={props.tooltipText}
            >
                <div className="form-control">
                    <label className="label">
                        <span
                            className="label-text badge text-sm text-primary-content bg-primary">
                            {props.label}
                        </span>
                    </label>

                    <label className="input-group">
                        <span className={`justify-end ${props.valueLabelExtraClasses}`}>
                            {formatValue(props.value)}
                        </span>
                        <input
                            type="range"
                            name={props.name}
                            min={props.min}
                            max={props.max}
                            value={props.value}
                            className={`range range-md ${props.inputExtraClasses}`}
                            onChange={props.onChange}
                        />
                    </label>
                </div>
            </div >
        </div>
    );
}
