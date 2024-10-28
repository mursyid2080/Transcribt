// src/components/ModalForm.js
import React from 'react';

const ModalForm = ({
  showModal,
  title,
  author,
  categoriesOptions,
  selectedCategories,
  onClose,
  onSubmit,
  onInputChange,
  onCategoriesChange,
}) => {
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
    onCategoriesChange(uniqueCategories);
  
    // Clear the selection in the dropdown
    event.target.value = [];
  };

  // Handler to remove a specific category
  const handleRemoveCategory = (category) => {
    const updatedCategories = selectedCategories.filter((c) => c !== category);
    onCategoriesChange(updatedCategories);
  };

  return (
    <div className="modal-overlay" style={styles.overlay}>
      <div className="modal-content" style={styles.modal}>
        <h2>Enter Title, Author, and Categories</h2>
        <form onSubmit={onSubmit}>
          {/* Title Input */}
          <div style={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={onInputChange}
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
              onChange={onInputChange}
              required
              style={styles.input}
            />
          </div>

          {/* Categories Multi-Select */}
          <div style={styles.formGroup}>
            <label htmlFor="categories">Categories:</label>
            <small>Select one or more categories</small>
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
    width: '400px',
    maxHeight: '80vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
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
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  select: {
    padding: '8px',
    fontSize: '16px',
    marginTop: '5px',
    height: '120px', // Increased height for better visibility
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
