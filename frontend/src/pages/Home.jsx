import BestSeller from "../components/BestSeller";
import HeroSection from "../components/HeroSection";
import LatestCollection from "../components/LatestCollection ";
import Newsletter from "../components/Newsletter";
import Policy from "../components/Policy";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <LatestCollection />
      <BestSeller />
      <Policy />
      <Newsletter />
    </div>
  );
};

export default Home;
