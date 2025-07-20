'use client';
import React, { useState } from 'react';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ja from 'date-fns/locale/ja';

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Earphone');
  const [imgdescription, setImgDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imgname, setImgname] = useState('');
  const [commentFinalDate, setCommentFinalDate] = useState(null); // Ensure it's initialized as null
  const [point, setPoint] = useState(0);
  const [hintShape, setHintShape] = useState('');
  const [hint, setHint] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('imgdescription', imgdescription);
    formData.append('location', location);
    formData.append('imgname', imgname); // Append imgname
    formData.append('commentFinalDate', commentFinalDate); // Append commentFinalDate
    formData.append('point', point); // Append point
    formData.append('hintShape', hintShape);
    formData.append('hint', hint);
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    if (
      !name ||
      !description ||
      !category ||
      !imgdescription ||
      !location ||
      !imgname || // Validate imgname
      !commentFinalDate || // Validate commentFinalDate
      !point || // Validate point
      !hintShape ||
      !hint ||
      files.length === 0
    ) {
      return toast.error('Please fill all required fields');
    }

    try {
      const token = await getToken();
      const { data } = await axios.post('/api/product/add', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setFiles([]);
        setName('');
        setDescription('');
        setCategory('アート');
        setImgDescription('');
        setLocation('');
        setImgname('');
        setCommentFinalDate(null);
        setPoint(0);
        setHintShape('');
        setHint('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">添付ファイル</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input
                  onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }}
                  type="file"
                  id={`image${index}`}
                  hidden
                />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={
                    files[index]
                      ? URL.createObjectURL(files[index])
                      : assets.upload_area
                  }
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            作家名
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="ここにタイプする"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            作品タイトル​
          </label>
          <input
            id="img-name"
            type="text"
            placeholder="ここにタイプする"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setImgname(e.target.value)}
            value={imgname}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="hint-name">
            ヒント
          </label>
          <input
            id="img-name"
            type="text"
            placeholder="ここにタイプする"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setHint(e.target.value)}
            value={hint}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="hint-shape">
            表示されるタイトル
          </label>
          <input
            id="hint-shape"
            type="text"
            placeholder="ここにタイプする"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setHintShape(e.target.value)}
            value={hintShape}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="points">
            正解ポイントの設定
          </label>
          <input
            id="img-points"
            type="number"
            placeholder="ここにタイプする"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setPoint(e.target.value)}
            value={point}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            作家紹介
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="ここにタイプする"
            onChange={(e) => {
              if (e.target.value.length <= 400) setDescription(e.target.value);
            }}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            作品紹介
          </label>
          <textarea
            id="img-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="ここにタイプする"
            onChange={(e) => {
              if (e.target.value.length <= 400)
                setImgDescription(e.target.value);
            }}
            value={imgdescription}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          {/* <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              カテゴリー
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="水墨画 (Suibokuga)">水墨画 (Suibokuga)</option>
              <option value="浮世絵 (Ukiyo-e)">浮世絵 (Ukiyo-e)</option>
              <option value="日本画 (Nihonga)">日本画 (Nihonga)</option>
              <option value="屏風絵 (Byōbu-e)">屏風絵 (Byōbu-e)</option>
              <option value="掛け軸絵 (Kakejiku-e)">
                掛け軸絵 (Kakejiku-e)
              </option>
              <option value="琳派 (Rimpa)">琳派 (Rimpa)</option>
              <option value="大和絵 (Yamato-e)">大和絵 (Yamato-e)</option>
              <option value="狩野派 (Kanō-ha)">狩野派 (Kanō-ha)</option>
              <option value="南画 (Nanga)">南画 (Nanga)</option>
            </select>
          </div> */}
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="location">
              掲示場所​
            </label>
            <input
              id="location"
              type="text"
              placeholder="場所"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="commentfinaldate">
              回答締め切り​
            </label>
            <DatePicker
              id="commentfinaldate"
              selected={commentFinalDate}
              onChange={(date) => setCommentFinalDate(date || null)} // Ensure null is set if no date is selected
              dateFormat="yyyy/MM/dd"
              locale={ja}
              placeholderText="回答締め切り"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 w-full"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded"
        >
          追加
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
