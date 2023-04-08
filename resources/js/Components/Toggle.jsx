import React from 'react'

export default props => (
    <div className={`{props.className}`}>
        <div className={`tooltip ${props.tooltipExtraClasses ?? ""} flex flex-row`}
            data-tip={props.tooltipText}>
            <div className="form-control">
                <label className="label cursor-pointer">
                    <span
                        className="label-text badge text-primary-content bg-primary">
                        {props.label}
                    </span>
                    <input
                        type="checkbox"
                        name={props.name}
                        min={props.min}
                        max={props.max}
                        value={props.value}
                        className={`toggle ${props.inputExtraClasses}`}
                        onChange={props.onChange}
                        checked={props.checked}
                    />
                </label>
            </div>
        </div>
    </div>
);