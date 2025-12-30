import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

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

const AuthNav: React.FC<{
  currentUsername: string | null;
  logout: () => void;
}> = ({ currentUsername, logout }) => {
  if (currentUsername) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-white text-sm">{currentUsername} さん</span>
        <Button variant="outline" size="sm" onClick={logout}>
          ログアウト
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/login">ログイン</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
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
    <header className="bg-blue-500 text-white">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <Link to="/" className="text-lg font-bold">
          気候変動データアプリ
        </Link>

        {/* ナビゲーション */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-4">
            {/* メインリンク */}
            {mainLinks.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink
                  asChild
                  className={`px-3 py-1 rounded transition-colors ${
                    location.pathname === link.to
                      ? "bg-blue-700 font-semibold"
                      : "text-white hover:bg-blue-600"
                  }`}
                >
                  <Link to={link.to}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            {/* ドロップダウンリンク */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-3 py-1 rounded text-white hover:bg-blue-600">
                データ・概要
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex flex-col space-y-1 bg-blue-600 text-white p-2 rounded shadow-md">
                {dropdownLinks.map((link) => (
                  <NavigationMenuLink
                    asChild
                    key={link.to}
                    className="px-3 py-1 rounded hover:bg-blue-700"
                  >
                    <Link to={link.to}>{link.label}</Link>
                  </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* 認証ナビ */}
        <AuthNav currentUsername={currentUsername} logout={logout} />
      </div>
    </header>
  );
};
