
import React, { useState, useEffect, useMemo } from 'react';
import { Product, View } from './types';
import ProductList from './components/ProductList';
import ProductDetailView from './components/ProductDetailView';
import ProductFormModal from './components/ProductFormModal';
import { PlusIcon, SparklesIcon } from './components/Icons';

const sampleProducts: Product[] = [
    {
        id: 'prod_1',
        name: 'AI-Powered Code Assistant',
        description: 'Boost your development workflow with an intelligent code completion and suggestion tool. Writes boilerplate, finds bugs, and explains complex code in plain English.',
        category: 'SaaS / Developer Tool',
        price: 19.99,
        status: 'Published',
        imageUrl: 'https://picsum.photos/seed/prod_1/400/300',
        createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
    },
    {
        id: 'prod_2',
        name: 'The Ultimate Productivity Course',
        description: 'A comprehensive online course designed to help you master time management, focus, and goal setting. Includes video lessons, worksheets, and a private community.',
        category: 'Online Course',
        price: 249.00,
        status: 'Published',
        imageUrl: 'https://picsum.photos/seed/prod_2/400/300',
        createdAt: new Date('2023-11-15T14:30:00Z').toISOString(),
    },
    {
        id: 'prod_3',
        name: 'Minimalist Icon Pack',
        description: 'A set of 500+ professionally designed, pixel-perfect icons for your web and mobile projects. Available in SVG and Figma formats for easy customization.',
        category: 'Digital Asset',
        price: 49.00,
        status: 'Draft',
        imageUrl: 'https://picsum.photos/seed/prod_3/400/300',
        createdAt: new Date('2024-01-20T09:00:00Z').toISOString(),
    },
];

const Header: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
    <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                    <SparklesIcon className="w-8 h-8 text-primary-600" />
                    <h1 className="ml-3 text-2xl font-bold text-slate-800">Product AI Manager</h1>
                </div>
                <button
                    onClick={onAddNew}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <PlusIcon className="w-5 h-5 mr-2 -ml-1" />
                    Add New Product
                </button>
            </div>
        </div>
    </header>
);

const App: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [view, setView] = useState<View>('list');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    useEffect(() => {
        // Load products from local storage or use sample data on first load
        try {
            const storedProducts = localStorage.getItem('digital-products');
            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            } else {
                setProducts(sampleProducts);
            }
        } catch (error) {
            console.error("Could not parse products from localStorage", error);
            setProducts(sampleProducts);
        }
    }, []);

    useEffect(() => {
        // Persist products to local storage whenever they change
        if(products.length > 0) { // To avoid overwriting with empty array on initial render
            localStorage.setItem('digital-products', JSON.stringify(products));
        }
    }, [products]);

    const handleSelectProduct = (id: string) => {
        setSelectedProductId(id);
        setView('detail');
    };
    
    const handleBackToList = () => {
        setSelectedProductId(null);
        setView('list');
    };

    const handleOpenFormModal = (product: Product | null = null) => {
        setProductToEdit(product);
        setIsFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        setProductToEdit(null);
        setIsFormModalOpen(false);
    };

    const handleSaveProduct = (product: Product) => {
        setProducts(prevProducts => {
            const exists = prevProducts.some(p => p.id === product.id);
            if (exists) {
                return prevProducts.map(p => p.id === product.id ? product : p);
            }
            return [...prevProducts, product].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
    };
    
    const handleDeleteProduct = (id: string) => {
        if(window.confirm("Are you sure you want to delete this product?")) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };
    
    const selectedProduct = useMemo(() => {
        if (!selectedProductId) return null;
        return products.find(p => p.id === selectedProductId);
    }, [selectedProductId, products]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header onAddNew={() => handleOpenFormModal()} />
            <main>
                {view === 'list' && (
                    <ProductList 
                        products={products} 
                        onSelectProduct={handleSelectProduct}
                        onEditProduct={(p) => handleOpenFormModal(p)}
                        onDeleteProduct={handleDeleteProduct}
                    />
                )}
                {view === 'detail' && selectedProduct && (
                    <ProductDetailView product={selectedProduct} onBack={handleBackToList} />
                )}
            </main>
            <ProductFormModal
                isOpen={isFormModalOpen}
                onClose={handleCloseFormModal}
                onSave={handleSaveProduct}
                productToEdit={productToEdit}
            />
        </div>
    );
};

export default App;
