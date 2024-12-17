import React, { useState ,useEffect,useRef} from 'react';
import './Editor.css';



const glossary = {
  React: "A JavaScript library for building user interfaces.",
  JavaScript: "A versatile programming language primarily used for web development.",
  Node: "A JavaScript runtime built on Chrome's V8 engine.",
  Frontend: "The user interface and design components of an application.",
  Backend: "The server-side functionality of an application.",
};

function Editor({ note, onNoteChange }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, term: '', explanation: '', x: 0, y: 0 });
  const [grammarErrors, setGrammarErrors] = useState([]);
  const [showSuggestion, setShowSuggestion] = useState({ visible: false, message: '', x: 0, y: 0 });
  const [alignment, setAlignment] = useState('left');
  const [fontStyle, setFontStyle] = useState({
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    fontSize: '16px',
  });

  const textareaRef = useRef(null);

  const checkGrammar = async (text) => {
    const apiKey = ''; 
    const url = 'https://api.prowritingaid.com/v1/analyze';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text: text,
          language: 'en',
        }),
      });

      const result = await response.json();
      const errors = result.errors.map((error) => ({
        message: error.message,
        offset: error.offset,
        length: error.length,
        replacement: error.replacement,
      }));

      setGrammarErrors(errors);
    } catch (error) {
      console.error('Grammar check failed:', error);
    }
  };

  const handleNoteUpdate = (event) => {
    const updatedContent = event.target.value;

    if (onNoteChange) {
      onNoteChange({ ...note, content: updatedContent });
    }

    checkGrammar(updatedContent);
  };

  const highlightGlossaryTerms = (content) => {
    const terms = Object.keys(glossary);
    const regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi');
    const parts = content.split(regex);

    return parts.map((part, index) =>
      glossary[part] ? (
        <span
          key={index}
          className="highlight"
          onMouseOver={(e) => showGlossaryTooltip(e, part)}
          onMouseOut={hideTooltip}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const showGlossaryTooltip = (event, term) => {
    const { clientX, clientY } = event;
    setTooltip({
      visible: true,
      term,
      explanation: glossary[term],
      x: clientX + 10,
      y: clientY + 10,
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, term: '', explanation: '', x: 0, y: 0 });
  };

  const highlightGrammarErrors = (content) => {
    if (!content) return '';
    const fragments = [];
    let cursor = 0;

    grammarErrors.forEach((error, index) => {
      const { offset, length, message } = error;
      fragments.push(
        content.slice(cursor, offset),
        <span
          key={`error-${index}`}
          className="error-highlight"
          onMouseOver={(e) => showGrammarTooltip(e, message)}
          onMouseOut={hideTooltip}
        >
          {content.slice(offset, offset + length)}
        </span>
      );
      cursor = offset + length;
    });

    fragments.push(content.slice(cursor));
    return fragments;
  };

  const showGrammarTooltip = (event, message) => {
    const { clientX, clientY } = event;
    setShowSuggestion({
      visible: true,
      message,
      x: clientX + 10,
      y: clientY + 10,
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleCopyText = () => {
    if (note?.content) {
      navigator.clipboard.writeText(note.content);
      alert('Text copied to clipboard!');
    } else {
      alert('Nothing to copy!');
    }
  };


  const handleClearText = () => {
    if (onNoteChange && note) {
      onNoteChange({ ...note, content: '' });
    }
  }; 


  const handleFontChange = (key, value) => {
    setFontStyle((prevStyle) => ({
      ...prevStyle,
      [key]: prevStyle[key] === value ? 'normal' : value,
    }));
  }; 


  const handleFontSizeChange = (size) => {
    setFontStyle((prevStyle) => ({
      ...prevStyle,
      fontSize: size,
    }));
  };

  

  return (
    <div className={`editor ${isDarkMode ? 'dark' : 'light'}`}>

      <div className="editor-toolbar">
        <button onClick={toggleDarkMode} className="toolbar-btn">
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
        <button onClick={handleCopyText} className="toolbar-btn">📋 Copy</button>
        <button onClick={handleClearText} className="toolbar-btn">🗑️ Clear</button>

        <div className="text-style-controls">
          <button
            className={`toolbar-btn ${fontStyle.fontWeight === 'bold' ? 'active' : ''}`}
            onClick={() => handleFontChange('fontWeight', 'bold')}
          >
            B
          </button>
          <button
            className={`toolbar-btn ${fontStyle.fontStyle === 'italic' ? 'active' : ''}`}
            onClick={() => handleFontChange('fontStyle', 'italic')}
          >
            I
          </button>
          <button
            className={`toolbar-btn ${fontStyle.textDecoration === 'underline' ? 'active' : ''}`}
            onClick={() => handleFontChange('textDecoration', 'underline')}
          >
            U
          </button>
          <select
            className="font-size-select"
            value={fontStyle.fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
          >
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
          </select>
        </div>

        <div className="text-alignment-controls">
          <button
            className={`toolbar-btn ${alignment === 'left' ? 'active' : ''}`}
            onClick={() => setAlignment('left')}
          >
            ⬅️ Left
          </button>
          <button
            className={`toolbar-btn ${alignment === 'center' ? 'active' : ''}`}
            onClick={() => setAlignment('center')}
          >
            ⬆️ Center
          </button>
          <button
            className={`toolbar-btn ${alignment === 'right' ? 'active' : ''}`}
            onClick={() => setAlignment('right')}
          >
            ➡️ Right
          </button>
        </div>
      </div>

      <div className="editor-container">
        <textarea
          ref={textareaRef}
          className="editor-textarea"
          style={{
            textAlign: alignment,
            fontWeight: fontStyle.fontWeight,
            fontStyle: fontStyle.fontStyle,
            textDecoration: fontStyle.textDecoration,
            fontSize: fontStyle.fontSize,
          }}
          value={note?.content || ''}
          onChange={handleNoteUpdate}
          placeholder="Type your note here..."
        />

        <div className="highlight-layer">
          {highlightGlossaryTerms(note?.content || '')}
          {highlightGrammarErrors(note?.content || '')}
        </div>

        {tooltip.visible && (
          <div className="tooltip" style={{ top: tooltip.y, left: tooltip.x }}>
            <strong>{tooltip.term}</strong>: {tooltip.explanation}
          </div>
        )}

        {showSuggestion.visible && (
          <div className="tooltip" style={{ top: showSuggestion.y, left: showSuggestion.x }}>
            {showSuggestion.message}
          </div>
        )}
      </div>

    </div>
  );
}

export default Editor;
