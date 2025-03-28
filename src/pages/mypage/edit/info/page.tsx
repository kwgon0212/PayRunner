import React, { useEffect, useRef, useState } from "react";
import Main from "@/components/Main";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CameraIcon from "@/components/icons/Camera";
import ProfileIcon from "@/components/icons/Profile";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import getUser, { putUser } from "@/hooks/fetchUser";
import SubmitButton from "@/components/SubmitButton";
import AddressInput from "@/components/AddressInput";

// 사용자 데이터에 대한 인터페이스 정의
interface Address {
  zipcode: string;
  street: string;
  detail: string;
}

interface User {
  _id: string;
  name: string;
  sex: "male" | "female";
  residentId: string;
  phone: string;
  address: Address;
  profile: string | null;
}

function MyPageEditInfoPage(): JSX.Element {
  const userId = useAppSelector((state: any) => state.auth.user?._id);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        setUserData(await getUser(userId));
      };
      fetchData();
    }
  }, [userId]);

  const [phone, setPhone] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [detailAddress, setDetailAddress] = useState<string>("");
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Base64 변환
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            const { width, height } = img;
            const scale = 80 / Math.min(width, height); // 짧은 쪽을 80px로 변환
            const newWidth = Math.round(width * scale);
            const newHeight = Math.round(height * scale);

            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              const compressedImage = canvas.toDataURL("image/webp", 0.7);
              setProfile(compressedImage);
            }
          };
        }
      };
    }
  };

  useEffect(() => {
    if (userData !== null) {
      setZipcode(userData.address.zipcode);
      setAddress(userData.address.street);
      setDetailAddress(userData.address.detail);
      setPhone(userData.phone);
      setProfile(userData.profile);
    }
  }, [userData]);

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
            내 정보 수정
          </span>
        </div>
      </Header>
      {userData !== null && (
        <Main hasBottomNav={false}>
          <div>
            <form className="w-full px-5 flex flex-col gap-layout">
              <div className="flex h-20 mt-5">
                <div className="mr-5 relative">
                  <div
                    className="w-20 h-20 rounded-full border border-main-darkGray flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={() => profileInputRef.current?.click()}
                  >
                    {profile ? (
                      <img
                        src={profile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ProfileIcon>
                        <span className="text-gray-500">Upload</span>
                      </ProfileIcon>
                    )}
                    <input
                      type="file"
                      ref={profileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileChange}
                    />
                  </div>
                  <p className="w-6 h-6 bg-main-color rounded-full flex justify-center items-center absolute right-0 bottom-0">
                    <CameraIcon color="white" width={14} height={14} />
                  </p>
                </div>
                <ul className="flex flex-col gap-[10px] text-[12px] text-main-darkGray">
                  {["이름", "성별", "주민번호"].map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-[10px] text-[12px] ml-[10px]">
                  {[
                    userData.name,
                    userData.sex === "male" ? "남성" : "여성",
                    userData.residentId.slice(0, 6) +
                      "-" +
                      userData.residentId[6] +
                      "******",
                  ].map((value, index) => (
                    <li key={index}>{value}</li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full mt-5 flex-col">
                <p className="font-semibold">휴대폰 번호</p>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white border p-2 h-[50px] border-main-gray rounded-[10px] mt-1"
                />
                <p className="font-semibold mt-2">거주지</p>
                <div className="flex gap-3 mb-2 items-end">
                  <AddressInput
                    initialAddress={{
                      zipcode,
                      street: address,
                      detail: detailAddress,
                    }}
                    onAddressSelect={(address) => {
                      setZipcode(address.zipcode);
                      setAddress(address.street);
                      setDetailAddress(address.detail);
                    }}
                  />
                </div>
                <div className="absolute bottom-[20px] left-0 w-full px-[20px] flex justify-center">
                  <SubmitButton
                    onClick={() => {
                      putUser(userId, {
                        phone,
                        address: {
                          zipcode,
                          street: address,
                          detail: detailAddress,
                        },
                        profile,
                      });
                      setSaveModalOpen(!saveModalOpen);
                    }}
                    type="button"
                  >
                    저장하기
                  </SubmitButton>
                </div>
              </div>
              {saveModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="bg-white flex flex-col gap-[20px] p-5 rounded-[10px] w-[362px] items-center">
                    <p className="font-bold text-lg">
                      정보가 성공적으로 수정되었습니다.
                    </p>
                    <Link
                      to="/mypage"
                      className="w-1/2 p-2 rounded-[10px] text-center bg-main-color text-white"
                    >
                      <button
                        type="button"
                        className="text-center"
                        onClick={() => setSaveModalOpen(!saveModalOpen)}
                      >
                        확인
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </form>
          </div>
        </Main>
      )}
    </>
  );
}

export default MyPageEditInfoPage;
