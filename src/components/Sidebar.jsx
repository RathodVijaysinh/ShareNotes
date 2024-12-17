 
import React, { useState } from 'react';
import './Sidebar.css';
import { FaRegStickyNote, FaHeart, FaTrashAlt, FaPlus } from 'react-icons/fa'; // Importing icons from react-icons

function Sidebar({ activeTab, onTabChange, categories, addCategory, renameCategory, deleteCategory, addNewNote }) {
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(null); // For dropdown options

  const handleCategoryAdd = () => {
    if (newCategory.trim() !== '') {
      addCategory(newCategory.trim());
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };


  return (
    <aside className="sidebar">
     
      <button className="new-note-btn" onClick={() => addNewNote()}>
        <FaPlus /> New Note
      </button>

      <div className='sidebarbtn'>

      
        <button
          className={`tab-btn ${activeTab === 'Notes' ? 'active' : ''}`}
          onClick={() => onTabChange('Notes')}
        >
          <FaRegStickyNote /> Notes
        </button>

      
        <button
          className={`tab-btn ${activeTab === 'Favorites' ? 'active' : ''}`}
          onClick={() => onTabChange('Favorites')}
        >
          <FaHeart /> Pin Notes
        </button>

       
        <button
          className={`tab-btn ${activeTab === 'Trash' ? 'active' : ''}`}
          onClick={() => onTabChange('Trash')}
        >
          <FaTrashAlt /> Trash
        </button>
      </div>

     
      <div className="categories-section">
        <button
          className="tab-btn"
          onClick={() => setShowCategoryInput(!showCategoryInput)}
        >
          <FaPlus /> Categories +
        </button>
        {showCategoryInput && (
          <div className="category-input">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category"
            />
            <button onClick={handleCategoryAdd}>Add</button>
          </div>
        )}
        
       
        <ul className="categories-list">
          {categories.map((category) => (
            <li
              key={category}
              className="category-item"
              onMouseEnter={() => setShowCategoryMenu(category)}
              onMouseLeave={() => setShowCategoryMenu(null)}
            >
              {category}
              {showCategoryMenu === category && (
                <div className="category-options">
                  <button onClick={() => deleteCategory(category)}>
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      const newName = prompt('Rename category:', category);
                      if (newName) renameCategory(category, newName);
                    }}
                  >
                    Rename
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      
    </aside>
  );
}

export default Sidebar;
 