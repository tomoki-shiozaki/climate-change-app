import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const mainLinks = [
  { to: "/", label: "ホーム" },
  { to: "/climate/temperature", label: "気温データ" },
  { to: "/climate/co2", label: "CO₂排出量" },
  { to: "/renewable", label: "再エネ利用" },
];

const dropdownLinks = [
  { to: "/data", label: "データ" },
  { to: "/about", label: "概要" },
  { to: "/faq", label: "FAQ" },
];

type AuthNavProps = {
  currentUsername: string | null;
  logout: () => void;
};

const AuthNav: React.FC<AuthNavProps> = ({ currentUsername, logout }) => {
  if (currentUsername) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-white">{currentUsername} さん</span>
        <Button variant="ghost" size="sm" onClick={logout}>
          ログアウト
        </Button>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Button asChild variant="link" size="sm">
        <Link to="/login">ログイン</Link>
      </Button>
      <Button asChild variant="link" size="sm">
        <Link to="/signup">新規登録</Link>
      </Button>
    </div>
  );
};

export const AppNavbar = () => {
  const location = useLocation();
  const { currentUsername, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3">
        {/* 上段：ブランド + ハンバーガー */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to="/" className="text-lg font-bold whitespace-nowrap">
            気候変動データアプリ
          </Link>
          <button
            className="md:hidden p-2 rounded hover:bg-blue-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="sr-only">メニュー切替</span>☰
          </button>
        </div>

        {/* 下段：リンク & 認証 */}
        <div
          className={`w-full md:flex md:items-center md:gap-4 mt-2 md:mt-0 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {/* 左：メインリンク + ドロップダウン */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            {mainLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1 rounded ${
                  location.pathname === link.to
                    ? "bg-white text-blue-600"
                    : "hover:bg-blue-500"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  データ・概要
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-black">
                {dropdownLinks.map((link) => (
                  <DropdownMenuItem asChild key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 右：認証 */}
          <div className="mt-2 md:mt-0 md:ml-auto">
            <AuthNav currentUsername={currentUsername} logout={logout} />
          </div>
        </div>
      </div>
    </nav>
  );
};
