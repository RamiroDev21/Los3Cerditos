import { Hero } from "@/components/hero/Hero";
import { CartDrawer, OrderBar } from "@/components/order/CartDrawer";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Featured } from "@/components/sections/Featured";
import { Footer } from "@/components/sections/Footer";
import { Menu } from "@/components/sections/Menu";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SmoothAnchors } from "@/components/ui/SmoothAnchors";
import { CartProvider } from "@/lib/cart";

export default function Home() {
  return (
    <CartProvider>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Featured />
        <Menu />
        <About />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <OrderBar />
      <SmoothAnchors />
    </CartProvider>
  );
}
