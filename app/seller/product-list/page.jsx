'use client';
import React, { useEffect, useState } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import Footer from '@/components/seller/Footer';
import Loading from '@/components/Loading';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductList = () => {
  const { router, getToken, user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get('/api/product/seller-list', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProducts(data.products);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = await getToken();
      const { data } = await axios.delete(`/api/product/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProducts(products.filter((product) => product._id !== productId));
        toast.success('Product deleted successfully!');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerProduct();
    }
  }, [user]);
  console.log(products);
  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <h2 className="pb-4 text-lg font-medium text-center md:text-left">
            すべての製品
          </h2>
          <div className="flex flex-col items-center max-w-full md:max-w-6xl w-full overflow-x-auto rounded-md bg-white border border-gray-500/20">
            <table className="table-fixed w-full text-center">
              <thead className="text-gray-900 text-sm">
                <tr>
                  <th className="px-4 py-3 font-medium text-center w-16">
                    作品タイトル
                  </th>
                  <th className="px-4 py-3 font-medium text-center w-32">
                    作家名
                  </th>
                  <th className="px-4 py-3 font-medium text-center w-32">
                    正解の絵のタイトル
                  </th>
                  <th className="px-4 py-3 font-medium text-center w-32">
                    回答締め切り
                  </th>
                  <th className="px-4 py-3 font-medium text-center w-32">
                    掲示場所​
                  </th>
                  <th className="px-4 py-3 font-medium text-center w-24">
                    ポイント
                  </th>
                  <th className="px-4 py-3 font-medium text-center w-16">
                    削除
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {products.map((product, index) => (
                  <tr key={index} className="border-t border-gray-500/20">
                    <td className="px-4 py-3 text-center w-16">
                      <div
                        className="rounded cursor-pointer"
                        onClick={() => router.push(`/product/${product._id}`)}
                      >
                        <Image
                          src={product.image[0]}
                          alt="product Image"
                          className="w-16 h-16 object-cover hover:opacity-80 transition-opacity"
                          width={64}
                          height={64}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center w-32">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-center w-32">
                      {product.imgname}
                    </td>
                    <td className="px-4 py-3 text-center w-32">
                      {new Date(product.commentFinalDate).toLocaleDateString(
                        'ja-JP',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }
                      )}
                    </td>
                    <td className="px-4 py-3 text-center w-32">
                      {product.location}
                    </td>
                    <td className="px-4 py-3 text-center w-24">
                      {product.pointsReceived || 0}
                    </td>
                    <td className="px-4 py-3 text-center w-16">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="px-2 py-1 text-black rounded-md transition flex items-center justify-center hover:scale-110"
                        >
                          <Image
                            src={assets.trash}
                            alt="Trash Icon"
                            className="h-4 w-5"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
