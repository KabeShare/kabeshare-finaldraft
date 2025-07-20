import React from 'react';
import Link from 'next/link';
import { assets } from '../../assets/assets';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const fetchUserList = async () => {
  try {
    const response = await fetch('/api/userlist');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user list:', error);
    return null; // Return null or handle gracefully
  }
};

const SideBar = () => {
  const pathname = usePathname();
  const menuItems = [
    { name: '画像を追加', path: '/seller', icon: assets.add_icon },
    {
      name: 'アートピース',
      path: '/seller/product-list',
      icon: assets.product_list_icon,
    },
    // { name: '受注状況', path: '/seller/user/list', icon: assets.order_icon },
    {
      name: 'ユーザーリスト',
      path: '/seller/user-list',
      icon: assets.order_icon,
    }, // New menu item
  ];

  return (
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-300 py-2 flex flex-col">
      {menuItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <Link href={item.path} key={item.name} passHref>
            <div
              className={`flex items-center py-3 px-4 gap-3 ${
                isActive
                  ? 'border-r-4 md:border-r-[6px] bg-orange-600/10 border-orange-500/90'
                  : 'hover:bg-gray-100/90 border-white'
              }`}
            >
              <Image
                src={item.icon}
                alt={`${item.name.toLowerCase()}_icon`}
                className="w-7 h-7"
              />
              <p className="md:block hidden text-center">{item.name}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SideBar;
