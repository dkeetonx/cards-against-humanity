import React, { useState, useEffect } from 'react'
import Theme from './Theme'
import { themeChange } from 'theme-change';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faSwatchbook,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';

export default function ThemeChanger(props) {

    useEffect(() => {
        themeChange(!(document.readyState == "complete"));
    }, []);

    return (
        <div title="Change Theme" className={`dropdown ${props.className}`}>
            <div tabIndex={1} className="btn gap-1 normal-case btn-ghost">
                <FontAwesomeIcon icon={faSwatchbook} className="text-lg" />
                <span className="hidden md:inline">Theme</span>
                <FontAwesomeIcon icon={faChevronDown} className="text-lg hidden sm:block" />
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