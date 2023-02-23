import React from 'react'

export class Theme extends React.Component {

    render() {
        return (
            <button className="outline-base-content overflow-hidden rounded-lg text-left" data-set-theme={this.props.dataTheme} data-act-class="[&_svg]:visible">
                <div data-theme={this.props.dataTheme} className="bg-base-100 text-base-content w-full cursor-pointer font-sans">
                    <div className="grid grid-cols-5 grid-rows-3">
                        <div className="col-span-5 row-span-3 row-start-1 flex gap-2 py-3 px-4 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3   invisible">
                                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                            </svg>
                            <div className="flex-grow text-sm font-bold">{this.props.themeName}</div>
                            <div className="flex flex-shrink-0 flex-wrap gap-1 h-full">
                                <div className="bg-primary w-2 rounded"></div>
                                <div className="bg-secondary w-2 rounded"></div>
                                <div className="bg-accent w-2 rounded"></div>
                                <div className="bg-neutral w-2 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        );
    }
}