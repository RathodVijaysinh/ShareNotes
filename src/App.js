import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import NotesList from './components/NotesList';
import Editor from './components/Editor';
import './App.css';

function App() {
  const [notes, setNotes] = useState([
    { id: 1, title: 'Hi, I am Vijay', content: 'Hi, I am Vijay.', favorite: true, trash: false, category: null },
    { id: 2, title: 'Hi, my name is Vijay', content: '', favorite: false, trash: false, category: null },
    { id: 3, title: 'Hello World', content: 'Welcome to the Notes App.', favorite: false, trash: false, category: null },
  ]);

  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('Notes');
  const [activeNote, setActiveNote] = useState(null);

  
  const addNewNote = (category = null) => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      favorite: false,
      trash: false,
      category: category,
    };
    setNotes([newNote, ...notes]);
    setActiveTab('Notes');
    setActiveNote(newNote);
  };

  
  const addCategory = (categoryName) => {
    setCategories([...categories, categoryName]);
  };

  
  const renameCategory = (oldCategory, newCategory) => {
    setCategories(
      categories.map((category) => (category === oldCategory ? newCategory : category))
    );
    setNotes(
      notes.map((note) =>
        note.category === oldCategory ? { ...note, category: newCategory } : note
      )
    );
  };

 
  const deleteCategory = (categoryName) => {
    setCategories(categories.filter((category) => category !== categoryName));
    setNotes(
      notes.map((note) =>
        note.category === categoryName ? { ...note, category: null } : note
      )
    );
  };


  const toggleFavorite = (noteId) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, favorite: !note.favorite } : note
      )
    );
  };

  const toggleTrash = (noteId) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, trash: !note.trash } : note
      )
    );
  };

  const handleNoteUpdate = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      )
    );
    setActiveNote(updatedNote);
  };

  const moveToCategory = (noteId, categoryName) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, category: categoryName } : note
      )
    );
  };


  const getFilteredNotes = () => {
    if (activeTab === 'Favorites') return notes.filter((note) => note.favorite && !note.trash);
    if (activeTab === 'Trash') return notes.filter((note) => note.trash);
    if (activeTab === 'Notes') return notes.filter((note) => !note.trash);
    if (categories.includes(activeTab)) return notes.filter((note) => note.category === activeTab); // Filter by category
    return notes.filter((note) => note.category === activeTab);
  };

  return (
    <div className="app">
      <div className='leftsection'>
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setActiveNote(null);
        }}
        categories={categories}
        addCategory={addCategory}
        renameCategory={renameCategory}
        deleteCategory={deleteCategory}
        addNewNote={addNewNote}
      />
      </div>
      
      <div className='rightsection'>
          <div className="notes-section">
            <NotesList
              notes={getFilteredNotes()}
              activeNote={activeNote}
              onNoteClick={setActiveNote}
              toggleFavorite={toggleFavorite}
              toggleTrash={toggleTrash}
              moveToCategory={moveToCategory}
            />
            <Editor note={activeNote} onNoteChange={handleNoteUpdate} />
          </div>
      </div>
    </div>
  );
}

export default App;
 
