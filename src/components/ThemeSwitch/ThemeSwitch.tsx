import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeSwitch.css';

export const ThemeSwitch = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button 
            className={`theme-switch ${isDark ? 'dark' : 'light'}`} 
            onClick={toggleTheme}
            aria-label="Alternar tema"
            title="Alternar tema"
        >
            <div className="theme-switch-track">
                <Sun className="theme-switch-icon sun" size={14} />
                <Moon className="theme-switch-icon moon" size={14} />
                <div className="theme-switch-thumb"></div>
            </div>
        </button>
    );
};
