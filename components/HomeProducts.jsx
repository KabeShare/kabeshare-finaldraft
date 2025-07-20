import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';

const HomeProducts = () => {
  const { router } = useAppContext();
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const { data } = await axios.get('/api/product/recent');
        if (data.success) {
          setRecentProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to fetch recent products:', error);
      }
    };

    fetchRecentProducts();
  }, []);

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">人気画像</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {recentProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
      <button
        onClick={() => {
          router.push('/all-products');
        }}
        className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
      >
        もっと見る
      </button>
    </div>
  );
};

export default HomeProducts;
