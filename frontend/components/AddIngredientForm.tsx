import React, { useState } from 'react';
import { useAddIngredientMutation } from '../app/state/api'; // Import the mutation hook

// Define the props type for AddIngredientForm
interface AddIngredientFormProps {
  onClose: () => void; // onClose is a function that takes no arguments and returns nothing
}

const AddIngredientForm: React.FC<AddIngredientFormProps> = ({ onClose }) => {
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientPicture, setIngredientPicture] = useState('');
  const [ingredientDateExpired, setIngredientDateExpired] = useState('');
  const [addIngredient, { isLoading }] = useAddIngredientMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addIngredient({
        ingredientName,
        ingredientPicture,
        ingredientDateExpired,
      }).unwrap();

      alert('Ingredient added successfully!');
      setIngredientName('');
      setIngredientPicture('');
      setIngredientDateExpired('');
      onClose(); // Close the form after successful submission
    } catch (error) {
      console.error('Failed to add ingredient:', error);
      alert('Error adding ingredient.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">Add New Ingredient</h2>
      <input
        type="text"
        placeholder="Ingredient Name"
        value={ingredientName}
        onChange={(e) => setIngredientName(e.target.value)}
        required
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Ingredient Picture URL"
        value={ingredientPicture}
        onChange={(e) => setIngredientPicture(e.target.value)}
        required
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="date"
        placeholder="Expiration Date"
        value={ingredientDateExpired}
        onChange={(e) => setIngredientDateExpired(e.target.value)}
        required
        className="w-full mb-4 p-2 border rounded"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
        >
          {isLoading ? 'Adding...' : 'Add Ingredient'}
        </button>
      </div>
    </form>
  );
};

export default AddIngredientForm;