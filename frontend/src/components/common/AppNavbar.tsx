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
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {currentUsername} さん
        </span>
        <Button variant="outline" size="sm" onClick={logout}>
          ログアウト
        </Button>
      </div>
    );
  } else {
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
  }
};

export const AppNavbar = () => {
  const location = useLocation();
  const { currentUsername, logout } = useAuthContext();

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
      {/* 左側：ブランド */}
      <Link to="/" className="text-lg font-bold">
        気候変動データアプリ
      </Link>

      {/* 中央：リンク */}
      <div className="flex items-center gap-4">
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

        {/* ドロップダウン */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
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

      {/* 右側：認証 */}
      <AuthNav currentUsername={currentUsername} logout={logout} />
    </nav>
  );
};
