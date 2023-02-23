import React from 'react'
import {Theme} from './Theme'

export class ThemeChanger extends React.Component {

    render() {
        return (
            <div title="Change Theme" className="dropdown dropdown-end ">
                <div tabIndex={1} className="btn gap-1 normal-case btn-ghost">
                    <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"   className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01">
                        </path>
                    </svg>
                    <span className="hidden md:inline">Theme</span>
                    <svg width="12px" height="12px" className="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
                        <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                    </svg>
                </div>
                <div className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px max-h-96 h-[70vh] w-52 overflow-y-auto shadow-2xl mt-16">
                    <div className="grid grid-cols-1 gap-3 p-3" tabIndex={1}>
                        <Theme dataTheme="" themeName="default" />
                        <Theme dataTheme="lofi" themeName="lofi" />
                        <Theme dataTheme="light" themeName="light" />
                        <Theme dataTheme="dark" themeName="dark" />
                        <Theme dataTheme="cupcake" themeName="cupcake" />
                        <Theme dataTheme="bumblebee" themeName="bumblebee" />
                        <Theme dataTheme="emerald" themeName="emerald" />
                        <Theme dataTheme="corporate" themeName="corporate" />
                        <Theme dataTheme="synthwave" themeName="synthwave" />
                        <Theme dataTheme="retro" themeName="retro" />
                        <Theme dataTheme="cyberpunk" themeName="cyberpunk" />
                        <Theme dataTheme="valentine" themeName="valentine" />
                        <Theme dataTheme="halloween" themeName="halloween" />
                        <Theme dataTheme="garden" themeName="garden" />
                        <Theme dataTheme="forest" themeName="forest" />
                        <Theme dataTheme="aqua" themeName="aqua" />
                        <Theme dataTheme="pastel" themeName="pastel" />
                        <Theme dataTheme="fantasy" themeName="fantasy" />
                        <Theme dataTheme="wireframe" themeName="wireframe" />
                        <Theme dataTheme="black" themeName="black" />
                        <Theme dataTheme="luxury" themeName="luxury" />
                        <Theme dataTheme="dracula" themeName="dracula" />
                        <Theme dataTheme="cmyk" themeName="cmyk" />
                        <Theme dataTheme="autumn" themeName="autumn" />
                        <Theme dataTheme="business" themeName="business" />
                        <Theme dataTheme="acid" themeName="acid" />
                        <Theme dataTheme="lemonade" themeName="lemonade" />
                        <Theme dataTheme="night" themeName="night" />
                        <Theme dataTheme="coffee" themeName="coffee" />
                        <Theme dataTheme="winter" themeName="winter" />
                    </div>
                </div>
            </div>
        );
    }
}