import React from 'react'

export class TextInput extends React.Component {
    render() {
        return (
            <div className="form-control py-2">
                <label className="input-group">
                    <span className="bg-primary text-primary-content w-20">{this.props.label}</span>
                    <input type="text" id={this.props.id} name={this.props.name} value={this.props.value} placeholder={this.props.placeholder} maxLength={this.props.maxLength}
                        onChange={this.props.onChange}
                        className="input input-bordered focus:ring-4 m-0" />
                </label>
            </div>
        );
    }
}