import React, { useState, useEffect, useRef } from 'react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  disabled?: boolean;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ value, onChange, suggestions, placeholder, disabled }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    // Affiche toutes les suggestions disponibles lorsque le champ est cliqué.
    setFilteredSuggestions(suggestions);
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.currentTarget.value;
    onChange(userInput);

    // Filtre les suggestions si l'utilisateur tape, sinon montre toutes les suggestions.
    const filtered = userInput
      ? suggestions.filter(
          suggestion => suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        )
      : suggestions;

    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
  };

  const handleClick = (suggestion: string) => {
    onChange(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    // Flèche vers le bas
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev));
    }
    // Flèche vers le haut
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : 0));
    }
    // Entrée
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex > -1 && filteredSuggestions[activeSuggestionIndex]) {
        handleClick(filteredSuggestions[activeSuggestionIndex]);
      }
      setShowSuggestions(false);
    }
     // Échap
    else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const SuggestionsListComponent = () => {
    return showSuggestions && filteredSuggestions.length > 0 ? (
      <ul className="absolute top-full left-0 right-0 bg-brand-card border border-brand-dark mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto z-20">
        {filteredSuggestions.map((suggestion, index) => {
          let className = "px-4 py-2 cursor-pointer text-gray-300 hover:bg-brand-dark/50";
          if (index === activeSuggestionIndex) {
            className += " bg-brand-dark";
          }
          return (
            <li key={suggestion} className={className} onMouseDown={() => handleClick(suggestion)}>
              {suggestion}
            </li>
          );
        })}
      </ul>
    ) : null;
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        onFocus={handleFocus}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2 bg-brand-dark border border-brand-card rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent sm:text-sm text-white disabled:bg-brand-card/50 disabled:cursor-not-allowed"
      />
      <SuggestionsListComponent />
    </div>
  );
};

export default AutocompleteInput;