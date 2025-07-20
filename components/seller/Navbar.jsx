import React from 'react';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const Navbar = () => {
  const { router } = useAppContext();

  return (
    <div className="flex items-center px-4 md:px-8 py-3 justify-between border-b">
      <Image
        onClick={() => router.push('/')}
        className="w-16 lg:w-18 cursor-pointer"
        src={assets.kabe_share_logo}
        alt="Logo"
      />
      {/* <button className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm">
        ログアウト
      </button> */}
    </div>
  );
};

export default Navbar;
