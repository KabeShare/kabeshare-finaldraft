import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const timeframeOptions = [
  { label: '1ヶ月', value: '1' },
  { label: '3ヶ月', value: '3' },
  { label: '6ヶ月', value: '6' },
  { label: '12ヶ月', value: '12' },
];

const ArtistRanking = () => {
  const [artistPoints, setArtistPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('12'); // Default to 12 months
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const fetchArtistPoints = async (selectedTimeframe) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/artists/points?timeframe=${selectedTimeframe}`);
      if (data.success) {
        const sortedData = data.artistPoints.sort((a, b) => b.points - a.points);
        setArtistPoints(sortedData);
      }
    } catch (error) {
      console.error('Failed to fetch artist points:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistPoints(timeframe);
  }, [timeframe]);

  const handleTimeframeChange = (value) => {
    setTimeframe(value);
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        ローディング...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-black-800 mx-auto">
          人気アーティストランキング
        </h2>
        
        {/* Timeframe Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white border border-gray-300 rounded-md px-4 py-2 inline-flex items-center justify-between w-32 focus:outline-none"
          >
            <span>
              {timeframeOptions.find((opt) => opt.value === timeframe)?.label}
            </span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
              {timeframeOptions.map((option) => (
                <button
                  key={option.value}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleTimeframeChange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={artistPoints}
            layout="vertical"
            margin={{ top: 40, right: 20, left: 20, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 10000]} />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              interval={0}
              fontSize={17}
              tickMargin={10}
            />
            <Tooltip
              formatter={(value) => [`${value}ポイント`, 'ポイント']}
              labelFormatter={(label) => `作家名: ${label}`}
            />
            <Bar
              dataKey="points"
              fill="#FFA500"
              animationDuration={1000}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ArtistRanking;
