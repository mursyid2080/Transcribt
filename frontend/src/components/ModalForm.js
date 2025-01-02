import React, { useState, useEffect } from 'react';

const ModalForm = ({
  showModal,
  title: initialTitle,
  author: initialAuthor,
  categoriesOptions,
  selectedCategories: initialSelectedCategories,
  lyrics: initialLyrics,
  onClose,
  onSubmit,
  onInputChange,
  onCategoriesChange,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [selectedCategories, setSelectedCategories] = useState(initialSelectedCategories);
  const [lyrics, setLyrics] = useState(initialLyrics);
  if (!showModal) return null; // Do not render if modal is not visible

  // Handler for category selection
  const handleCategorySelect = (event) => {
    const options = event.target.options;
    const selected = [];

    // Collect selected options
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }

    // Merge new selected categories with existing ones, avoiding duplicates
    const uniqueCategories = Array.from(new Set([...selectedCategories, ...selected]));

    // Update categories and reset the selection
    setSelectedCategories(selected);
    onCategoriesChange(selected);

    // Clear the selection in the dropdown
    event.target.value = [];
  };

  // Handler to remove a specific category
  const handleRemoveCategory = (category) => {
    const updatedCategories = selectedCategories.filter((c) => c !== category);
    setSelectedCategories(updatedCategories);
    onCategoriesChange(updatedCategories);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, author, selectedCategories, lyrics });
  };

  return (
    <div className="modal-overlay" style={styles.overlay}>
      <div className="modal-content" style={styles.modal}>
        <h2>Enter Title, Author, Categories, and Lyrics</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formContainer}>
            {/* Left Column: Title, Author, and Categories */}
            <div style={styles.leftColumn}>
              {/* Title Input */}
              <div style={styles.formGroup}>
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} 
                  required
                  style={styles.input}
                />
              </div>

              {/* Author Input */}
              <div style={styles.formGroup}>
                <label htmlFor="author">Author:</label>
                <input
                  type="text"
                  name="author"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)} 
                  required
                  style={styles.input}
                />
              </div>

              {/* Categories Multi-Select */}
              <div style={styles.formGroup}>
                <label htmlFor="categories">Categories:</label>
                <small>Select a category</small>
                <select
                  multiple
                  name="categories"
                  id="categories"
                  value={selectedCategories}
                  onChange={handleCategorySelect}
                  style={styles.select}
                >
                  {categoriesOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Selected Categories as Chips */}
              <div style={styles.chipsContainer}>
                {selectedCategories.map((category) => (
                  <div key={category} style={styles.chip}>
                    {category}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(category)}
                      style={styles.chipButton}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Lyrics */}
            <div style={styles.rightColumn}>
              <div style={styles.formGroup}>
                <label htmlFor="lyrics">Lyrics:</label>
                <textarea
                  name="lyrics"
                  id="lyrics"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  // placeholder="Enter lyrics here..."
                  style={styles.textarea}
                  rows="10"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>
              Submit
            </button>
            <button type="button" onClick={onClose} style={styles.closeButton}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal styles
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    width: '1000px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  formGroup: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '8px',
    fontSize: '16px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  textarea: {
    padding: '8px',
    fontSize: '16px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
    width: '100%',
  },
  select: {
    padding: '8px',
    fontSize: '16px',
    marginTop: '5px',
    height: '120px',
  },
  chipsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: '15px',
  },
  chip: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: '16px',
    padding: '5px 10px',
    margin: '5px',
    fontSize: '14px',
  },
  chipButton: {
    background: 'none',
    border: 'none',
    marginLeft: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: '1',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  submitButton: {
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  },
  closeButton: {
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  },
};

export default ModalForm;
