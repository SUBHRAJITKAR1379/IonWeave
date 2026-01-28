import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({ name: '', email: '', organization: '', message: '' });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.section-fade-in').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      const response = await axios.post(`${BACKEND_URL}/api/contact`, formData);
      setFormStatus({ type: 'success', message: response.data.message });
      setFormData({ name: '', email: '', organization: '', message: '' });
    } catch (error) {
      setFormStatus({ 
        type: 'error', 
        message: 'Failed to submit. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-dark-bg/95 backdrop-blur-sm z-50 border-b border-accent-blue/20" data-testid="main-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold gradient-text">AtmosAether</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {['home', 'problem', 'technology', 'how-it-works', 'implementation', 'impact', 'vision', 'contact'].map(section => (
                <button
                  key={section}
                  onClick={() => handleScroll(section)}
                  className={`nav-link text-sm font-medium ${activeSection === section ? 'text-accent-blue' : 'text-gray-300 hover:text-white'}`}
                  data-testid={`nav-${section}`}
                >
                  {section.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 section-perspective" data-testid="hero-section">
        <div className="hero-image absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1680225695622-1c088b1db081?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwY2l0eSUyMGNsZWFuJTIwYWlyfGVufDB8fHx8MTc2OTQwNzUyMHww&ixlib=rb-4.1.0&q=85" 
            alt="Clean city future" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center parallax-layer">
          <h1 className="text-5xl md:text-8xl font-bold mb-6 animate-fade-in text-3d" data-testid="hero-title">
            <span className="gradient-text">AtmosAether</span>
          </h1>
          <p className="text-2xl md:text-4xl font-light mb-4 animate-fade-in glow-effect" style={{animationDelay: '0.2s'}}>
            Ionized Atmospheric Harvester
          </p>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in glass-effect px-6 py-4 rounded-xl" style={{animationDelay: '0.4s'}}>
            Revolutionary technology for purifying urban atmospheres through advanced ionization and molecular filtration
          </p>
          <button 
            onClick={() => handleScroll('problem')}
            className="button-3d bg-gradient-to-r from-accent-blue to-accent-teal text-white px-10 py-5 rounded-xl font-semibold text-lg animate-fade-in"
            style={{animationDelay: '0.6s'}}
            data-testid="hero-cta-button"
          >
            Discover the Innovation
          </button>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8" data-testid="problem-section">
        <div className="max-w-6xl mx-auto">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              The <span className="gradient-text">Problem</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-teal mx-auto mb-12"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 section-fade-in">
            <div className="gradient-border rounded-xl p-8 hover-lift card-3d" data-testid="problem-card-pollution">
              <div className="text-accent-blue text-5xl mb-4 float-animation">🏭</div>
              <h3 className="text-2xl font-semibold mb-4 gradient-text">Urban Air Pollution Crisis</h3>
              <p className="text-gray-300 leading-relaxed">
                Over 90% of the world's population lives in areas where air quality exceeds WHO guidelines. Urban centers face severe atmospheric degradation from industrial emissions, vehicle exhaust, and particulate matter.
              </p>
            </div>
            
            <div className="gradient-border rounded-xl p-8 hover-lift card-3d" data-testid="problem-card-health">
              <div className="text-accent-teal text-5xl mb-4 float-animation" style={{animationDelay: '0.5s'}}>⚕️</div>
              <h3 className="text-2xl font-semibold mb-4 gradient-text">Health Impact</h3>
              <p className="text-gray-300 leading-relaxed">
                Air pollution causes 7 million premature deaths annually. Respiratory diseases, cardiovascular problems, and reduced life expectancy plague urban populations, demanding immediate innovative solutions.
              </p>
            </div>
            
            <div className="gradient-border rounded-xl p-8 hover-lift card-3d" data-testid="problem-card-climate">
              <div className="text-accent-blue text-5xl mb-4 float-animation" style={{animationDelay: '1s'}}>🌍</div>
              <h3 className="text-2xl font-semibold mb-4 gradient-text">Climate Change Acceleration</h3>
              <p className="text-gray-300 leading-relaxed">
                Traditional pollution control methods are insufficient. We need breakthrough technologies that not only filter air but actively remediate atmospheric composition at scale.
              </p>
            </div>
            
            <div className="gradient-border rounded-xl p-8 hover-lift card-3d" data-testid="problem-card-existing">
              <div className="text-accent-teal text-5xl mb-4 float-animation" style={{animationDelay: '1.5s'}}>⚙️</div>
              <h3 className="text-2xl font-semibold mb-4 gradient-text">Limitations of Existing Solutions</h3>
              <p className="text-gray-300 leading-relaxed">
                Current air purification systems are energy-intensive, localized, and expensive. There's a critical need for scalable, efficient, and cost-effective atmospheric remediation technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technology Section */}
      <section id="technology" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-card/30" data-testid="technology-section">
        <div className="max-w-6xl mx-auto">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Core <span className="gradient-text">Technology</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-teal mx-auto mb-12"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12 section-fade-in">
            <div className="text-center card-3d hover-lift" data-testid="tech-feature-ionization">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent-blue to-accent-teal rounded-full flex items-center justify-center text-4xl pulse-glow number-badge-3d">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-3 gradient-text">Advanced Ionization</h3>
              <p className="text-gray-400">
                Proprietary multi-stage ionization system that charges and captures pollutants at molecular level
              </p>
            </div>
            
            <div className="text-center card-3d hover-lift" data-testid="tech-feature-harvesting">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent-blue to-accent-teal rounded-full flex items-center justify-center text-4xl pulse-glow number-badge-3d" style={{animationDelay: '0.3s'}}>
                🌪️
              </div>
              <h3 className="text-xl font-semibold mb-3 gradient-text">Atmospheric Harvesting</h3>
              <p className="text-gray-400">
                Large-scale air intake systems with minimal energy consumption using natural convection patterns
              </p>
            </div>
            
            <div className="text-center card-3d hover-lift" data-testid="tech-feature-filtration">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent-blue to-accent-teal rounded-full flex items-center justify-center text-4xl pulse-glow number-badge-3d" style={{animationDelay: '0.6s'}}>
                🔬
              </div>
              <h3 className="text-xl font-semibold mb-3 gradient-text">Molecular Filtration</h3>
              <p className="text-gray-400">
                Nano-engineered filter matrices that trap and neutralize PM2.5, VOCs, and greenhouse gases
              </p>
            </div>
          </div>

          <div className="gradient-border rounded-xl p-8 section-fade-in glass-effect hover-lift" data-testid="tech-specifications">
            <h3 className="text-2xl font-semibold mb-6 text-center gradient-text">Technical Specifications</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-effect p-4 rounded-lg hover-lift">
                <h4 className="text-accent-blue font-semibold mb-2">Filtration Capacity</h4>
                <p className="text-gray-300">10,000+ cubic meters per hour per unit</p>
              </div>
              <div className="glass-effect p-4 rounded-lg hover-lift">
                <h4 className="text-accent-blue font-semibold mb-2">Energy Efficiency</h4>
                <p className="text-gray-300">85% reduction vs traditional systems</p>
              </div>
              <div className="glass-effect p-4 rounded-lg hover-lift">
                <h4 className="text-accent-teal font-semibold mb-2">Particle Capture Rate</h4>
                <p className="text-gray-300">99.7% for PM2.5 and smaller particles</p>
              </div>
              <div className="glass-effect p-4 rounded-lg hover-lift">
                <h4 className="text-accent-teal font-semibold mb-2">Operating Range</h4>
                <p className="text-gray-300">-40°C to 50°C in all weather conditions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8" data-testid="how-it-works-section">
        <div className="max-w-6xl mx-auto">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              How It <span className="gradient-text">Works</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-teal mx-auto mb-12"></div>
          </div>

          <div className="space-y-8 section-fade-in">
            <div className="flex flex-col md:flex-row items-center gap-8 step-card-3d" data-testid="step-1">
              <div className="md:w-1/4 text-center">
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-accent-blue to-accent-teal rounded-full flex items-center justify-center text-5xl font-bold number-badge-3d glow-effect">
                  1
                </div>
              </div>
              <div className="md:w-3/4 gradient-border rounded-xl p-6 hover-lift glass-effect">
                <h3 className="text-2xl font-semibold mb-3 gradient-text">Air Intake & Pre-filtration</h3>
                <p className="text-gray-300 leading-relaxed">
                  Polluted air is drawn into the system through strategically positioned intake vents. Large particulates are removed through mechanical pre-filters, optimizing the ionization process.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8 step-card-3d" data-testid="step-2">
              <div className="md:w-1/4 text-center">
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-accent-teal to-accent-blue rounded-full flex items-center justify-center text-5xl font-bold number-badge-3d glow-effect">
                  2
                </div>
              </div>
              <div className="md:w-3/4 gradient-border rounded-xl p-6 hover-lift glass-effect">
                <h3 className="text-2xl font-semibold mb-3 gradient-text">Ionization Chamber</h3>
                <p className="text-gray-300 leading-relaxed">
                  Air passes through high-voltage ionization chambers where pollutant molecules receive an electrical charge, making them magnetically attracted to collection plates.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 step-card-3d" data-testid="step-3">
              <div className="md:w-1/4 text-center">
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-accent-blue to-accent-teal rounded-full flex items-center justify-center text-5xl font-bold number-badge-3d glow-effect">
                  3
                </div>
              </div>
              <div className="md:w-3/4 gradient-border rounded-xl p-6 hover-lift glass-effect">
                <h3 className="text-2xl font-semibold mb-3 gradient-text">Molecular Capture & Neutralization</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ionized particles are captured on nano-engineered filter matrices. Chemical neutralization processes break down harmful compounds into harmless substances.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8 step-card-3d" data-testid="step-4">
              <div className="md:w-1/4 text-center">
                <div className="w-28 h-28 mx-auto bg-gradient-to-br from-accent-teal to-accent-blue rounded-full flex items-center justify-center text-5xl font-bold number-badge-3d glow-effect">
                  4
                </div>
              </div>
              <div className="md:w-3/4 gradient-border rounded-xl p-6 hover-lift glass-effect">
                <h3 className="text-2xl font-semibold mb-3 gradient-text">Clean Air Release</h3>
                <p className="text-gray-300 leading-relaxed">
                  Purified air is released back into the atmosphere, enriched with negative ions that promote respiratory health. Continuous monitoring ensures optimal air quality output.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section id="implementation" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-card/30" data-testid="implementation-section">
        <div className="max-w-6xl mx-auto">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Implementation <span className="gradient-text">Process</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-teal mx-auto mb-12"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 section-fade-in">
            <div className="gradient-border rounded-lg p-6 hover-lift" data-testid="phase-pilot">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-3">Phase 1: Pilot Deployment</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Install 10 units in high-pollution urban area</li>
                <li>• 6-month monitoring and data collection</li>
                <li>• Community feedback integration</li>
                <li>• Performance optimization</li>
              </ul>
            </div>

            <div className="gradient-border rounded-lg p-6 hover-lift" data-testid="phase-scaling">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-3">Phase 2: Scaling</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Deploy 100+ units across major cities</li>
                <li>• Partnership with municipal governments</li>
                <li>• Manufacturing scale-up</li>
                <li>• Cost reduction through volume</li>
              </ul>
            </div>

            <div className="gradient-border rounded-lg p-6 hover-lift" data-testid="phase-global">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold mb-3">Phase 3: Global Network</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• International expansion program</li>
                <li>• AI-powered network optimization</li>
                <li>• Real-time air quality monitoring</li>
                <li>• Open data platform for researchers</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 gradient-border rounded-lg p-8 section-fade-in" data-testid="timeline">
            <h3 className="text-2xl font-semibold mb-6 text-center">Projected Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-accent-blue font-bold min-w-32">Year 1</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-accent-blue to-accent-teal rounded-full"></div>
                <span className="text-gray-300">Pilot & Testing</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent-blue font-bold min-w-32">Years 2-3</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-accent-blue to-accent-teal rounded-full" style={{width: '70%'}}></div>
                <span className="text-gray-300">Urban Deployment</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-accent-blue font-bold min-w-32">Years 4-5</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-accent-blue to-accent-teal rounded-full" style={{width: '50%'}}></div>
                <span className="text-gray-300">Global Expansion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Impact Section */}
      <section id="impact" className="py-20 px-4 sm:px-6 lg:px-8" data-testid="impact-section">
        <div className="max-w-6xl mx-auto">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Sustainability <span className="gradient-text">Impact</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-teal mx-auto mb-12"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 section-fade-in">
            <div className="relative rounded-lg overflow-hidden h-80">
              <img 
                src="https://images.unsplash.com/photo-1758610031201-6cb5d6ee7f20?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwyfHxmdXR1cmlzdGljJTIwY2l0eSUyMGNsZWFuJTIwYWlyfGVufDB8fHx8MTc2OTQwNzUyMHww&ixlib=rb-4.1.0&q=85" 
                alt="Green sustainable building" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent"></div>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-semibold mb-6">Environmental Benefits</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3" data-testid="impact-metric-emissions">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h4 className="font-semibold text-accent-blue">Carbon Footprint Reduction</h4>
                    <p className="text-gray-300">Each unit removes equivalent of 500 tons CO₂ annually</p>
                  </div>
                </div>
                <div className="flex items-start gap-3" data-testid="impact-metric-health">
                  <span className="text-2xl">❤️</span>
                  <div>
                    <h4 className="font-semibold text-accent-teal">Health Improvements</h4>
                    <p className="text-gray-300">Projected 30% reduction in respiratory illnesses</p>
                  </div>
                </div>
                <div className="flex items-start gap-3" data-testid="impact-metric-economy">
                  <span className="text-2xl">💰</span>
                  <div>
                    <h4 className="font-semibold text-accent-blue">Economic Impact</h4>
                    <p className="text-gray-300">$2M+ annual savings in healthcare costs per city</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 section-fade-in">
            <div className="gradient-border rounded-xl p-6 text-center hover-lift stat-card-3d" data-testid="stat-air-quality">
              <div className="text-5xl font-bold gradient-text mb-2 text-3d">95%</div>
              <p className="text-gray-300">Air Quality Improvement</p>
            </div>
            <div className="gradient-border rounded-xl p-6 text-center hover-lift stat-card-3d" data-testid="stat-energy">
              <div className="text-5xl font-bold gradient-text mb-2 text-3d">85%</div>
              <p className="text-gray-300">Energy Efficiency</p>
            </div>
            <div className="gradient-border rounded-xl p-6 text-center hover-lift stat-card-3d" data-testid="stat-coverage">
              <div className="text-5xl font-bold gradient-text mb-2 text-3d">50km²</div>
              <p className="text-gray-300">Coverage Per Unit</p>
            </div>
            <div className="gradient-border rounded-xl p-6 text-center hover-lift stat-card-3d" data-testid="stat-lifespan">
              <div className="text-5xl font-bold gradient-text mb-2 text-3d">20yr</div>
              <p className="text-gray-300">System Lifespan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section id="vision" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-card/30" data-testid="vision-section">
        <div className="max-w-6xl mx-auto">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Future <span className="gradient-text">Vision</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-teal mx-auto mb-12"></div>
          </div>

          <div className="section-fade-in mb-12">
            <div className="gradient-border rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-4 text-center">Our 2035 Goal</h3>
              <p className="text-xl text-gray-300 text-center leading-relaxed">
                Deploy 10,000+ AtmosAether units globally, creating a networked atmospheric purification system that actively reverses urban air pollution and contributes to global climate stabilization.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 section-fade-in">
            <div className="text-center" data-testid="vision-card-integration">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-3">AI Integration</h3>
              <p className="text-gray-300">
                Machine learning algorithms will optimize unit placement and operation based on real-time pollution data, weather patterns, and urban development.
              </p>
            </div>

            <div className="text-center" data-testid="vision-card-smart">
              <div className="text-5xl mb-4">🏙️</div>
              <h3 className="text-xl font-semibold mb-3">Smart City Integration</h3>
              <p className="text-gray-300">
                Seamless integration with smart city infrastructure, providing real-time air quality data and automated response to pollution events.
              </p>
            </div>

            <div className="text-center" data-testid="vision-card-collaboration">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3">Global Collaboration</h3>
              <p className="text-gray-300">
                Open-source research platform enabling scientists worldwide to contribute to atmospheric science and pollution remediation strategies.
              </p>
            </div>
          </div>

          <div className="mt-12 section-fade-in">
            <div className="gradient-border rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Innovation Roadmap</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4" data-testid="roadmap-portable">
                  <span className="text-accent-blue text-xl">▸</span>
                  <div>
                    <h4 className="font-semibold">Portable Micro-Units</h4>
                    <p className="text-gray-400">Personal air purification devices for individual use</p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="roadmap-industrial">
                  <span className="text-accent-teal text-xl">▸</span>
                  <div>
                    <h4 className="font-semibold">Industrial-Scale Systems</h4>
                    <p className="text-gray-400">Mega-units for factory and power plant emission control</p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="roadmap-carbon">
                  <span className="text-accent-blue text-xl">▸</span>
                  <div>
                    <h4 className="font-semibold">Carbon Sequestration Module</h4>
                    <p className="text-gray-400">Direct CO₂ capture and conversion to useful materials</p>
                  </div>
                </div>
                <div className="flex items-start gap-4" data-testid="roadmap-space">
                  <span className="text-accent-teal text-xl">▸</span>
                  <div>
                    <h4 className="font-semibold">Space Applications</h4>
                    <p className="text-gray-400">Atmospheric processors for space habitats and Mars colonization</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8" data-testid="contact-section">
        <div className="max-w-4xl mx-auto">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              Get <span className="gradient-text">Involved</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-teal mx-auto mb-6"></div>
            <p className="text-center text-gray-300 mb-12 text-lg">
              Join us in revolutionizing urban air quality. Whether you're an investor, researcher, or municipal leader, we'd love to hear from you.
            </p>
          </div>

          <div className="gradient-border rounded-xl p-8 section-fade-in glass-effect">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-3d w-full px-4 py-3 rounded-lg focus:outline-none transition-all"
                  placeholder="Your full name"
                  data-testid="contact-input-name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-3d w-full px-4 py-3 rounded-lg focus:outline-none transition-all"
                  placeholder="your.email@example.com"
                  data-testid="contact-input-email"
                />
              </div>

              <div>
                <label htmlFor="organization" className="block text-sm font-medium mb-2">Organization</label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="input-3d w-full px-4 py-3 rounded-lg focus:outline-none transition-all"
                  placeholder="Company or institution (optional)"
                  data-testid="contact-input-organization"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="5"
                  className="input-3d w-full px-4 py-3 rounded-lg focus:outline-none resize-none transition-all"
                  placeholder="Tell us about your interest in AtmosAether..."
                  data-testid="contact-input-message"
                ></textarea>
              </div>

              {formStatus.message && (
                <div 
                  className={`p-4 rounded-xl glass-effect ${formStatus.type === 'success' ? 'border-2 border-accent-teal text-accent-teal' : 'border-2 border-red-400 text-red-400'}`}
                  data-testid="contact-form-status"
                >
                  {formStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="button-3d w-full bg-gradient-to-r from-accent-blue to-accent-teal text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="contact-submit-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-card/50 py-12 px-4 sm:px-6 lg:px-8 border-t border-accent-blue/20" data-testid="footer">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold gradient-text mb-4">AtmosAether</h3>
          <p className="text-gray-400 mb-6">
            Innovating for a cleaner, healthier atmosphere
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#home" className="text-gray-400 hover:text-accent-blue transition-colors">Home</a>
            <a href="#problem" className="text-gray-400 hover:text-accent-blue transition-colors">Problem</a>
            <a href="#technology" className="text-gray-400 hover:text-accent-blue transition-colors">Technology</a>
            <a href="#contact" className="text-gray-400 hover:text-accent-blue transition-colors">Contact</a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 AtmosAether. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
