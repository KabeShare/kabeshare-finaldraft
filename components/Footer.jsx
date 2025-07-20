"use client";

import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-between px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-full md:w-1/3">
          <Image
            className="w-16 md:w-20 mb-4"
            src={assets.kabe_share_logo}
            alt="logo"
          />
          <p className="text-sm leading-relaxed">
            アートは空間を刺激的なものにします。
            <br /> 刺激は、創造性を育みます。
            <br /> 創造性は、個性を作ります。
            <br /> 個性は、自分らしい人生を作ります。
            <br /> 自分らしさだけが、自分の人生の真ん中を
            発見することにつながります。
          </p>
        </div>

        <div className="w-full md:w-1/3">
          <h2 className="font-medium text-gray-900 mb-6">会社概要</h2>
          <div className="text-sm space-y-2">
            <p>会社名：シェアエコ株式会社</p>
            <p>連絡先：sharekabe@gmail.com</p>
          </div>
        </div>

        <div className="w-full md:w-1/3 relative">
          <button
            onClick={scrollToTop}
            className="absolute right-0 top-0 p-3 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 transition"
            aria-label="Back to Top"
          >
            ↑
          </button>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © Kabe Share All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
