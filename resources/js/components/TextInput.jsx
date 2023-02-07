import React from 'react'

export class TextInput extends React.Component {
    render() {
        return (
            <div className="inline-block">
                <label htmlFor={this.props.id} className="text-black font-semibold block px-2 mx-2">{this.props.label}</label>

                <input type="text" id={this.props.id} name={this.props.name} value={this.props.value} placeholder={this.props.placeholder} maxLength={this.props.maxLength}
                    onChange={this.props.onChange}
                    className="rounded bg-white  px-3 py-1 border border-gray-400 invalid:border-pink-500" />
            </div>
        );
    }
}