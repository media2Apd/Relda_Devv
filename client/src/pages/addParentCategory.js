import React, { useState, useEffect } from 'react';

function AddParentCategory() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryImagePreview, setCategoryImagePreview] = useState(null);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await fetch('http://localhost:8080/api/get-parent-categories');
    const data = await response.json();
    setCategories(data.categories);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('categoryImage', categoryImage);

    const response = await fetch('http://localhost:8080/api/add-parent-category', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      fetchCategories();
      setName('');
      setCategoryImage(null);
      setCategoryImagePreview(null);
      setIsModalOpen(false);
    } else {
      alert(data.message);
    }
  };

  const handleEditCategory = async (category) => {
    setEditId(category._id);
    setName(category.name);
    setCategoryImage(null);
    setCategoryImagePreview(category.categoryImage);
    setIsModalOpen(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    if (categoryImage) {
      formData.append('categoryImage', categoryImage);
    }

    const response = await fetch(`http://localhost:8080/api/edit-parent-category/${editId}`, {
      method: 'PUT',
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      fetchCategories();
      setEditId(null);
      setName('');
      setCategoryImage(null);
      setCategoryImagePreview(null);
      setIsModalOpen(false);
    } else {
      alert(data.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    const response = await fetch(`http://localhost:8080/api/delete-parent-category/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    if (data.success) {
      fetchCategories();
    } else {
      alert(data.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCategoryImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCategoryImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold mb-4">Parent Categories</h2>
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white font-bold rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add Parent Category
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Parent Category' : 'Add Parent Category'}</h2>
            <form
              onSubmit={editId ? handleUpdateCategory : handleAddCategory}
              className="flex flex-col"
            >
              <input
                type="text"
                placeholder="Category Name"
                className="mb-2 p-2 border border-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              
              <input
                type="file"
                className="mb-2 p-2 border border-gray-300"
                onChange={handleImageChange}
                required={!editId}
              />
              {categoryImagePreview && (
                <img
                  src={categoryImagePreview}
                  alt="Preview"
                  className="mt-4 w-32 h-32 object-cover rounded"
                />
              )}
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white font-bold rounded"
              >
                {editId ? 'Update Category' : 'Add Category'}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mt-2 p-2 bg-gray-500 text-white font-bold rounded"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
      {categories.length > 0 && (
        <div className="rounded-lg shadow-md mt-6 p-4">
        <h3 className="text-lg font-bold mb-4">Parent Category List</h3>
          <table className="min-w-full table-auto">
            <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="border border-r">
          {categories.map((category) => (
            <tr key={category._id} className="text-center">
              <td className="px-4 py-2">{category.name}</td>
              <td className="px-4 py-2">
                <img src={category.categoryImage} alt={category.name} className="w-16 h-16 object-cover mx-auto" />
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category._id)}
                  className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    )}
    </div>
  );
}

export default AddParentCategory;
