import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "./icons/bottomNav/Home";
import EmployIcon from "./icons/bottomNav/Employ";
import UserIcon from "./icons/bottomNav/User";
import WorkIcon from "./icons/bottomNav/Work";
import ChatIcon from "./icons/bottomNav/Chat";

interface NavBtnProps {
  to: string;
  icon: React.ElementType;
  label: string;
}
const NavBtn: React.FC<NavBtnProps> = ({ to, icon: Icon, label }) => {
  const color = window.location.pathname === to ? "#0B798B" : "#717171";
  console.log(window.location.pathname);

  return (
    <Link to={to} className="flex flex-col items-center gap-1">
      <Icon width={24} height={24} color={color} />
      <span className="text-[12px]" style={{ color }}>
        {label}
      </span>
    </Link>
  );
};
const BottomNav = () => {
  const startPathname = useLocation().pathname.split("/").splice(1);

  const mainColor = "#0B798B";
  const darkGrayColor = "#717171";

  const colors = useMemo(
    () => ({
      home: startPathname.includes("") ? mainColor : darkGrayColor,
      recruit: startPathname.includes("recruit") ? mainColor : darkGrayColor,
      chat: startPathname.includes("chat") ? mainColor : darkGrayColor,
      work: startPathname.includes("work") ? mainColor : darkGrayColor,
      mypage: startPathname.includes("mypage") ? mainColor : darkGrayColor,
    }),
    [startPathname]
  );

  return (
    <nav className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[560px] h-20 border-t-1 border-main-bg bg-white pt-[10px] px-5 z-10">
      <div className="flex gap-[10px] justify-around items-center">
        <NavBtn to="/" icon={HomeIcon} label="홈" />
        <NavBtn to="/recruit" icon={EmployIcon} label="고용현황" />
        <NavBtn to="/chat" icon={ChatIcon} label="채팅" />
        <NavBtn to="/work" icon={WorkIcon} label="근무현황" />
        <NavBtn to="/mypage" icon={UserIcon} label="내 정보" />
      </div>
    </nav>
  );
};

export default BottomNav;
