'use client';
import React, { useState, useEffect } from 'react';
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from '@/assets/assets';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';

import { useClerk, UserButton } from '@clerk/nextjs';

// Fallback UserButton component for development
const FallbackUserButton = ({ onClick, children, ...props }) => (
  <div
    onClick={onClick}
    className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm cursor-pointer hover:bg-gray-400"
  >
    👤
  </div>
);

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();

  // Use Clerk hooks directly - they will be available when ClerkProvider is present
  let clerk, openSignIn;
  try {
    clerk = useClerk();
    openSignIn =
      clerk?.openSignIn ||
      (() => {
        console.log('Sign-in not available - please configure Clerk');
        // Fallback: redirect to sign-in page if available
        router.push('/sign-in');
      });
  } catch (error) {
    console.warn('Clerk not available:', error);
    openSignIn = () => {
      console.log('Authentication not configured');
      router.push('/sign-in');
    };
  }
  const [userPoints, setUserPoints] = useState(0);
  const [showInfoPopup, setShowInfoPopup] = useState(false);

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (!user) return;

      try {
        const res = await fetch('/api/user/data'); // Fetch user data from MongoDB
        if (!res.ok) {
          const text = await res.text();
          console.error('Error fetching user points:', text);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success && typeof data.user.points === 'number') {
          setUserPoints(data.user.points); // Set points from MongoDB
        } else {
          console.error('Invalid data format received:', data);
        }
      } catch (err) {
        console.error('Error fetching user points:', err.message || err);
      }
    };

    fetchUserPoints();
  }, [user]);

  useEffect(() => {
    if (!user) {
      const popupClosed = sessionStorage.getItem('infoPopupClosed');
      if (!popupClosed) {
        setShowInfoPopup(true);
      }
    } else {
      setShowInfoPopup(false);
    }
  }, [user]);

  const handleClosePopup = () => {
    setShowInfoPopup(false);
    sessionStorage.setItem('infoPopupClosed', 'true');
  };

  const handleComment = async (comment, paintingName) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, comment, paintingName }),
      });
      const data = await response.json();
      if (data.success) {
        // Fetch updated points after the first comment
        const res = await fetch(`/api/user/${user.id}/points`);
        const pointsData = await res.json();
        setUserPoints(pointsData.points);
      } else {
        console.error('Failed to handle comment:', data.message);
      }
    } catch (err) {
      console.error('Error handling comment:', err);
    }
  };

  return (
    <>
      <nav className="sticky top-0 flex items-center justify-between px-6 md:px-16 lg:px-32 py-6 border-b border-gray-300 text-gray-700 bg-[#FAEBD7] z-50 whitespace-nowrap">
        <div className="w-[160px]">
          {' '}
          {/* Fixed width container for logo */}
          <Image
            className="cursor-pointer w-16 md:w-18 text-gray-800"
            onClick={() => router.push('/')}
            src={assets.kabe_share_logo}
            alt="Kabe Share"
          />
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-4 lg:gap-8 max-md:hidden">
          <Link
            href="/"
            className="hover:text-gray-900 transition text-lg font-semibold"
          >
            ホーム
          </Link>
          <Link
            href="/all-products"
            className="hover:text-gray-900 transition text-lg font-semibold"
          >
            全製品
          </Link>
          <Link
            href="/vision"
            className="hover:text-gray-900 transition text-lg font-semibold"
          >
            ビジョン
          </Link>
          {isSeller && (
            <button
              onClick={() => router.push('/seller')}
              className="text-lg font-semibold px-4 py-2"
            >
              管理者ダッシュボード
            </button>
          )}
        </div>

        <div className="w-[160px] flex justify-end">
          <ul className="hidden md:flex items-center gap-4 ">
            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label={`ポイント: ${userPoints}`} // Reflect updated points
                    labelIcon={<BoxIcon />}
                    onClick={() => router.push('/user-point')} // Navigate to the new page
                  />
                </UserButton.MenuItems>
              </UserButton>
            ) : (
              <button
                onClick={openSignIn}
                className="flex items-center gap-2 hover:text-gray-900 transition"
              >
                <Image src={assets.user_icon} alt="user icon" />
                アカウント
              </button>
            )}
          </ul>
        </div>

        <div className="md:hidden">
          <div className="text-sm font-medium text-gray-700 text-center mb-2 ">
            メニュー
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="ホーム"
                    labelIcon={<HomeIcon />}
                    onClick={() => router.push('/')}
                  />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="全製品"
                    labelIcon={
                      <Image
                        src={assets.gallery}
                        alt="Gallery Icon"
                        width={24}
                        height={24}
                      />
                    }
                    onClick={() => router.push('/all-products')}
                  />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="ビジョン"
                    labelIcon={
                      <Image
                        src={assets.vision}
                        alt="Gallery Icon"
                        width={24}
                        height={24}
                      />
                    }
                    onClick={() => router.push('/vision')}
                  />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label={`ポイント: ${userPoints}`}
                    labelIcon={<BoxIcon />}
                    onClick={() => router.push('/user-point')}
                  />
                </UserButton.MenuItems>
                {isSeller && (
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="管理者ダッシュボード"
                      labelIcon={
                        <Image
                          src={assets.admindashboard}
                          alt="管理者ダッシュボード"
                          width={24}
                          height={24}
                        />
                      }
                      onClick={() => router.push('/seller')}
                    />
                  </UserButton.MenuItems>
                )}
              </UserButton>
            ) : user ? (
              <div className="flex flex-col gap-2">
                <FallbackUserButton
                  onClick={() => router.push('/user-point')}
                />
                <div className="text-center">
                  <div className="text-xs">ポイント: {userPoints}</div>
                  <div className="flex gap-2 text-xs mt-1">
                    <button
                      onClick={() => router.push('/')}
                      className="hover:text-blue-600"
                    >
                      ホーム
                    </button>
                    <button
                      onClick={() => router.push('/all-products')}
                      className="hover:text-blue-600"
                    >
                      全製品
                    </button>
                    <button
                      onClick={() => router.push('/vision')}
                      className="hover:text-blue-600"
                    >
                      ビジョン
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={openSignIn}
                className="flex items-center gap-2 hover:text-gray-900 transition whitespace-nowrap"
              >
                <Image src={assets.user_icon} alt="user icon" />
                アカウント
              </button>
            )}
          </div>
        </div>
      </nav>
      {showInfoPopup && (
        <div className="fixed left-1/2 top-[4rem] -translate-x-1/2 bg-white px-7 py-5 rounded-xl shadow-lg z-[100] min-w-[340px] max-w-sm border border-amber-300 flex items-center justify-center">
          <p className="text-base text-gray-800 text-center font-medium leading-relaxed pr-10">
            ユーザー名には英数字と{' '}
            <span className="font-bold text-amber-700">_</span>
            のみを含めることができるのが標準規格です。スペースなしです。
          </p>
          <button
            onClick={handleClosePopup}
            className="absolute top-2 right-2 text-gray-400 hover:text-amber-600 text-2xl font-bold rounded-full w-8 h-8 flex items-center justify-center transition-all bg-gray-100 hover:bg-amber-100"
            aria-label="Close"
            tabIndex={0}
            style={{ lineHeight: 1 }}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
