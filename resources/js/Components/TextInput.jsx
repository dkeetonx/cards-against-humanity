import React from 'react'

export default props => (
    <div className={`relative form-control ${props.className}`}>
        <div className={`tooltip ${props.tooltipExtraClasses} flex flex-row`}
            data-tip={props.tooltipText}>
            <label htmlFor={props.id}
                className="absolute badge text-sm text-primary-content bg-primary py-0 px-2 m-0 top-0.5 left-2 z-10">
                {props.label}
            </label>
            <input type="text" id={props.id} name={props.name} value={props.value ?? ""}
                placeholder={props.placeholder} maxLength={props.maxLength}
                ref={props.inputRef}
                onChange={props.onChange}
                className={`mt-3 input input-bordered ${props.inputExtraClasses}`}
            />
            {props.children}
        </div>
    </div>
);
