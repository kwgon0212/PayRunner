import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

// 카카오 우편번호 검색 api
import DaumPostcode from "react-daum-postcode";

import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import Main from "@/components/Main";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUserAddress } from "@/util/slices/registerUserInfoSlice";
import Modal from "@/components/Modal";
import StatusBar from "@/components/StatusBar";
import InputComponent from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";

// 우편번호 데이터 타입 정의
interface PostcodeData {
  zonecode: string; // 우편번호
  address: string; // 기본 주소
}

const Head = styled.div`
  display: flex;
  align-self: start;
  font-weight: bold;
`;

const FindBtn = styled.button`
  display: flex;
  width: 150px;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-radius: 10px;
  color: white;
`;

export function RegisterAddressPage() {
  const [postcode, setPostcode] = useState(""); // 우편번호 상태
  const [address, setAddress] = useState(""); // 주소 상태
  const [detailAddress, setDetailAddress] = useState(""); // 상세주소 상태
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 팝업 열림 상태

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // 주소 검색 버튼 클릭 시 우편번호 팝업 열기
  const handleOpenPostcodePopup = () => {
    setIsPostcodeOpen(true);
  };

  // DaumPostcode 컴포넌트에서 주소 선택 시 실행되는 함수
  const handlePostcodeComplete = (data: PostcodeData) => {
    setPostcode(data.zonecode); // 우편번호
    setAddress(data.address); // 기본 주소
    setIsPostcodeOpen(false); // 팝업 닫기
  };

  const handleClickNext = () => {
    if (!postcode || !address) return;
    dispatch(
      setUserAddress({
        zipcode: postcode,
        street: address,
        detail: detailAddress,
      })
    );
    navigate("/register/email");
  };

  return (
    <>
      <Header>
        <div className="relative flex flex-col justify-center w-full h-full">
          <div className="flex flex-row justify-between px-[20px]">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
            </button>
            <Link to="/login">
              <CancelIcon />
            </Link>
          </div>
          <StatusBar percent={25} />
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="flex flex-col gap-[20px] items-center size-full bg-white p-[20px]">
          <Head className="text-xl">주소지 등록</Head>
          <div className="w-full flex flex-col gap-[10px]">
            <div className="flex flex-row gap-[20px] w-full">
              <InputComponent
                type="text"
                placeholder="우편번호"
                value={postcode}
                readOnly
                disabled
                width="100%"
                padding="0 10px"
                className="flex-5"
              />
              <FindBtn
                type="button"
                onClick={handleOpenPostcodePopup}
                className="bg-main-color"
              >
                <span className="text-center">주소검색</span>
              </FindBtn>
            </div>
            <InputComponent
              type="text"
              placeholder="주소"
              value={address}
              readOnly
              width="100%"
              padding="0 10px"
              disabled
            />
            <InputComponent
              type="text"
              placeholder="상세주소"
              width="100%"
              padding="0 10px"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
            />
          </div>

          <div className="absolute bottom-[20px] left-0 w-full px-[20px] flex justify-center">
            <SubmitButton onClick={handleClickNext} type="button">
              다음
            </SubmitButton>
          </div>

          <Modal isOpen={isPostcodeOpen} setIsOpen={setIsPostcodeOpen}>
            {isPostcodeOpen && (
              <DaumPostcode
                onComplete={handlePostcodeComplete} // 주소 선택 시 실행되는 함수
                autoClose
              />
            )}
          </Modal>
        </div>
      </Main>
    </>
  );
}

export default RegisterAddressPage;
