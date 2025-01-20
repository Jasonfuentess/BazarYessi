import ShoppingList from "./ShoppingList";
import ContactWhatsApp from "./ContactWhatsApp";
import MainCarousel from "./MainCarousel";

function Home() {
  return (
    <div className="home">
      <MainCarousel />
      <ShoppingList />
      <ContactWhatsApp />
    </div>
  );
}

export default Home;
