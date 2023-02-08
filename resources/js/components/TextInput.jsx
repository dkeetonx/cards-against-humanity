import React from 'react'

export class TextInput extends React.Component {
    render() {
        return (
            <div className="form-control p-2">
                <label className="input-group">
                    <span className="">{this.props.label}</span>
                    <input type="text" id={this.props.id} name={this.props.name} value={this.props.value} placeholder={this.props.placeholder} maxLength={this.props.maxLength}
                        onChange={this.props.onChange}
                        className="input input-bordered" />
                </label>
            </div>
        );
    }
}