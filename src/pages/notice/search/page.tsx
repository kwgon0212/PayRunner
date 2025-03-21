import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import SearchIcon from "@/components/icons/Search";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
import "@/css/datePicker.css";
import locations from "./locations";
import { jopOptions, payOptions } from "../options";
import HeaderBack from "@/components/HeaderBack";
import CalendarIcon from "@/components/icons/Calendar";

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
  bottom: 90px; /* BottomNav 높이(60px) + 여백(30px) */
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  height: 50px;
  border-radius: 10px;
  font-size: 14px;
  background: #0b798b;
  color: white;
  z-index: 100; /* 다른 요소 위에 표시 */
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

const SubTitle = styled.label`
  font-weight: 600;
  font-size: 16px;
  margin-bottom: -10px;
`;

// 폼의 하단에 여백을 주기 위한 스타일 컴포넌트
const FormContainer = styled.form`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 160px; /* 버튼 + BottomNav 높이 + 여백 */
`;

const bgCalender = (
  <div style={{ padding: "10px 0 10px 15px" }}>
    <CalendarIcon color="#d9d9d9" />
  </div>
);

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
    긴급: false,
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

  return (
    <>
      <HeaderBack title="공고 검색" />
      <Main hasBottomNav={true}>
        <div>
          {/* Main 컴포넌트의 자식을 하나의 div로 감싸기 */}
          <FormContainer
            className="divide-[#0b798b]"
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
                {jopOptions.map((value, index) => (
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
                {payOptions.map((value, index) => (
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
                icon={bgCalender}
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
                icon={bgCalender}
                showIcon
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
          </FormContainer>
          {/* 고정된 버튼 */}
          <BottomButton type="submit" onClick={handleSearchSubmit}>
            검색 결과 보기
          </BottomButton>
        </div>
      </Main>
      <BottomNav />
    </>
  );
}

export default NoticeSearchPage;
