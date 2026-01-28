import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import FloatingChatButton from './components/FloatingChatButton';

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
      <nav className="nav-dynamic fixed top-0 w-full z-50" data-testid="main-navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center animate-spin-slow">
                <div className="w-8 h-8 rounded-full bg-dark-bg flex items-center justify-center">
                  <span className="text-lg">🌪️</span>
                </div>
              </div>
              <span className="text-xl font-bold gradient-text">AtmosAether</span>
            </div>
            <div className="hidden md:flex space-x-8">
              {['home', 'problem', 'technology', 'google-tech', 'how-it-works', 'implementation', 'impact', 'vision', 'contact'].map(section => (
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
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-16 section-perspective overflow-hidden" data-testid="hero-section">
        {/* Dynamic Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-blue rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-teal rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center parallax-layer">
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue to-accent-teal rounded-full animate-spin-slow opacity-50"></div>
              <div className="absolute inset-2 bg-dark-bg rounded-full flex items-center justify-center">
                <span className="text-6xl">🌪️</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in text-3d" data-testid="hero-title">
            <span className="gradient-text">AtmosAether</span>
          </h1>
          <p className="text-3xl md:text-4xl font-light mb-4 animate-fade-in glow-effect" style={{animationDelay: '0.2s'}}>
            Ionized Atmospheric Harvester
          </p>
          <div className="flex justify-center gap-2 mb-8 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="h-1 w-12 bg-accent-blue rounded-full"></div>
            <div className="h-1 w-12 bg-accent-teal rounded-full"></div>
            <div className="h-1 w-12 bg-accent-blue rounded-full"></div>
          </div>
          <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto animate-fade-in glass-effect px-8 py-6 rounded-2xl" style={{animationDelay: '0.4s'}}>
            Revolutionary technology for purifying urban atmospheres through advanced ionization and molecular filtration
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <button 
              onClick={() => handleScroll('problem')}
              className="button-3d bg-gradient-to-r from-accent-blue to-accent-teal text-white px-10 py-5 rounded-xl font-semibold text-lg"
              data-testid="hero-cta-button"
            >
              Discover the Innovation
            </button>
            <button 
              onClick={() => handleScroll('contact')}
              className="button-3d glass-effect border-2 border-accent-blue text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-accent-blue/20"
            >
              Get In Touch
            </button>
          </div>
          
          {/* Floating Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.8s'}}>
            <div className="glass-effect rounded-xl p-4 hover-lift">
              <div className="text-3xl font-bold gradient-text">99.7%</div>
              <div className="text-xs text-gray-400 mt-1">Filtration Rate</div>
            </div>
            <div className="glass-effect rounded-xl p-4 hover-lift">
              <div className="text-3xl font-bold gradient-text">85%</div>
              <div className="text-xs text-gray-400 mt-1">Energy Efficient</div>
            </div>
            <div className="glass-effect rounded-xl p-4 hover-lift">
              <div className="text-3xl font-bold gradient-text">50km²</div>
              <div className="text-xs text-gray-400 mt-1">Coverage Area</div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent-blue rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent-blue rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 px-4 sm:px-6 lg:px-8 section-bg-dynamic relative overflow-hidden" data-testid="problem-section">
        {/* Animated Background Elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-accent-blue/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent-teal/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="section-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
              The <span className="gradient-text">Problem</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-blue to-accent-teal mx-auto mb-12"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 section-fade-in">
            <div className="gradient-border rounded-xl p-8 hover-lift card-3d card-dynamic shimmer" data-testid="problem-card-pollution">
              <div className="text-accent-blue text-5xl mb-4 float-animation icon-pulse">🏭</div>
              <h3 className="text-2xl font-semibold mb-4 gradient-text text-glow">Urban Air Pollution Crisis</h3>
              <p className="text-gray-300 leading-relaxed">
                Over 90% of the world's population lives in areas where air quality exceeds WHO guidelines. Urban centers face severe atmospheric degradation from industrial emissions, vehicle exhaust, and particulate matter.
              </p>
            </div>
            
            <div className="gradient-border rounded-xl p-8 hover-lift card-3d card-dynamic shimmer" data-testid="problem-card-health">
              <div className="text-accent-teal text-5xl mb-4 float-animation icon-pulse" style={{animationDelay: '0.5s'}}>⚕️</div>
              <h3 className="text-2xl font-semibold mb-4 gradient-text text-glow">Health Impact</h3>
              <p className="text-gray-300 leading-relaxed">
                Air pollution causes 7 million premature deaths annually. Respiratory diseases, cardiovascular problems, and reduced life expectancy plague urban populations, demanding immediate innovative solutions.
              </p>
            </div>
            
            <div className="gradient-border rounded-xl p-8 hover-lift card-3d card-dynamic shimmer" data-testid="problem-card-climate">
              <div className="text-accent-blue text-5xl mb-4 float-animation icon-pulse" style={{animationDelay: '1s'}}>🌍</div>
              <h3 className="text-2xl font-semibold mb-4 gradient-text text-glow">Climate Change Acceleration</h3>
              <p className="text-gray-300 leading-relaxed">
                Traditional pollution control methods are insufficient. We need breakthrough technologies that not only filter air but actively remediate atmospheric composition at scale.
              </p>
            </div>
            
            <div className="gradient-border rounded-xl p-8 hover-lift card-3d card-dynamic shimmer" data-testid="problem-card-existing">
              <div className="text-accent-teal text-5xl mb-4 float-animation icon-pulse" style={{animationDelay: '1.5s'}}>⚙️</div>
              <h3 className="text-2xl font-semibold mb-4 gradient-text text-glow">Limitations of Existing Solutions</h3>
              <p className="text-gray-300 leading-relaxed">
                Current air purification systems are energy-intensive, localized, and expensive. There's a critical need for scalable, efficient, and cost-effective atmospheric remediation technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technology Section */}
      <section id="technology" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-card/30 relative overflow-hidden" data-testid="technology-section">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/5 rounded-full filter blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
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

      {/* Google Technologies Section */}
      <section id="google-tech" className="py-20 px-4 sm:px-6 lg:px-8 section-bg-dynamic relative overflow-hidden" data-testid="google-tech-section">
        {/* Animated Background */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-green-500/10 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="section-fade-in text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4 glass-effect px-6 py-3 rounded-full">
                <span className="text-4xl">🔧</span>
                <span className="text-sm font-semibold text-accent-blue">Powered by Google</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Google <span className="gradient-text">Technologies</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Leveraging cutting-edge Google Cloud and AI technologies to optimize atmospheric purification at scale
            </p>
          </div>

          {/* Google Technologies Grid */}
          <div className="grid md:grid-cols-5 gap-6 mb-16 section-fade-in">
            <div className="gradient-border rounded-xl p-6 text-center hover-lift card-3d card-dynamic" data-testid="tech-gcp">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-depth">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.19 2.38a9.344 9.344 0 0 1 9.434 9.417 9.344 9.344 0 0 1-9.417 9.434A9.344 9.344 0 0 1 2.79 11.812 9.344 9.344 0 0 1 12.19 2.38zm-.885 14.935a5.45 5.45 0 0 0 5.446-5.446 5.45 5.45 0 0 0-5.446-5.445 5.45 5.45 0 0 0-5.445 5.445 5.45 5.45 0 0 0 5.445 5.446z"/>
                </svg>
              </div>
              <h3 className="font-bold mb-2 text-white">Google Cloud Platform</h3>
              <p className="text-xs text-gray-400">Infrastructure & Compute</p>
            </div>

            <div className="gradient-border rounded-xl p-6 text-center hover-lift card-3d card-dynamic" data-testid="tech-tensorflow">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-depth">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm0 1.73l8.892 5.135v10.27L12 22.27l-8.892-5.135V6.865L12 1.73z"/>
                </svg>
              </div>
              <h3 className="font-bold mb-2 text-white">TensorFlow Lite</h3>
              <p className="text-xs text-gray-400">Edge AI Models</p>
            </div>

            <div className="gradient-border rounded-xl p-6 text-center hover-lift card-3d card-dynamic" data-testid="tech-earth">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-depth">
                <span className="text-4xl">🌍</span>
              </div>
              <h3 className="font-bold mb-2 text-white">Earth Engine</h3>
              <p className="text-xs text-gray-400">Geospatial Analysis</p>
            </div>

            <div className="gradient-border rounded-xl p-6 text-center hover-lift card-3d card-dynamic" data-testid="tech-iot">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-depth">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 002 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold mb-2 text-white">Cloud IoT</h3>
              <p className="text-xs text-gray-400">Device Management</p>
            </div>

            <div className="gradient-border rounded-xl p-6 text-center hover-lift card-3d card-dynamic" data-testid="tech-firebase">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-depth">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z"/>
                </svg>
              </div>
              <h3 className="font-bold mb-2 text-white">Firebase</h3>
              <p className="text-xs text-gray-400">Real-time Data</p>
            </div>
          </div>

          {/* Google AI Tools */}
          <div className="section-fade-in">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 glass-effect px-4 py-2 rounded-full mb-4">
                <span className="text-2xl">🤖</span>
                <span className="text-sm font-semibold gradient-text">AI-Powered Intelligence</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Google <span className="gradient-text">AI Tools</span> Integrated
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="gradient-border rounded-2xl p-8 glass-effect hover-lift card-dynamic shimmer" data-testid="ai-tensorflow">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 pulse-glow">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0L1.608 6v12L12 24l10.392-6V6L12 0zm0 1.73l8.892 5.135v10.27L12 22.27l-8.892-5.135V6.865L12 1.73z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold mb-3 gradient-text">TensorFlow Lite</h4>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Edge AI optimization for real-time air quality prediction and system performance tuning directly on IoT devices
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-semibold">Edge Computing</span>
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-semibold">ML Models</span>
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-semibold">Real-time Processing</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="gradient-border rounded-2xl p-8 glass-effect hover-lift card-dynamic shimmer" data-testid="ai-earth-engine">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 pulse-glow" style={{animationDelay: '0.5s'}}>
                    <span className="text-4xl">🛰️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold mb-3 gradient-text">Google Earth Engine</h4>
                    <p className="text-gray-300 mb-4 leading-relaxed">
                      Geospatial analysis and deployment planning using satellite imagery to identify optimal unit placement zones
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">Satellite Data</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">Geospatial AI</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">Planning</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integration Benefits */}
          <div className="mt-16 section-fade-in">
            <div className="gradient-border rounded-2xl p-8 glass-effect">
              <h3 className="text-2xl font-bold mb-6 text-center gradient-text">Integration Benefits</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">⚡</div>
                  <h4 className="font-semibold text-accent-blue mb-2">Real-time Processing</h4>
                  <p className="text-sm text-gray-400">Sub-second AI inference at the edge</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="font-semibold text-accent-teal mb-2">Smart Deployment</h4>
                  <p className="text-sm text-gray-400">AI-optimized unit placement</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <h4 className="font-semibold text-accent-blue mb-2">Scalable Infrastructure</h4>
                  <p className="text-sm text-gray-400">Cloud-native architecture</p>
                </div>
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
