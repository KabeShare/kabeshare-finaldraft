import React from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
  const { currency, router } = useAppContext();

  return (
    <div
      onClick={() => {
        router.push('/product/' + product._id);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-2 max-w-[220px] w-full cursor-pointer p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow"
    >
      <div className="group relative bg-gray-100 rounded-lg w-full h-56 flex items-center justify-center overflow-hidden">
        <Image
          src={product.image[0]}
          alt={product.name}
          className="group-hover:scale-110 transition-transform object-cover w-full h-full"
          width={800}
          height={800}
        />
        {/* <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition">
          <Image className="h-4 w-4" src={assets.heart_icon} alt="heart_icon" />
        </button> */}
      </div>

      <p className="text-sm md:text-base font-semibold pt-2 w-full truncate text-gray-800">
        {product.name}
      </p>
      <p className="w-full text-xs text-gray-500 truncate">
        {product.location}
      </p>

      {/* <div className="flex items-center justify-between w-full mt-2">
        <p className="text-sm font-medium text-gray-800">
          {currency}
          {product.offerPrice}
        </p>
        <button className="px-4 py-1.5 text-white bg-gray-800 rounded-full text-xs hover:bg-gray-700 transition">
          購入する
        </button>
      </div> */}
    </div>
  );
};

export default ProductCard;
