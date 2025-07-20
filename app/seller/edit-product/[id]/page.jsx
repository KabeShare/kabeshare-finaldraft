'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { assets } from '@/assets/assets';

function EditProduct() {
  const { id } = useParams();
  const { getToken, products } = useAppContext();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([null, null, null, null]);
  const [previewUrls, setPreviewUrls] = useState([null, null, null, null]);

  useEffect(() => {
    // Prefill form with product data
    const product = products.find((p) => p._id === id);
    if (product) {
      setForm({ ...product });
      // Set previews for already uploaded images
      let previews = [null, null, null, null];
      if (product.image && Array.isArray(product.image)) {
        previews = product.image.slice(0, 4);
      }
      setPreviewUrls(previews);
      setLoading(false);
    }
  }, [id, products]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, idx) => {
    const file = e.target.files[0];
    const updatedFiles = [...selectedFiles];
    updatedFiles[idx] = file;
    setSelectedFiles(updatedFiles);

    // Preview
    const updatedPreviews = [...previewUrls];
    if (file) {
      updatedPreviews[idx] = URL.createObjectURL(file);
    } else if (form.image && form.image[idx]) {
      updatedPreviews[idx] = form.image[idx];
    } else {
      updatedPreviews[idx] = null;
    }
    setPreviewUrls(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const formData = new FormData();

      // Append all text fields
      [
        'name',
        'imgname',
        'description',
        'location',
        'category',
        'imgdescription',
        'commentFinalDate',
        'point',
        'hintShape',
        'hint',
      ].forEach((field) => {
        if (form[field]) formData.append(field, form[field]);
      });

      // Append new images if selected, else keep old ones
      let hasNewImage = false;
      selectedFiles.forEach((file, idx) => {
        if (file) {
          formData.append('images', file);
          hasNewImage = true;
        }
      });

      // If no new images, send the old image URLs
      if (!hasNewImage && form.image && Array.isArray(form.image)) {
        form.image.forEach((imgUrl) => {
          formData.append('existingImages', imgUrl);
        });
      }

      const { data } = await axios.patch(`/api/product/edit/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data.success) {
        toast.success('Product updated!');
        router.push('/seller/product-list');
      } else {
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading || !form)
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-orange-700 text-center">
          製品を編集
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          encType="multipart/form-data"
        >
          <div>
            <p className="text-base font-medium mb-2">添付ファイル</p>
            <div className="flex flex-wrap items-center gap-3">
              {[0, 1, 2, 3].map((idx) => (
                <label key={idx} htmlFor={`image${idx}`}>
                  <input
                    type="file"
                    id={`image${idx}`}
                    accept="image/*"
                    hidden
                    onChange={(e) => handleFileChange(e, idx)}
                  />
                  <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center cursor-pointer border border-gray-200 overflow-hidden">
                    {previewUrls[idx] ? (
                      <Image
                        src={previewUrls[idx]}
                        alt={`preview-${idx}`}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Image
                        src={assets.upload_area}
                        alt="upload"
                        width={60}
                        height={60}
                        className="opacity-60"
                      />
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="name"
            >
              作家名
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="作家名"
              required
            />
          </div>
          {/* <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="category"
            >
              カテゴリー
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            >
              <option value="アート">アート</option>
              <option value="写真">写真</option>
              <option value="イラスト">イラスト</option>
              <option value="その他">その他</option>
            </select>
          </div> */}
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="imgname"
            >
              作品タイトル
            </label>
            <input
              id="imgname"
              name="imgname"
              value={form.imgname}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="作品タイトル"
              required
            />
          </div>
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="imgdescription"
            >
              作品説明
            </label>
            <textarea
              id="imgdescription"
              name="imgdescription"
              value={form.imgdescription}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="作品説明"
              required
              rows={3}
            />
          </div>
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="description"
            >
              作家紹介
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="作家紹介"
              required
              rows={4}
            />
          </div>
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="commentFinalDate"
            >
              コメント期限
            </label>
            <input
              type="date"
              id="commentFinalDate"
              name="commentFinalDate"
              value={
                form.commentFinalDate ? form.commentFinalDate.split('T')[0] : ''
              }
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
          </div>
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="location"
            >
              掲示場所
            </label>
            <input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="掲示場所"
              required
            />
          </div>
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="point"
            >
              ポイント
            </label>
            <input
              type="number"
              id="point"
              name="point"
              value={form.point}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="0"
              required
            />
          </div>
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="hintShape"
            >
              ヒントの形
            </label>
            <input
              id="hintShape"
              name="hintShape"
              value={form.hintShape}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="ヒントの形"
              required
            />
          </div>
          <div>
            <label
              className="block mb-1 font-medium text-gray-700"
              htmlFor="hint"
            >
              ヒント
            </label>
            <input
              id="hint"
              name="hint"
              value={form.hint}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="ヒント"
              required
            />
          </div>
          {/* Add more fields as needed */}
          <button
            type="submit"
            className="w-full px-6 py-2 bg-orange-600 hover:bg-orange-700 transition text-white rounded font-semibold shadow focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            保存
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
