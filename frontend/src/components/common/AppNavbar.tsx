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

// メインリンク
const mainLinks = [
  { to: "/", label: "ホーム" },
  { to: "/climate/temperature", label: "気温データ" },
  { to: "/climate/co2", label: "CO₂排出量" },
  { to: "/renewable", label: "再エネ利用" },
];

// ドロップダウンリンク
const dropdownLinks = [
  { to: "/data", label: "データ" },
  { to: "/about", label: "概要" },
  { to: "/faq", label: "FAQ" },
];

// 認証ナビゲーション
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
  }
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
};

// ListItem コンポーネント（ドロップダウン用）
function ListItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link to={href} className="text-sm leading-none font-medium">
          {children}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

// ナビゲーションバー
export const AppNavbar = () => {
  const location = useLocation();
  const { currentUsername, logout } = useAuthContext();

  const linkBase = "px-3 py-1 rounded transition-colors";
  const linkActive = "bg-blue-700 font-semibold";
  const linkInactive = "text-white hover:bg-blue-600";

  return (
    <header className="bg-blue-500 text-white">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        {/* ロゴ */}
        <Link to="/" className="text-lg font-bold">
          気候変動データアプリ
        </Link>

        {/* メインナビゲーション */}
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap">
            {mainLinks.map((link) => (
              <NavigationMenuItem key={link.to}>
                <NavigationMenuLink
                  asChild
                  className={`${linkBase} ${
                    location.pathname === link.to ? linkActive : linkInactive
                  }`}
                >
                  <Link to={link.to}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            {/* ドロップダウン */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white px-3 py-1 rounded hover:bg-blue-600">
                データ・概要
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  {dropdownLinks.map((link) => (
                    <ListItem key={link.to} href={link.to}>
                      {link.label}
                    </ListItem>
                  ))}
                </ul>
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
