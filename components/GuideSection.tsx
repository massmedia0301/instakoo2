import React from 'react';

const GuideSection: React.FC = () => {
  const guides = [
    {
      title: "유튜브 링크 복사",
      iconClass: "fa-brands fa-youtube",
      color: "text-red-500",
      steps: ["영상 하단의 '공유' 버튼 클릭", "'링크 복사' 선택", "주문서에 붙여넣기"]
    },
    {
      title: "인스타그램 링크",
      iconClass: "fa-brands fa-instagram",
      color: "text-pink-500",
      steps: ["게시물 우측 상단 메뉴(...) 클릭", "'링크 복사' 아이콘 선택", "URL 붙여넣기"]
    },
    {
      title: "네이버 플레이스 링크",
      iconClass: "fa-solid fa-map-location-dot",
      color: "text-green-500",
      steps: ["네이버 지도에서 내 가게 검색", "'공유' 아이콘 클릭", "URL 복사 후 붙여넣기"]
    },
    {
      title: "당근마켓 게시글 링크",
      iconClass: "fa-solid fa-carrot",
      color: "text-orange-500",
      steps: ["게시글 우측 상단 메뉴(⋮) 클릭", "'게시글 공유하기' 선택", "'링크 복사' 클릭"]
    }
  ];

  return (
    <section id="guide" className="max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">서비스 이용 가이드</h2>
        <p className="text-gray-500">링크 복사 방법을 모르시나요? 아래 내용을 참고하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {guides.map((guide, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100 group">
            <div className={`w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform ${guide.color}`}>
              <i className={guide.iconClass}></i>
            </div>
            <h3 className="text-xl font-bold text-center mb-6 text-gray-800">{guide.title}</h3>
            <ul className="space-y-4">
              {guide.steps.map((step, stepIdx) => (
                <li key={stepIdx} className="flex items-start gap-3 text-gray-600 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primaryBg text-primary font-bold flex items-center justify-center text-xs">
                    {stepIdx + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuideSection;