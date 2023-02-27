import React from 'react'

export class TextInput extends React.Component {
    render() {
        return (
            <div className={ "relative form-control " + this.props.className }>
                <label htmlFor={this.props.id}
                    className="absolute badge text-sm text-primary-content bg-primary py-0 px-2 m-0 top-0.5 left-2 z-10">
                    {this.props.label}
                </label>
                    <input type="text" id={this.props.id} name={this.props.name} value={this.props.value} placeholder={this.props.placeholder} maxLength={this.props.maxLength}
                            onChange={this.props.onChange}
                            className="input input-bordered mt-3" />
                    {
                        this.props.children && 
                        <button className="absolute btn btn-secondary mt-3 top-0 right-0">{this.props.children}</button>
                    }
            </div>
        );
    }
}