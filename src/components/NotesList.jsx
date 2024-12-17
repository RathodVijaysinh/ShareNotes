import React, { useState } from 'react';
import { FaFolderOpen, FaSearch, FaThumbtack, FaTrashAlt, FaDownload, FaCopy } from 'react-icons/fa';
import './NoteList.css';

function NotesList({
  notes,
  activeNote,
  onNoteClick,
  toggleFavorite,
  toggleTrash,
  moveToCategory,
}) {
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  

  const handleMenuToggle = (noteId) => {
    setMenuOpenId(menuOpenId === noteId ? null : noteId);
  };

  const handleDownload = (note) => {
    const blob = new Blob([note.content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${note.title || 'note'}.txt`;
    link.click();
  };

  const handleCopyReference = (note) => {
    navigator.clipboard.writeText(`Note ID: ${note.id}`);
    alert('Note reference copied to clipboard!');
  };

  const handleMoveToCategory = (note) => {
    const category = prompt('Enter category to move the note to:');
    if (category) {
      moveToCategory(note.id, category);
    }
  };

  const handleTitleEdit = (note) => {
    setEditingNoteId(note.id);
    setEditedTitle(note.title);
  };

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleTitleSave = (note) => {
    note.title = editedTitle; 
    setEditingNoteId(null); 
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.favorite - a.favorite); 

  return (
    <section>
       <div className="notes-list">

            <div className="search-bar">
              <div className="search-icon">
                <FaSearch size={20} color="gray" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className='mainnotes'>
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`note-item ${note.id === activeNote?.id ? 'active' : ''}`}
                >
                  {/* Note Title */}
                  <div
                    onClick={() => onNoteClick(note)}
                    onDoubleClick={() => handleTitleEdit(note)}
                    className="note-content"
                  >
                     {editingNoteId === note.id ?
                      (
                        <input
                        className='title-input'
                          type="text"
                          value={editedTitle}
                          onChange={handleTitleChange}
                          onBlur={() => handleTitleSave(note)} 
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTitleSave(note); 
                          }}
                          autoFocus
                        />
                      ) : (note.title)
                    }
                  </div>

                  {/* Note Actions */}
                  <div className="note-actions">
                    <button
                      className="menu-toggle"
                      onClick={() => handleMenuToggle(note.id)}
                    >
                      ⋮
                    </button>
                    {menuOpenId === note.id && (
                      <div className="menu">

                        <button onClick={() => handleMoveToCategory(note)}>
                          <FaFolderOpen /> Move to Category
                        </button>

                        <button onClick={() => toggleFavorite(note.id)}>
                          {note.favorite ? <FaThumbtack /> : <FaThumbtack />}
                          {note.favorite ? 'Unpin Note' : 'Pin Note'}
                        </button>

                        <button onClick={() => toggleTrash(note.id)}>
                          <FaTrashAlt />
                          {note.trash ? 'Back To Trash' : 'Move to Trash'}
                        </button>

                        <button onClick={() => handleDownload(note)}>
                          <FaDownload /> Download
                        </button>

                        <button onClick={() => handleCopyReference(note)}>
                          <FaCopy /> Copy Reference
                        </button>

                      </div>
                     )
                  }
                  </div>
                </div>
              ))}
            </div>
       </div>
    </section>   
  );
}

export default NotesList;

