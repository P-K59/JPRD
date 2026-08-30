import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Programs from '../components/sections/Programs';
import Projects from '../components/sections/Projects';
import Impact from '../components/sections/Impact';
import StoryCards from '../components/sections/StoryCards';
import WhereWeWork from '../components/sections/WhereWeWork';
import TrustBadges from '../components/sections/TrustBadges';
import Timeline from '../components/sections/Timeline';
import Transparency from '../components/sections/Transparency';
import Testimonials from '../components/sections/Testimonials';
import Events from '../components/sections/Events';
import FAQ from '../components/sections/FAQ';
import Team from '../components/sections/Team';
import Blog from '../components/sections/Blog';
import Gallery from '../components/sections/Gallery';
import Volunteer from '../components/sections/Volunteer';
import CSR from '../components/sections/CSR';
import FinalCTA from '../components/sections/FinalCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Programs />
      <Projects />
      <Impact />
      <StoryCards />
      <WhereWeWork />
      <TrustBadges />
      <Timeline />
      <Transparency />
      <Testimonials />
      <Events />
      <FAQ />
      <Team />
      <Blog />
      <Gallery />
      <CSR />
      <Volunteer />
      <FinalCTA />
    </>
  );
}
