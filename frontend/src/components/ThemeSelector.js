import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { HexColorPicker } from 'react-colorful';
import styles from './ThemeSelector.module.css';

const ThemeSelector = () => {
  const { theme, updateTheme } = useTheme();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeColor, setActiveColor] = useState(null);
  const [customName, setCustomName] = useState('');

  const themePresets = {
    modern: {
      light: {
        primary: '#4A90E2',
        secondary: '#F5A623',
        background: '#FFFFFF',
        text: '#333333'
      },
      dark: {
        primary: '#4A90E2',
        secondary: '#F5A623',
        background: '#1A1A1A',
        text: '#FFFFFF'
      }
    },
    warm: {
      light: {
        primary: '#E74C3C',
        secondary: '#F39C12',
        background: '#FFF9F5',
        text: '#2C3E50'
      },
      dark: {
        primary: '#E74C3C',
        secondary: '#F39C12',
        background: '#2C2826',
        text: '#FFFFFF'
      }
    }
  };

  const isDarkMode = theme.background.toLowerCase() === '#1a1a1a';

  const handleColorChange = (color) => {
    if (activeColor) {
      updateTheme({
        ...theme,
        [activeColor]: color
      });
    }
  };

  const handleSaveTheme = () => {
    if (!customName.trim()) return;
    
    const savedThemes = JSON.parse(localStorage.getItem('savedThemes') || '{}');
    savedThemes[customName] = theme;
    localStorage.setItem('savedThemes', JSON.stringify(savedThemes));
    setCustomName('');
  };

  const getSavedThemes = () => {
    return JSON.parse(localStorage.getItem('savedThemes') || '{}');
  };

  return (
    <div className={styles.themeSelector}>
      <div className={styles.themeHeader}>
        <h3>Theme Settings</h3>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={(e) => {
              const mode = e.target.checked ? 'dark' : 'light';
              const currentPreset = Object.entries(themePresets).find(([_, scheme]) => 
                scheme.light.primary === theme.primary
              )?.[0] || 'modern';
              updateTheme(themePresets[currentPreset][mode]);
            }}
          />
          <span className={styles.slider}></span>
          <span className={styles.label}>Dark Mode</span>
        </label>
      </div>

      <div className={styles.colorCustomizer}>
        <div className={styles.colorButtons}>
          {Object.entries(theme).map(([key, value]) => (
            <button
              key={key}
              className={styles.colorButton}
              style={{ backgroundColor: value }}
              onClick={() => {
                setActiveColor(key);
                setShowColorPicker(true);
              }}
            >
              {key}
            </button>
          ))}
        </div>

        {showColorPicker && (
          <div className={styles.colorPickerPopup}>
            <HexColorPicker 
              color={theme[activeColor]} 
              onChange={handleColorChange}
            />
            <button 
              className={styles.closeButton}
              onClick={() => setShowColorPicker(false)}
            >
              Done
            </button>
          </div>
        )}
      </div>

      <div className={styles.saveTheme}>
        <input
          type="text"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Save current theme as..."
          className={styles.themeInput}
        />
        <button 
          onClick={handleSaveTheme}
          className={styles.saveButton}
          disabled={!customName.trim()}
        >
          Save
        </button>
      </div>

      <div className={styles.presets}>
        {Object.entries(themePresets).map(([name, scheme]) => (
          <button
            key={name}
            className={styles.presetButton}
            style={{
              backgroundColor: scheme[isDarkMode ? 'dark' : 'light'].primary
            }}
            onClick={() => updateTheme(scheme[isDarkMode ? 'dark' : 'light'])}
          >
            <span className={styles.presetName}>{name}</span>
          </button>
        ))}
      </div>

      {Object.keys(getSavedThemes()).length > 0 && (
        <div className={styles.savedThemes}>
          <h4>Saved Themes</h4>
          <div className={styles.themeGrid}>
            {Object.entries(getSavedThemes()).map(([name, savedTheme]) => (
              <button
                key={name}
                className={styles.savedTheme}
                style={{ backgroundColor: savedTheme.primary }}
                onClick={() => updateTheme(savedTheme)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;