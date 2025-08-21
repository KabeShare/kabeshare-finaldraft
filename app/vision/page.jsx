import React from 'react';
import Navbar from '@/components/Navbar'; // Adjust the path as needed
import Footer from '@/components/Footer'; // Adjust the path as needed

export const metadata = {
  title: 'Vision - Kabe Gallery | 壁を育てろ、壁で育てろ',
  description:
    '「壁から、個性と創造性が花開く社会を。」芸術と日常が自然に交わることで、人々が自分らしさに気づき、育てていける社会を目指します。',
  robots: {
    index: true,
    follow: true,
  },
};

const Vision = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-6">ビジョン </h1>
        {/* New Section */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6 max-w-3xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">KABE SHARE</h2>
          <p className="text-lg text-gray-700 text-center mb-4">
            〜壁を育てろ、壁で育てろ〜
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Vision</h3>
          <p className="text-lg text-gray-700 mb-4">
            「壁から、個性と創造性が花開く社会を。」
            <br />
            ～芸術と日常が自然に交わることで、人々が自分らしさに気づき、育てていける社会を目指す～
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Mission（ミッション）
          </h3>
          <p className="text-lg text-gray-700 mb-4">
            「壁を通じて、若き芸術家と空間、そして社会をつなげる。」
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Value</h3>
          <p className="text-lg text-gray-700">
            「sharingでcirculate(循環)させる」 <br />
            ～使われていない壁と、まだ世に出ていない作品をつなぎ、飾る・見る・買うという体験を通じて、創造と支援が循環する仕組みを築きます～
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Vision;
