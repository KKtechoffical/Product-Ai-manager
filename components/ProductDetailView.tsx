
import React, { useState, useCallback } from 'react';
import { Product, MarketingCopy, ContentAnalysis } from '../types';
import { ChevronLeftIcon, SparklesIcon, BotIcon } from './Icons';
import * as geminiService from '../services/geminiService';

interface ProductDetailViewProps {
  product: Product;
  onBack: () => void;
}

const statusColorMap: Record<Product['status'], string> = {
    'Published': 'bg-green-100 text-green-800',
    'Draft': 'bg-yellow-100 text-yellow-800',
    'Archived': 'bg-slate-100 text-slate-800'
};

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
);

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product, onBack }) => {
    const [marketingCopy, setMarketingCopy] = useState<MarketingCopy | null>(null);
    const [contentAnalysis, setContentAnalysis] = useState<ContentAnalysis | null>(null);
    const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const handleGenerateCopy = useCallback(async () => {
        setIsGeneratingCopy(true);
        setMarketingCopy(null);
        try {
            const copy = await geminiService.generateMarketingCopy(product);
            setMarketingCopy(copy);
        } catch (error) {
            console.error(error);
            alert("Failed to generate marketing copy.");
        } finally {
            setIsGeneratingCopy(false);
        }
    }, [product]);

    const handleAnalyzeContent = useCallback(async () => {
        setIsAnalyzing(true);
        setContentAnalysis(null);
        try {
            const analysis = await geminiService.analyzeContent(product.description);
            setContentAnalysis(analysis);
        } catch (error) {
            console.error(error);
            alert("Failed to analyze content.");
        } finally {
            setIsAnalyzing(false);
        }
    }, [product.description]);
    
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-6">
                <ChevronLeftIcon className="w-5 h-5 mr-1" />
                Back to all products
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Product Info */}
                <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-lg shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${statusColorMap[product.status]}`}>
                                {product.status}
                            </span>
                            <h1 className="text-3xl font-extrabold text-slate-900 mt-2">{product.name}</h1>
                            <p className="text-lg text-slate-500 mt-1">{product.category}</p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                             <p className="text-4xl font-bold text-primary-600">${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-slate-800">Description</h2>
                        <p className="mt-2 text-slate-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <img src={product.imageUrl || `https://picsum.photos/seed/${product.id}/800/600`} alt={product.name} className="w-full h-auto rounded-lg object-cover shadow-lg" />
                    </div>
                </div>

                {/* Right Column - AI Tools */}
                <div className="space-y-6">
                    {/* Marketing Copy Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-slate-800">Marketing Copy</h3>
                        <div className="mt-4">
                            {isGeneratingCopy ? (
                                <div className="flex justify-center items-center py-10">
                                    <div className="text-center">
                                        <LoadingSpinner />
                                        <p className="text-sm text-slate-500 mt-2">Generating copy...</p>
                                    </div>
                                </div>
                            ) : marketingCopy ? (
                                <div className="animate-fade-in space-y-4 text-sm">
                                    <div>
                                        <p className="font-semibold text-slate-600">Ad Headline:</p>
                                        <p className="p-2 bg-slate-50 rounded mt-1 text-slate-800">{marketingCopy.adHeadline}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-600">Ad Body:</p>
                                        <p className="p-2 bg-slate-50 rounded mt-1 text-slate-800">{marketingCopy.adBody}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-600">Social Media Post:</p>
                                        <p className="p-2 bg-slate-50 rounded mt-1 text-slate-800 whitespace-pre-wrap">{marketingCopy.socialMediaPost}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <SparklesIcon className="w-8 h-8 mx-auto text-slate-400" />
                                    <p className="mt-2 text-sm text-slate-500">Need inspiration? Generate ad headlines, body copy, and social media posts for your product.</p>
                                    <button onClick={handleGenerateCopy} disabled={isGeneratingCopy} className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 disabled:bg-primary-300">
                                        <SparklesIcon className="w-4 h-4" />
                                        Generate with AI
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description Analysis Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold text-slate-800">Description Analysis</h3>
                        <div className="mt-4">
                            {isAnalyzing ? (
                                <div className="flex justify-center items-center py-10">
                                    <div className="text-center">
                                        <LoadingSpinner />
                                        <p className="text-sm text-slate-500 mt-2">Analyzing content...</p>
                                    </div>
                                </div>
                            ) : contentAnalysis ? (
                                <div className="animate-fade-in space-y-4 text-sm">
                                    <div>
                                        <p className="font-semibold text-slate-600">Tone:</p>
                                        <p className="p-2 bg-slate-50 rounded mt-1 text-slate-800">{contentAnalysis.tone}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-600">Clarity Score:</p>
                                        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1">
                                            <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${contentAnalysis.clarityScore * 10}%` }}></div>
                                        </div>
                                        <p className="text-right text-xs font-bold text-primary-600">{contentAnalysis.clarityScore}/10</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-600">Suggestions:</p>
                                        <ul className="list-disc list-inside mt-1 space-y-1 text-slate-800">
                                            {contentAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <BotIcon className="w-8 h-8 mx-auto text-slate-400" />
                                    <p className="mt-2 text-sm text-slate-500">Get AI-powered feedback on your description's tone and clarity, with suggestions for improvement.</p>
                                    <button onClick={handleAnalyzeContent} disabled={isAnalyzing} className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 border border-transparent rounded-md hover:bg-primary-200 disabled:bg-primary-50">
                                        <SparklesIcon className="w-4 h-4" />
                                        Analyze with AI
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailView;
