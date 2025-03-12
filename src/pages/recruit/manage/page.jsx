import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "@/hooks/useRedux";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import { Link } from "react-router-dom";
import AddIcon from "@/components/icons/Plus";
import ArrowRightIcon from "@/components/icons/ArrowRight";

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().substr(-2); // 년도 뒤의 2자리만
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

// 시간 포맷팅 함수
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

function ReCruitManage({ post }) {
  const spanStyle = {
    text: "font-bold text-main-color",
  };

  // 주소 정보를 문자열로 변환
  const addressString = post.address
    ? `${post.address.street} ${post.address.detail || ""}`
    : "주소 정보 없음";

  // 지원자 수 계산
  const applicantCount = post.applies ? post.applies.length : 0;

  // 날짜 범위 포맷팅
  const periodString = post.period
    ? `${formatDate(post.period.start)}~${formatDate(post.period.end)}`
    : "기간 정보 없음";

  // 시간 범위 포맷팅
  const timeString = post.hour
    ? `${formatTime(post.hour.start)}~${formatTime(post.hour.end)}`
    : "시간 정보 없음";

  // 마감일 포맷팅
  const deadlineString = post.deadline
    ? formatDate(post.deadline.date)
    : "마감일 정보 없음";

  return (
    <Link to={`/notice/${post._id}`} className="block">
      <div className="bg-white h-[160px] rounded-[10px] flex-col p-3">
        <div className="flex justify-between">
          <p className="font-bold text-[12px] mb-2">{post.title}</p>
          <ArrowRightIcon />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-0.5 text-main-darkGray text-[10px]">
            <p className="text-[12px] font-bold text-black">근무조건</p>
            <p>
              <span className={spanStyle.text}>{post.pay.type}</span>{" "}
              {post.pay.value.toLocaleString()}
            </p>
            <p>
              <span className={spanStyle.text}>기간</span> {periodString}
            </p>
            <p>
              <span className={spanStyle.text}>시간</span> {timeString}
            </p>
          </div>
          <div className="flex flex-col gap-0.5 text-[10px] text-main-darkGray">
            <p className="text-[12px] font-bold text-black">모집조건</p>
            <p>
              <span className={spanStyle.text}>마감</span> {deadlineString}
            </p>
            <p>
              <span className={spanStyle.text}>인원</span> {post.person}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-[10px] text-main-color">
            <div className="bg-selected-box rounded-[10px] text-center p-1">
              모집중
            </div>
            <div className="bg-selected-box rounded-[10px] text-center p-1">
              {applicantCount}명 지원
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 text-[10px] mt-2 text-main-darkGray">
          <p className="text-[12px] font-bold text-black">근무지역</p>
          <p>{addressString}</p>
        </div>
      </div>
    </Link>
  );
}

function ReCruitManagePage() {
  const navigate = useNavigate();
  // Redux에서 로그인한 사용자 정보 가져오기
  const user = useAppSelector((state) => state.auth.user);
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자가 등록한 공고 목록 불러오기
  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user || !user._id) {
        setError("로그인이 필요한 서비스입니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `/api/post/recruit/manage/${user._id}`
        );

        setMyPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        console.error("공고 목록 불러오기 실패:", err);
        setError("공고 목록을 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [user]);

  return (
    <>
      <Header>
        <div className="flex items-center h-full ml-2">
          <div onClick={() => navigate(-1)}>
            <ArrowLeftIcon />
          </div>
          <span className="font-bold flex justify-center w-full mr-3">
            고용 현황
          </span>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <div className="size-full bg-white">
          <div className="p-4 space-y-4 rounded-t-[30px] bg-main-bg pb-28">
            {/* 상단 제목 */}
            <h2 className="text-[18px] font-bold">나의 공고 관리</h2>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>공고 목록을 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {/* 새 공고 등록 버튼 */}
                <Link to="/notice/add">
                  <div className="bg-white h-[160px] rounded-[10px] flex justify-center items-center">
                    <div className="bg-selected-box rounded-[10px] flex-1 m-4 h-[80%] border-2 border-main-color border-dashed cursor-pointer">
                      <div className="flex flex-col justify-center h-full items-center">
                        <AddIcon />
                        <p className="text-main-color text-[12px]">
                          새 공고 등록하기
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* 공고 목록 */}
                {myPosts.length > 0 ? (
                  myPosts.map((post) => (
                    <ReCruitManage key={post._id} post={post} />
                  ))
                ) : (
                  <div className="bg-white h-[160px] rounded-[10px] flex justify-center items-center">
                    <p className="text-main-darkGray">
                      등록한 공고가 없습니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Main>
      <BottomNav></BottomNav>
    </>
  );
}

export default ReCruitManagePage;
