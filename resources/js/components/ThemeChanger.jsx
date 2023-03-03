import React, { useState, useEffect } from 'react'
import Theme from './Theme'
import { themeChange } from 'theme-change';

export default function ThemeChanger(props) {

    useEffect(() => {
        themeChange(!(document.readyState == "complete"));
        return () => "";
    });

    return (
        <div title="Change Theme" className="dropdown dropdown-start">
            <div tabIndex={1} className="btn gap-1 normal-case btn-ghost">
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
                <span className="hidden md:inline">Theme</span>
                <svg className="h-8 w-8 fill-current hidden sm:block" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>

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