import {
  Bell,
  LayoutDashboard,
  Map,
  PackagePlus,
  Settings,
  Star,
  Truck,
  User,
  WalletCards
} from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/parcels/new", label: "Book Parcel", icon: PackagePlus },
  { href: "/deliveries", label: "My Deliveries", icon: Truck },
  { href: "/marketplace", label: "Route Marketplace", icon: Map },
  { href: "/routes/new", label: "Create Route", icon: Map },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/dashboard#earnings", label: "Earnings", icon: WalletCards },
  { href: "/dashboard#notifications", label: "Notifications", icon: Bell },
  { href: "/profile#settings", label: "Settings", icon: Settings }
];
