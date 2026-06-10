import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DonationModal from './components/DonationModal';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Programs = lazy(() => import('./pages/Programs'));
const ProgramDetails = lazy(() => import('./pages/ProgramDetails'));
const Projects = lazy(() => import('./pages/Projects'));
const ImpactStories = lazy(() => import('./pages/ImpactStories'));
const DonatePage = lazy(() => import('./pages/DonatePage'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** Scrolls to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/** Simple error boundary */
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center p-8">
          <div>
            <h1 className="text-3xl font-bold text-brand-navy mb-4">Something went wrong</h1>
            <p className="text-brand-navy/70 mb-6">Please refresh the page or try again later.</p>
            <button onClick={() => window.location.reload()} className="bg-brand-gold text-brand-navy px-6 py-3 rounded-full font-semibold">
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Loading spinner for Suspense fallback */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
  </div>
);

function App() {
  const [isUrdu, setIsUrdu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  const handleDonateClick = (campaignName: string | null = null) => {
    setSelectedCampaign(campaignName);
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-brand-gray text-brand-navy font-sans selection:bg-brand-gold selection:text-white pb-[72px] md:pb-0 ${isUrdu ? 'font-urduBody' : ''}`} dir={isUrdu ? 'rtl' : 'ltr'}>
      <ScrollToTop />
      <Navbar isUrdu={isUrdu} setIsUrdu={setIsUrdu} onDonateClick={() => handleDonateClick(null)} />

      <main id="main-content">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home isUrdu={isUrdu} onDonateClick={handleDonateClick} />} />
              <Route path="/about" element={<About isUrdu={isUrdu} />} />
              <Route path="/programs" element={<Programs isUrdu={isUrdu} />} />
              <Route path="/programs/:id" element={<ProgramDetails isUrdu={isUrdu} />} />
              <Route path="/projects" element={<Projects isUrdu={isUrdu} />} />
              <Route path="/impact-stories" element={<ImpactStories isUrdu={isUrdu} />} />
              <Route path="/donate" element={<DonatePage isUrdu={isUrdu} onDonateClick={() => handleDonateClick(null)} />} />
              <Route path="/volunteer" element={<Volunteer isUrdu={isUrdu} />} />
              <Route path="/gallery" element={<Gallery isUrdu={isUrdu} />} />
              <Route path="/contact" element={<Contact isUrdu={isUrdu} />} />
              <Route path="*" element={<NotFound isUrdu={isUrdu} />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer isUrdu={isUrdu} />
      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialCampaign={selectedCampaign} isUrdu={isUrdu} />
    </div>
  );
}

export default App;
