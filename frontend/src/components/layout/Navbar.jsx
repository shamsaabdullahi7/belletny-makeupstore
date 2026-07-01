import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const { user, isAdmin, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();

  /* ---------------- NAV ITEMS ---------------- */

  const navItems = isAdmin
    ? [
        { to: "/admin", label: "Dashboard" },
        { to: "/admin/products", label: "Products" },
        { to: "/admin/orders", label: "Orders" },
      ]
    : user
    ? [
        { to: "/shop", label: "Shop" },
        { to: "/account", label: "My Orders" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/shop", label: "Shop" },
      ];

  const linkClass = ({ isActive }) =>
    `text-xs font-semibold uppercase tracking-[0.2em] transition hover:text-rose ${
      isActive ? "text-rose" : "text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/95 backdrop-blur">
      <div className="page-shell flex h-20 items-center justify-between">

        {/* Logo */}
        <Link
          to={isAdmin ? "/admin" : user ? "/shop" : "/"}
          className="font-display text-2xl tracking-wide text-ink"
        >
          Belletny
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">

          {!isAdmin && (
            <Link
              to="/shop"
              className="hidden h-10 w-10 items-center justify-center transition hover:text-rose sm:flex"
            >
              <Search size={20} />
            </Link>
          )}

          {user ? (
            <button
              onClick={logout}
              className="hidden h-10 items-center gap-2 px-3 text-xs font-semibold uppercase tracking-[0.16em] transition hover:text-rose sm:flex"
            >
              <User size={18} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden h-10 items-center gap-2 px-3 text-xs font-semibold uppercase tracking-[0.16em] transition hover:text-rose sm:flex"
            >
              <User size={18} />
              Login
            </Link>
          )}

          {/* Wishlist */}
          {!isAdmin && (
            <Link
              to={user ? "/wishlist" : "/login"}
              className="relative flex h-10 w-10 items-center justify-center transition hover:text-rose"
            >
              <Heart size={21} />

              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-cream">
                  {wishlistCount}
                </span>
              )}
            </Link>
          )}

          {/* Cart */}
          {!isAdmin && (
            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center transition hover:text-rose"
            >
              <ShoppingBag size={21} />

              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-cream">
                  {itemCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile Menu */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-ink/10 bg-cream md:hidden">
          <nav className="page-shell flex flex-col gap-5 py-6">

            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-left text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-xs font-semibold uppercase tracking-[0.2em]"
              >
                Login
              </Link>
            )}

          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;