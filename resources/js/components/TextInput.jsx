import React from 'react'

function TextInput(props) {
    return (
        <div className={`relative form-control ${props.className}`}>
            <label htmlFor={props.id}
                className="absolute badge text-sm text-primary-content bg-primary py-0 px-2 m-0 top-0.5 left-2 z-10">
                {props.label}
            </label>
            <input type="text" id={props.id} name={props.name} value={props.value ?? ""} placeholder={props.placeholder} maxLength={props.maxLength}
                onChange={props.onChange}
                className={`input input-bordered mt-3 ${props.children && "pr-14"} ${props.uppercase && "uppercase"}`} />
            {
                props.children &&
                <button className="absolute btn btn-secondary mt-3 top-0 right-0 w-12">{props.children}</button>
            }
        </div>
    );
}
export default TextInput;