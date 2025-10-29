
import React from 'react';
import { Product } from '../types';
import { EditIcon, TrashIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  onSelect: (id: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onEdit, onDelete }) => {
    const statusColorMap: Record<Product['status'], string> = {
        'Published': 'bg-green-100 text-green-800',
        'Draft': 'bg-yellow-100 text-yellow-800',
        'Archived': 'bg-slate-100 text-slate-800'
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col">
            <img 
                onClick={() => onSelect(product.id)}
                src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/300`} 
                alt={product.name} 
                className="w-full h-48 object-cover cursor-pointer" 
            />
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[product.status]}`}>
                        {product.status}
                    </span>
                    <p className="text-lg font-bold text-primary-600">${product.price.toFixed(2)}</p>
                </div>
                <h3 
                    onClick={() => onSelect(product.id)}
                    className="mt-2 text-xl font-bold text-slate-800 truncate cursor-pointer hover:text-primary-700">
                        {product.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                <p className="mt-2 text-sm text-slate-600 flex-grow clamp-3">{product.description}</p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
                 <button onClick={() => onEdit(product)} className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-100 rounded-full transition-colors">
                    <EditIcon className="w-5 h-5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(product.id); }} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
            <style jsx>{`
                .clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};


interface ProductListProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onSelectProduct, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={onSelectProduct}
                onEdit={onEditProduct}
                onDelete={onDeleteProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <h3 className="text-xl font-medium text-slate-700">No products yet.</h3>
            <p className="mt-2 text-slate-500">Click "Add New Product" to get started!</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
