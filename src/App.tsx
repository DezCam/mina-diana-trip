import { BackToTop } from "./components/BackToTop";
import { Hero } from "./components/Hero";
import { HomeBases } from "./components/HomeBases";
import { Itinerary } from "./components/Itinerary";
import { Nav } from "./components/Nav";
import { Overview } from "./components/Overview";
import { TripDetails } from "./components/TripDetails";
import { itinerary } from "./data/itinerary";
import { trip } from "./data/trip";

export default function App() {
  return (
    <div className="min-h-screen bg-parchment text-ink">
      <Hero />
      <Nav />
      <Overview />
      <HomeBases homeBases={trip.homeBases} />
      <Itinerary days={itinerary} />
      <TripDetails details={trip.details} />
      <footer className="border-t border-highland/10 bg-highland px-5 py-8 text-center text-sm text-cream/80">
        <p className="font-serif text-lg text-cream">Mina & Diana's European Adventure</p>
        <p className="mt-2">Private details should stay out of the public guide unless intentionally shared.</p>
      </footer>
      <BackToTop />
    </div>
  );
}
