
import React, { useState, useEffect, useCallback } from 'react';
import { Product, ProductStatus } from '../types';
import { SparklesIcon, XIcon } from './Icons';
import * as geminiService from '../services/geminiService';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, productToEdit }) => {
  const [product, setProduct] = useState<Omit<Product, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    status: 'Draft',
    imageUrl: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setProduct(productToEdit);
    } else {
      setProduct({
        name: '',
        description: '',
        category: '',
        price: 0,
        status: 'Draft',
        imageUrl: '',
      });
    }
  }, [productToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
  };

  const handleGenerateDescription = useCallback(async () => {
    if (!product.name || !product.category) {
      alert("Please enter a product name and category first.");
      return;
    }
    setIsGenerating(true);
    try {
      const description = await geminiService.generateDescription(product.name, product.category);
      setProduct(prev => ({ ...prev, description }));
    } catch (error) {
      console.error("Failed to generate description:", error);
      alert("Couldn't generate a description. Please check the console for errors.");
    } finally {
      setIsGenerating(false);
    }
  }, [product.name, product.category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.name || !product.category) {
        alert("Product Name and Category are required.");
        return;
    }
    const productData: Product = {
      ...product,
      id: productToEdit?.id || crypto.randomUUID(),
      createdAt: productToEdit?.createdAt || new Date().toISOString(),
    };
    onSave(productData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Product Name</label>
              <input type="text" name="name" id="name" value={product.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" required />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
              <input type="text" name="category" id="category" value={product.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" placeholder="e.g., SaaS, E-book, Online Course" required />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 disabled:opacity-50 disabled:cursor-not-allowed">
                  <SparklesIcon className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <textarea name="description" id="description" value={product.description} onChange={handleChange} rows={5} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
              {product.description && (
                <div className="mt-4 p-4 border border-slate-200 rounded-md bg-slate-50">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</h4>
                  <div className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                    {product.description}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price ($)</label>
                <input type="number" name="price" id="price" value={product.price} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" step="0.01" min="0" />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
                <select name="status" id="status" value={product.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                  {(['Draft', 'Published', 'Archived'] as ProductStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">Image URL (Optional)</label>
              <input type="text" name="imageUrl" id="imageUrl" value={product.imageUrl} onChange={handleChange} placeholder="https://picsum.photos/400/300" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700">Save Product</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormModal;
