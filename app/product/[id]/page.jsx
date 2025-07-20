'use client';
import { useEffect, useState } from 'react';
import { assets } from '@/assets/assets';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Loading from '@/components/Loading';
import { useAppContext } from '@/context/AppContext';
import React from 'react';
import axios from 'axios';
import { useClerk } from '@clerk/nextjs';
import toast from 'react-hot-toast';

// Separate CommentSection into its own component
const CommentSection = React.memo(
  ({ productId, user, clerkUser, productData }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [pointsAwarded, setPointsAwarded] = useState(false); // Track if points have been awarded
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appreciationPoints, setAppreciationPoints] = useState(1);
    const [userPoints, setUserPoints] = useState(0);

    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `/api/comments/get?productId=${productId}`
        );
        if (data.success) {
          setComments(data.comments);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const fetchUserPoints = async () => {
      if (!user) return;
      try {
        const res = await axios.get('/api/user/data');
        console.log('Fetching user points...'); // Debug log

        if (res.data.success && typeof res.data.user.points === 'number') {
          console.log('Updated points:', res.data.user.points); // Debug log
          setUserPoints(Number(res.data.user.points));
        } else {
          console.error('Invalid points data:', res.data);
        }
      } catch (error) {
        console.error('Error fetching user points:', error);
      }
    };

    const handleAddComment = async () => {
      if (!user) {
        return toast('コメントするにはログインしてください', { icon: '⚠️' });
      }
      if (!newComment.trim()) return;

      if (newComment.length > productData.imgname.length) {
        return toast.error(
          `コメントは${productData.imgname.length}文字以内で入力してください`
        );
      }

      try {
        const { data } = await axios.post('/api/comments/add', {
          productId,
          text: newComment,
          userName: clerkUser.fullName,
          userImage: clerkUser.imageUrl,
        });

        if (data.success) {
          setComments([data.comment, ...comments]);
          setNewComment('');

          // Check if the comment matches the product's imgname
          if (
            newComment.trim().toLowerCase() ===
            productData.imgname.trim().toLowerCase()
          ) {
            const response = await axios.post('/api/users/award-points', {
              userId: user.id,
              points: productData.point,
              productId: productId, // Include productId
            });

            if (response.data.success) {
              toast.success(
                `おめでとうございます！${productData.point}ポイントを獲得しました！`,
                { duration: 3000 }
              );
            } else {
              toast.error(response.data.message); // Show error if points were already awarded
            }
          } else {
            toast.success('コメントが追加された！');
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const handleReaction = async (commentId, reaction) => {
      if (!user) {
        return toast('反応するにはログインしてください', { icon: '⚠️' });
      }

      try {
        const { data } = await axios.post('/api/comments/react', {
          commentId,
          reaction,
        });

        if (data.success) {
          setComments(
            comments.map((c) => (c._id === commentId ? data.comment : c))
          );
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const handleDeleteComment = async (commentId) => {
      if (!user) return;

      try {
        const { data } = await axios.delete(
          `/api/comments/delete?commentId=${commentId}`
        );

        if (data.success) {
          setComments(comments.filter((c) => c._id !== commentId));
          toast.success('コメント削除');
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    const handleAppreciate = async () => {
      if (!user) {
        return toast('ログインしてください', { icon: '⚠️' });
      }

      // Fetch latest points before proceeding
      await fetchUserPoints();

      if (Number(appreciationPoints) > Number(userPoints)) {
        console.log('Points comparison:', {
          appreciation: Number(appreciationPoints),
          user: Number(userPoints),
        });
        return toast.error('ポイントが足りません');
      }

      try {
        const response = await axios.post('/api/users/transfer-points', {
          fromUserId: user.id,
          toUserId: productData.userId,
          points: Number(appreciationPoints),
          productId: productId,
        });

        if (response.data.success) {
          toast.success(`${appreciationPoints}ポイントを送りました！`);
          setIsModalOpen(false);
          // Fetch updated points immediately after successful transfer
          await fetchUserPoints();
        }
      } catch (error) {
        console.error('Point transfer error:', error.response?.data || error);
        toast.error(error.response?.data?.message || error.message);
      }
    };

    useEffect(() => {
      fetchComments();
      fetchUserPoints();
    }, [productId, user]); // Add user as dependency

    return (
      <div className="mt-8 mb-10 px-2 sm:px-6 lg:px-16">
        {/* Add Hint Section above comments - Mobile only */}
        <div className="md:hidden mb-6 text-center">
          <p className="text-sm font-bold text-green-800">
            {productData.hintShape}
          </p>
          <p className="text-sm font-bold text-green-800 mt-1">
            {productData.hint}
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base sm:text-lg font-bold text-green-800 text-left">
            「作品名を当てる」
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            作品を評価 ({userPoints}P)
          </button>
        </div>

        {/* Appreciation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 relative">
              <h2 className="text-xl font-bold mb-4">作品を評価する</h2>
              <p className="mb-4">あなたの持ちポイント: {userPoints}P</p>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  ポイントを入力してください:
                </label>
                <input
                  type="number"
                  min="1"
                  max={userPoints}
                  value={appreciationPoints}
                  onChange={(e) =>
                    setAppreciationPoints(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleAppreciate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  送る
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Comment Input Section */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 items-start">
          <div className="flex-1 w-full">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="作品のタイトルを予想して投稿してください"
              maxLength={productData.imgname.length}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500 text-sm sm:text-base"
            />
          </div>
          <div className="flex justify-start w-full sm:w-auto">
            <button
              onClick={handleAddComment}
              className="px-4 sm:px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm sm:text-base mt-3 sm:mt-0"
            >
              ポスト
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border rounded-lg p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Image
                    src={comment.userImage}
                    alt={comment.userName}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-medium text-xs sm:text-base">
                      {comment.userName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(comment.date).toLocaleTimeString()} |{' '}
                      {new Date(comment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {clerkUser?.fullName === comment.userName && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 hover:text-red-600 text-xs sm:text-sm mt-2 sm:mt-0"
                  >
                    削除
                  </button>
                )}
              </div>
              <p className="text-xs sm:text-base text-gray-700 mb-2 sm:mb-3 break-words text-left">
                {comment.text}
              </p>
              <div className="flex gap-3 sm:gap-4">
                {['❤️', '😂', '👌'].map((reaction) => (
                  <button
                    key={reaction}
                    onClick={() => handleReaction(comment._id, reaction)}
                    className={`flex items-center gap-1 text-xs sm:text-sm ${
                      comment.reactions[reaction]?.includes(user?._id)
                        ? 'text-orange-500'
                        : 'text-gray-500'
                    }`}
                  >
                    <span>{reaction}</span>
                    <span>{comment.reactions[reaction]?.length || 0}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart, user, isSeller } = useAppContext(); // Add isSeller
  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const { user: clerkUser } = useClerk();
  const [canComment, setCanComment] = useState(true);

  const fetchProductData = async () => {
    const product = products.find((product) => product._id === id);
    setProductData(product);
  };

  useEffect(() => {
    fetchProductData();
  }, [id, products.length]);

  useEffect(() => {
    if (productData) {
      const currentDate = new Date();
      const finalDate = new Date(productData.commentFinalDate);
      setCanComment(currentDate <= finalDate);
    }
  }, [productData]);

  return productData ? (
    <>
      <Navbar />
      <h1 className="text-lg sm:text-2xl font-bold text-green-800/90 mb-3 sm:mb-4 ml-0 sm:ml-[200px] mt-4 sm:mt-[20px] text-center sm:text-left">
        この作品のタイトルは何でしょう？
      </h1>
      <div className="px-2 sm:px-6 md:px-16 lg:px-32 pt-5 sm:pt-7 space-y-8 sm:space-y-10">
        {/* Add edit button for sellers */}
        {isSeller && (
          <div className="flex justify-end px-4">
            <button
              onClick={() => router.push(`/seller/edit-product/${id}`)}
              className="px-4 py-2 text-blue-600 rounded-lg border border-blue-200 
              bg-blue-50 hover:bg-blue-100 transition flex items-center gap-2 
              shadow-sm hover:shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              作品を編集
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16">
          <div className="px-0 sm:px-5 lg:px-16 xl:px-20">
            {/* Hint Section - Desktop top */}
            <div className="hidden md:block mb-6 text-center">
              <p className="text-sm sm:text-base font-bold text-green-800">
                {productData.hintShape}
              </p>
              <p className="text-sm sm:text-base font-bold text-green-800 mt-1">
                {productData.hint}
              </p>
            </div>
            {/* Mobile Hint Section */}
            <div className="md:hidden mb-4 text-center">
              <p className="text-sm font-bold text-green-800">
                {productData.hintShape}
              </p>
              <p className="text-sm font-bold text-green-800 mt-1">
                {productData.hint}
              </p>
            </div>
            <div
              className={`relative rounded-lg overflow-hidden bg-gray-500/10 mb-3 sm:mb-4 ${
                !user ? 'filter blur-md' : ''
              }`}
              style={{ marginTop: '10px' }}
            >
              <Image
                src={mainImage || productData.image[0]}
                alt="alt"
                className="w-full h-auto object-cover mix-blend-multiply"
                width={1280}
                height={720}
                priority
              />
              {!user && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span
                    className="bg-black bg-opacity-60 text-white px-6 py-3 rounded-lg text-lg font-semibold filter-none"
                    style={{ filter: 'none' }}
                  ></span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4">
              {productData.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`cursor-pointer rounded-xl overflow-hidden bg-white border border-gray-200 shadow-lg transition-all hover:shadow-2xl relative`}
                  style={{
                    aspectRatio: '1 / 1',
                    width: '100%',
                    maxWidth: 140,
                    margin: '0 auto',
                  }}
                >
                  <div className={`${!user ? 'filter blur-md' : ''}`}>
                    <Image
                      src={image}
                      alt="alt"
                      width={140}
                      height={140}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {!user && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span
                        className="bg-black bg-opacity-60 text-white px-3 py-1 rounded text-xs font-semibold"
                        style={{ filter: 'none' }}
                      >
                        ログインして画像を見る
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Hint Section - Desktop bottom */}
            <div className="hidden md:block mt-6 text-center">
              <p className="text-sm sm:text-base font-bold text-green-800">
                {productData.hintShape}
              </p>
              <p className="text-sm sm:text-base font-bold text-green-800 mt-1">
                {productData.hint}
              </p>
            </div>
          </div>

          <div className="flex flex-col space-y-4 sm:space-y-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-2 md:gap-4 items-start">
              <span className="font-bold text-green-800/90 text-sm sm:text-base">
                作家名 :
              </span>
              <span className="text-green-800/90 text-sm sm:text-base">
                {productData.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-2 md:gap-4 items-start">
              <span className="font-bold text-green-800/90 text-sm sm:text-base">
                作家紹介 :
              </span>
              <span className="text-green-800/90 whitespace-pre-wrap text-sm sm:text-base">
                {productData.description}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-2 md:gap-4 items-start">
              <span className="font-bold text-green-800/90 text-sm sm:text-base">
                所在地 :
              </span>
              <span className="text-green-800/90 text-sm sm:text-base">
                {productData.location}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-2 md:gap-4 items-start">
              <span className="font-bold text-green-800/90 text-sm sm:text-base">
                画像の説明 :
              </span>
              <span className="text-green-800/90 whitespace-pre-wrap text-sm sm:text-base">
                {productData.imgdescription}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-2 md:gap-4 items-start">
              <span className="font-bold text-green-800/90 text-sm sm:text-base">
                最終日 :
              </span>
              <span className="text-green-800/90 text-sm sm:text-base">
                {new Date(productData.commentFinalDate).toLocaleDateString(
                  'ja-JP',
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }
                )}
              </span>
            </div>
          </div>
        </div>
        {canComment ? (
          <CommentSection
            key={id}
            productId={id}
            user={user}
            clerkUser={clerkUser}
            productData={productData}
          />
        ) : (
          <h1 className="text-green-800/90 font-bold text-left text-base sm:text-lg mt-6">
            この画像に関する推測期間は終了しました。ご参加ありがとうございました。
          </h1>
        )}
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default Product;
