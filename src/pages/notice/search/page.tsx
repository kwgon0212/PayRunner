import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "@/components/Header";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import SearchIcon from "@/components/icons/Search";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
import "@/css/datePicker.css";
import locations from "./locations";

interface Props {
  width?: string;
  height?: string;
  padding?: string;
  bottom?: string;
  radius?: string;
  bgSize?: string;
}

const BottomButton = styled.button<Props>`
  position: absolute;
  bottom: ${(props) => props.bottom || "60px"};
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  height: 50px;
  border-radius: 10px;
  font-size: 14px;
  background: #0b798b;
  color: white;
`;

const InsertTextInput = styled.input<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 10px;
  padding: ${(props) => props.padding || "0 20px"};

  ::placeholder {
    color: #d9d9d9;
    font-size: 14px;
  }

  &:focus {
    border: 1px solid #0b798b;
    outline: none;
  }
`;

const SelectBox = styled.select<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border: 1px solid #d9d9d9;
  border-radius: ${(props) => props.radius || "10px"};
  padding: ${(props) => props.padding || "0 20px"};
  font-size: 14px;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="%23d9d9d9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: ${(props) => props.bgSize || "20px"};
  outline: none;

  &:focus {
    border: 1px solid #0b798b;
    z-index: 1;
  }
`;

const LocationSelectBox = styled.select<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border: 1px solid #d9d9d9;
  border-radius: ${(props) => props.radius || "10px"};
  padding: ${(props) => props.padding || "0 20px"};
  font-size: 14px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2220%22%20height%3D%2220%22%20fill%3D%22none%22%3E%20%3Ccircle%20cx%3D%2212%22%20cy%3D%226%22%20r%3D%224%22%20stroke%3D%22%23717171%22%20stroke-width%3D%221.5%22%20%2F%3E%20%3Cpath%20d%3D%22M5%2016C3.7492%2016.6327%203%2017.4385%203%2018.3158C3%2020.3505%207.02944%2022%2012%2022C16.9706%2022%2021%2020.3505%2021%2018.3158C21%2017.4385%2020.2508%2016.6327%2019%2016%22%20stroke%3D%22%23717171%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%2F%3E%20%3Cpath%20d%3D%22M12%2010L12%2018%22%20stroke%3D%22%23717171%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%2F%3E%20%3C%2Fsvg%3E"),
    url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="%23d9d9d9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  background-repeat: no-repeat;
  background-position: left 15px center, right 10px center;
  background-size: ${(props) => props.bgSize || "20px"};
  outline: none;

  &:focus {
    border: 1px solid #0b798b;
    z-index: 1;
  }
`;

const Title = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  font-size: 16px;
`;

const SubTitle = styled.label`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: -10px;
`;

function NoticeSearchPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [sido, setSido] = useState<string>("전체");
  const [sigungu, setSigungu] = useState<string>("전체");
  const [jobType, setJobType] = useState<string>("직종 전체");
  const [payType, setPayType] = useState<string>("시급");
  const [pay, setPay] = useState<number>(0);
  const [hireType, setHireType] = useState<{ [key: string]: boolean }>({
    일일: false,
    단기: false,
    장기: false,
  });
  const [startDate, setStartDate] = useState<Date | null>(new Date()); // 오늘 날짜
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  ); // 1개월 뒤 날짜

  // 고용 형태 선택 핸들러
  function handleClick(e: React.MouseEvent<HTMLLIElement>) {
    const typeText = e.currentTarget.innerText;

    // 상태 업데이트
    setHireType((prevState) => ({
      ...prevState,
      [typeText]: !prevState[typeText],
    }));
  }

  // 검색 폼 제출 핸들러
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 검색 파라미터 준비
    // hireType에서 선택된 값만 배열로 변환
    const selectedHireTypes = Object.entries(hireType)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);

    // 검색 조건을 state로 전달
    navigate("/notice/list", {
      state: {
        search,
        sido,
        sigungu,
        jobType,
        payType,
        pay,
        hireType: selectedHireTypes, // 배열로 변환된 선택된 고용 형태
        period: {
          start: startDate,
          end: endDate,
        },
      },
    });
  };

  const jobTypes = [
    "직종 전체",
    "관리자",
    "전문가 및 관련 종사자",
    "사무 종사자",
    "서비스 종사자",
    "판매 종사자",
    "농림어업 숙련 종사자",
    "기능원 및 관련 기능 종사자",
    "장치ㆍ기계 조작 및 조립 종사자",
    "단순 노무 종사자",
    "군인",
  ];

  const payTypes = ["시급", "일급", "주급", "월급", "총 급여"];

  return (
    <>
      <Header>
        <div className="p-layout h-full flex flex-wrap content-center bg-main-color">
          <button
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeftIcon className="text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 font-bold text-white">
            공고 검색
          </span>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <form
          className="w-full p-layout flex flex-col gap-layout divide-[#0b798b]"
          onSubmit={handleSearchSubmit}
        >
          <div className="relative">
            <p className="left-[15px] absolute top-1/2 -translate-y-1/2">
              <SearchIcon />
            </p>
            <InsertTextInput
              type="text"
              placeholder="원하는 정보를 검색해주세요"
              padding="0 50px"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <hr />
          <SubTitle>지역 / 동네</SubTitle>
          <div className="flex w-full relative">
            <LocationSelectBox
              className="mr-[-0.5px]"
              value={sido}
              onChange={(e) => {
                setSido(e.target.value);
                setSigungu("전체"); // 시/도 변경 시 시/군/구 초기화
              }}
              width="50%"
              padding="0 0 0 45px"
              radius="10px 0 0 10px"
            >
              {Object.keys(locations).map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </LocationSelectBox>
            <SelectBox
              className="ml-[-0.5px]"
              value={sigungu}
              onChange={(e) => setSigungu(e.target.value)}
              width="50%"
              radius="0 10px 10px 0"
            >
              {locations[sido].map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </SelectBox>
          </div>
          <SubTitle>직종</SubTitle>
          <div>
            <SelectBox
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              {jobTypes.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </SelectBox>
          </div>
          <SubTitle>급여</SubTitle>
          <div className="flex w-full relative">
            <SelectBox
              id="dropdown"
              value={payType}
              onChange={(e) => setPayType(e.target.value)}
              className="mr-[10px]"
              width="30%"
            >
              {payTypes.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </SelectBox>
            <span className="w-[70%] relative">
              <InsertTextInput
                type="text"
                padding="0 69px 0 20px"
                value={pay === 0 ? "" : pay.toLocaleString()}
                onChange={(e) =>
                  setPay(Number(e.target.value.replace(/[^\d]/g, "")))
                }
                onFocus={(e) => {
                  e.target.value = pay === 0 ? "" : pay.toString();
                }}
                onBlur={(e) =>
                  (e.target.value = pay ? pay.toLocaleString() : "")
                }
              />
              <span className="absolute right-[15px] text-main-darkGray top-1/2 -translate-y-1/2">
                원 이상
              </span>
            </span>
          </div>
          <SubTitle>고용 형태</SubTitle>
          <ul className="flex w-full gap-x-[5px] h-10 list-none relative">
            {Object.entries(hireType).map(([value, isActive], index) => (
              <li
                key={index}
                className={`w-1/3 text-sm flex justify-center items-center border rounded-[10px] cursor-pointer ${
                  isActive
                    ? "border-main-color bg-main-color text-white"
                    : "border-main-gray bg-white text-main-darkGray"
                }`}
                onClick={handleClick}
              >
                {value}
              </li>
            ))}
          </ul>
          <SubTitle>근무 기간</SubTitle>
          <div className="w-full h-10 flex relative datepicker-css">
            <DatePicker
              locale={ko}
              showIcon
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20px"
                  height="20px"
                  color="#d9d9d9"
                  fill="none"
                  style={{
                    padding: "10px 0 10px 15px",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <path
                    d="M18 2V4M6 2V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M3 8H21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              toggleCalendarOnIconClick
              dateFormat="yyyy-MM-dd"
              startDate={startDate}
              endDate={endDate}
              popperPlacement="bottom-start"
              fixedHeight
              selectsStart
              className="left-wrapper"
              minDate={new Date()}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <DatePicker
              locale={ko}
              showIcon
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20px"
                  height="20px"
                  color="#d9d9d9"
                  fill="none"
                  style={{
                    padding: "10px 0 10px 15px",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <path
                    d="M18 2V4M6 2V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M3 8H21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              toggleCalendarOnIconClick
              dateFormat="yyyy-MM-dd"
              startDate={startDate}
              endDate={endDate}
              popperPlacement="bottom-start"
              fixedHeight
              selectsEnd
              className="right-wrapper"
              minDate={startDate ?? undefined}
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>
          <BottomButton bottom="31px" type="submit">
            검색 결과 보기
          </BottomButton>
        </form>
      </Main>
      <BottomNav />
    </>
  );
}

export default NoticeSearchPage;
