import React, { useMemo } from 'react';
import { MOCK_REVIEWS } from '../constants';

const Reviews: React.FC = () => {
  // Use useMemo to prevent regeneration on re-renders, but allow regeneration on page refresh
  // Since MOCK_REVIEWS is generated at module level, it stays constant per session refresh
  const displayReviews = [...MOCK_REVIEWS, ...MOCK_REVIEWS];

  return (
    <section className="bg-gradient-to-b from-white to-primaryBg py-20 overflow-hidden">
      <div className="max-w-full">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">생생한 고객 후기</h2>
          <p className="text-gray-500">이미 많은 분들이 instakoo와 함께 성장하고 있습니다. (누적 후기 10,000+)</p>
        </div>

        {/* Infinite Scrolling Container */}
        <div className="relative w-full">
          <div className="flex animate-marquee gap-6 px-4">
            {displayReviews.map((review, index) => (
              <div 
                key={`${review.id}-${index}`} 
                className="w-[300px] flex-shrink-0 bg-white p-6 rounded-3xl shadow-sm border border-pink-50 flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{review.name}</p>
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fa-solid fa-star ${i < review.rating ? '' : 'text-gray-300'}`}></i>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                  "{review.content}"
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-primary opacity-80">{review.platform}</span>
                  <span className="text-gray-400">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;