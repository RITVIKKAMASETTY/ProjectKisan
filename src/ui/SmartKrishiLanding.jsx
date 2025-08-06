import React, { useEffect, useRef, useState } from 'react';

const SmartKrishiLanding = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const dashboardRef = useRef(null);
  const benefitsRef = useRef(null);
  const voiceRef = useRef(null);
  const footerRef = useRef(null);
  const horizontalRef = useRef(null);
  const cursorRef = useRef(null);
  const magneticRefs = useRef([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAuthButtons, setShowAuthButtons] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Import GSAP from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
    script.onload = () => {
      const scrollTriggerScript = document.createElement('script');
      scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js';
      scrollTriggerScript.onload = () => {
        initializeAnimations();
      };
      document.head.appendChild(scrollTriggerScript);
    };
    document.head.appendChild(script);

    // Enhanced custom cursor with particles
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (window.gsap) {
        window.gsap.killTweensOf("*");
        if (window.ScrollTrigger) {
          window.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
      }
    };
  }, []);

  const initializeAnimations = () => {
    const { gsap } = window;
    gsap.registerPlugin(window.ScrollTrigger);

    // Enhanced cursor with morphing effects
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

    // Dynamic cursor morphing based on scroll
    gsap.to({}, {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(cursorRef.current, {
            background: `hsl(${180 + progress * 60}, 70%, 60%)`,
            duration: 0.1
          });
        }
      }
    });

    // Advanced magnetic effect with elastic deformation
    magneticRefs.current.forEach(ref => {
      if (ref) {
        const handleMouseEnter = (e) => {
          gsap.to(ref, { 
            scale: 1.08, 
            rotationY: 5,
            rotationX: 2,
            duration: 0.6, 
            ease: "elastic.out(1, 0.3)" 
          });
          gsap.to(cursorRef.current, { 
            scale: 3, 
            background: 'rgba(20, 184, 166, 0.8)',
            duration: 0.4 
          });
        };
        
        const handleMouseLeave = (e) => {
          gsap.to(ref, { 
            scale: 1, 
            x: 0, 
            y: 0, 
            rotationY: 0,
            rotationX: 0,
            duration: 0.6, 
            ease: "elastic.out(1, 0.3)" 
          });
          gsap.to(cursorRef.current, { 
            scale: 1, 
            background: 'rgb(20, 184, 166)',
            duration: 0.4 
          });
        };

        const handleMouseMove = (e) => {
          const rect = ref.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(ref, { 
            x: x * 0.15, 
            y: y * 0.15, 
            rotationY: x * 0.05,
            rotationX: -y * 0.05,
            duration: 0.4 
          });
        };

        ref.addEventListener('mouseenter', handleMouseEnter);
        ref.addEventListener('mouseleave', handleMouseLeave);
        ref.addEventListener('mousemove', handleMouseMove);
      }
    });

    // Spectacular hero section animations with liquid morphing
    const heroTl = gsap.timeline();
    heroTl
      .fromTo('.hero-bg', 
        { scale: 1.3, opacity: 0, rotation: 5, filter: 'blur(20px)' },
        { scale: 1, opacity: 1, rotation: 0, filter: 'blur(0px)', duration: 3, ease: 'power4.out' }
      )
      .fromTo('.hero-title', 
        { y: 200, opacity: 0, scale: 0.7, rotationX: 45 },
        { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 2.2, ease: 'elastic.out(1, 0.3)' }, '-=2.5'
      )
      .fromTo('.hero-subtitle', 
        { y: 150, opacity: 0, skewX: 15 },
        { y: 0, opacity: 1, skewX: 0, duration: 1.8, ease: 'power4.out' }, '-=1.8'
      )
      .fromTo('.hero-cta', 
        { y: 120, opacity: 0, scale: 0.6, rotationY: 180 },
        { y: 0, opacity: 1, scale: 1, rotationY: 0, duration: 1.6, ease: 'back.out(2)' }, '-=1.4'
      )
      .fromTo('.hero-stats', 
        { y: 100, opacity: 0, stagger: 0.1, rotationZ: 10 },
        { y: 0, opacity: 1, rotationZ: 0, duration: 1.2, ease: 'bounce.out', stagger: 0.2 }, '-=1'
      );

    // Liquid parallax effects with wave distortion
    gsap.to('.hero-bg', {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to('.hero-bg', {
            filter: `hue-rotate(${progress * 60}deg) saturate(${1 + progress * 0.5})`,
            duration: 0.1
          });
        }
      }
    });

    // Ultra-advanced floating animations with orbital motion
    gsap.to('.floating-crop-1', {
      motionPath: {
        path: "M0,0 Q100,50 0,100 Q-100,50 0,0",
        autoRotate: true,
      },
      duration: 8,
      ease: 'none',
      repeat: -1
    });

    gsap.to('.floating-crop-2', {
      motionPath: {
        path: "M0,0 Q-80,80 0,160 Q80,80 0,0",
        autoRotate: true,
      },
      duration: 10,
      ease: 'none',
      repeat: -1,
      delay: 2
    });

    gsap.to('.floating-crop-3', {
      motionPath: {
        path: "M0,0 Q120,-60 0,-120 Q-120,-60 0,0",
        autoRotate: true,
      },
      duration: 12,
      ease: 'none',
      repeat: -1,
      delay: 4
    });

    // Morphing text effects with liquid distortion
    gsap.utils.toArray('.morph-text').forEach(text => {
      gsap.fromTo(text,
        { opacity: 0, y: 120, scale: 0.8, filter: 'blur(10px)', skewY: 5 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          skewY: 0,
          duration: 1.8,
          ease: 'elastic.out(1, 0.4)',
          scrollTrigger: {
            trigger: text,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Spectacular feature cards with 3D flip
    gsap.fromTo('.feature-card', 
      { y: 150, opacity: 0, scale: 0.7, rotationY: 45, rotationX: 15 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotationY: 0,
        rotationX: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Epic horizontal scrolling with particle effects
    const horizontalContainer = horizontalRef.current;
    if (horizontalContainer) {
      const sections = gsap.utils.toArray('.benefit-panel');
      
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalContainer,
          pin: true,
          scrub: 3,
          snap: 1 / (sections.length - 1),
          end: () => `+=${horizontalContainer.offsetWidth * 3}`,
          onUpdate: (self) => {
            const progress = self.progress * 100;
            gsap.to('.progress-bar', { 
              width: `${progress}%`, 
              background: `linear-gradient(90deg, hsl(${180 + progress * 2}, 70%, 60%), hsl(${200 + progress * 2}, 70%, 60%))`,
              duration: 0.5 
            });
            
            // Advanced parallax for benefit icons with morphing
            gsap.to('.benefit-icon', {
              y: Math.sin(self.progress * Math.PI * 4) * 30,
              x: Math.cos(self.progress * Math.PI * 3) * 15,
              rotation: self.progress * 180,
              scale: 1 + Math.sin(self.progress * Math.PI * 8) * 0.2,
              filter: `hue-rotate(${self.progress * 180}deg) saturate(${1 + self.progress})`,
              duration: 0.2
            });
          }
        }
      });
    }

    // Ultra-dynamic steps animation with liquid morphing
    gsap.utils.toArray('.step-item').forEach((step, index) => {
      gsap.fromTo(step,
        { 
          x: index % 2 === 0 ? -400 : 400, 
          opacity: 0, 
          rotationY: index % 2 === 0 ? -30 : 30,
          scale: 0.7,
          filter: 'blur(15px)'
        },
        {
          x: 0,
          opacity: 1,
          rotationY: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 2.2,
          ease: 'elastic.out(1, 0.3)',
          scrollTrigger: {
            trigger: step,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Spectacular voice interface with advanced audio visualization
    gsap.timeline({
      scrollTrigger: {
        trigger: '.voice-section',
        start: 'top 70%',
        onEnter: () => {
          // Advanced wave animation with frequency modulation
          gsap.to('.voice-wave', {
            scaleY: () => 0.2 + Math.random() * 3,
            scaleX: () => 0.8 + Math.random() * 0.4,
            backgroundColor: () => `hsl(${Math.random() * 60 + 160}, 70%, 60%)`,
            duration: 0.4,
            ease: 'power2.inOut',
            repeat: -1,
            repeatRefresh: true,
            stagger: 0.05
          });

          // Ripple effect
          gsap.to('.voice-pulse', {
            scale: 3,
            opacity: 0,
            rotation: 360,
            duration: 3,
            ease: 'power2.out',
            repeat: -1,
            stagger: 0.6
          });

          // Morphing button with glow
          gsap.to('.voice-button', {
            boxShadow: '0 0 50px rgba(20, 184, 166, 0.8), inset 0 0 30px rgba(255, 255, 255, 0.2)',
            scale: 1.05,
            duration: 1.5,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true
          });
        },
        onLeave: () => {
          gsap.killTweensOf('.voice-wave');
          gsap.killTweensOf('.voice-pulse');
          gsap.killTweensOf('.voice-button');
        }
      }
    });

    // Cinematic image reveal with liquid distortion
    gsap.utils.toArray('.image-reveal').forEach(img => {
      gsap.fromTo(img,
        { 
          clipPath: 'polygon(0 100%, 0 100%, 0 100%, 0% 100%)', 
          scale: 1.3,
          filter: 'blur(20px) saturate(0)'
        },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
          scale: 1,
          filter: 'blur(0px) saturate(1)',
          duration: 2.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: img,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Advanced interactive card hover with physics
    gsap.utils.toArray('.interactive-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -12,
          scale: 1.05,
          rotationY: 3,
          rotationX: 2,
          filter: 'brightness(1.1) saturate(1.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)'
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          filter: 'brightness(1) saturate(1)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });

    // Dynamic background morphing based on scroll
    gsap.utils.toArray('section').forEach((section, index) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => {
            const colors = [
              'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
              'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
              'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)'
            ];
            gsap.to('body', {
              background: colors[index % colors.length],
              duration: 1.2,
              ease: 'power2.out'
            });
          }
        }
      });
    });

    // Spectacular loading animation for elements
    gsap.utils.toArray('.load-animate').forEach((element, index) => {
      gsap.fromTo(element,
        { 
          opacity: 0, 
          y: 50, 
          scale: 0.8, 
          rotationZ: 10,
          filter: 'blur(10px)'
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationZ: 0,
          filter: 'blur(0px)',
          duration: 1.2,
          delay: index * 0.15,
          ease: 'elastic.out(1, 0.4)'
        }
      );
    });

    // Particle system for enhanced visual appeal
    const createParticles = () => {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
          position: fixed;
          width: 4px;
          height: 4px;
          background: rgba(20, 184, 166, 0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        `;
        document.body.appendChild(particle);

        gsap.set(particle, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        });

        gsap.to(particle, {
          y: `-=${Math.random() * 500 + 200}`,
          x: `+=${(Math.random() - 0.5) * 200}`,
          opacity: 0,
          duration: Math.random() * 3 + 2,
          ease: 'power2.out',
          repeat: -1,
          delay: Math.random() * 2,
          onRepeat: () => {
            gsap.set(particle, {
              y: window.innerHeight + 10,
              x: Math.random() * window.innerWidth,
              opacity: 0.6
            });
          }
        });
      }
    };

    createParticles();

    // Advanced text typing effect
    gsap.utils.toArray('.typing-text').forEach(text => {
      const content = text.textContent;
      text.textContent = '';
      
      gsap.fromTo(text, 
        { opacity: 0 },
        { 
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: text,
            start: 'top 90%',
            onEnter: () => {
              let i = 0;
              const typeInterval = setInterval(() => {
                text.textContent += content[i];
                i++;
                if (i >= content.length) {
                  clearInterval(typeInterval);
                }
              }, 50);
            }
          }
        }
      );
    });
  };

  const addToMagneticRefs = (el) => {
    if (el && !magneticRefs.current.includes(el)) {
      magneticRefs.current.push(el);
    }
  };

  const handleCtaClick = () => {
    if (window.gsap) {
      window.gsap.to('.hero-cta', {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          setShowAuthButtons(true);
          window.gsap.fromTo('.auth-buttons', 
            { opacity: 0, y: 20, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.3)' }
          );
        }
      });
    } else {
      setShowAuthButtons(true);
    }
  };

  const handleAuthClick = (type) => {
    if (window.gsap) {
      window.gsap.to(`.${type}-btn`, {
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          // Navigate to respective route
          window.location.href = `/${type}`;
        }
      });
    } else {
      window.location.href = `/${type}`;
    }
  };

  const features = [
    { title: 'Crop Monitoring', desc: 'AI-powered real-time crop health analysis', image: '🌱', emoji: '🔍' },
    { title: 'Smart Irrigation', desc: 'Automated precision water management', image: '💧', emoji: '🤖' },
    { title: 'Weather Insights', desc: 'Hyper-local weather forecasting', image: '☀️', emoji: '🌤️' },
    { title: 'Yield Prediction', desc: 'ML-driven harvest optimization', image: '📈', emoji: '🎯' },
    { title: 'Pest Control', desc: 'Early detection & prevention system', image: '🛡️', emoji: '🔬' },
    { title: 'Soil Analysis', desc: 'Real-time soil health monitoring', image: '🌍', emoji: '🧪' },
    { title: 'Analytics', desc: 'Comprehensive farm intelligence', image: '📊', emoji: '📋' },
    { title: 'Expert Network', desc: 'Connect with agricultural specialists', image: '👥', emoji: '🤝' },
    { title: 'Automation', desc: 'Smart farm automation suite', image: '⚡', emoji: '🔄' }
  ];

  const steps = [
    { step: '01', title: 'Deploy Sensors', desc: 'Install IoT sensors across your farmland for comprehensive monitoring', image: '📡' },
    { step: '02', title: 'Connect Platform', desc: 'Seamlessly integrate all sensors with SmartKrishi dashboard', image: '🔗' },
    { step: '03', title: 'AI Analysis', desc: 'Receive real-time insights and AI-powered recommendations', image: '🤖' },
    { step: '04', title: 'Optimize Growth', desc: 'Implement data-driven farming strategies for maximum yield', image: '🚀' }
  ];

  const benefits = [
    { title: '40% Water Savings', desc: 'Precision irrigation reduces water waste', icon: '💧' },
    { title: '25% Yield Increase', desc: 'Optimized growing conditions boost production', icon: '📈' },
    { title: '60% Pest Reduction', desc: 'Early detection prevents crop damage', icon: '🛡️' },
    { title: '50% Labor Efficiency', desc: 'Automation reduces manual work', icon: '🤖' },
    { title: '30% Cost Reduction', desc: 'Smart resource management cuts expenses', icon: '💰' }
  ];

  return (
    <>
      {/* Load Quicksand and Nunito Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      
      {/* Enhanced Custom Cursor */}
      <div 
        ref={cursorRef}
        className="fixed w-4 h-4 bg-teal-500 rounded-full pointer-events-none z-50 mix-blend-difference transition-all duration-300"
        style={{ 
          position: 'fixed', 
          zIndex: 9999,
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.8) 0%, rgba(20, 184, 166, 0.4) 70%, transparent 100%)',
          filter: 'blur(1px)'
        }}
      />

      <div className="bg-white text-gray-900 overflow-hidden relative" style={{ fontFamily: '"Nunito", -apple-system, BlinkMacSystemFont, sans-serif' }}>
        {/* Enhanced Navigation */}
        <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3 load-animate" ref={addToMagneticRefs}>
                <div className="text-2xl">🌱</div>
                <span className="text-xl font-bold text-teal-600 typing-text" style={{ fontFamily: '"Quicksand", sans-serif' }}>SmartKrishi</span>
              </div>
              
              <div className="hidden md:flex space-x-8">
                {['Features', 'Process', 'Benefits', 'Dashboard'].map((item, index) => (
                  <a 
                    key={index}
                    href={`#${item.toLowerCase()}`} 
                    className="nav-item text-gray-700 hover:text-teal-600 transition-all duration-300 relative group font-medium load-animate"
                    ref={addToMagneticRefs}
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500 group-hover:w-full transition-all duration-500"></span>
                  </a>
                ))}
              </div>

              <button 
                className="md:hidden text-xl text-gray-700 load-animate"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                ref={addToMagneticRefs}
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </nav>

        {/* Enhanced Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
          {/* Enhanced Background elements */}
          <div className="hero-bg absolute inset-0">
            <div className="absolute top-20 left-10 text-6xl opacity-20 floating-crop-1">🌾</div>
            <div className="absolute top-40 right-20 text-5xl opacity-20 floating-crop-2">🌱</div>
            <div className="absolute bottom-20 left-1/3 text-7xl opacity-20 floating-crop-3">🚜</div>
            <div className="absolute top-1/3 right-1/4 text-4xl opacity-20 floating-crop-1">🌿</div>
            <div className="absolute bottom-1/3 right-10 text-5xl opacity-20 floating-crop-2">🌳</div>
            
            {/* Animated gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-teal-400/30 to-blue-400/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-gradient-to-r from-green-400/30 to-teal-400/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="hero-content relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="hero-title mb-8">
              <h1 className="morph-text text-6xl md:text-8xl lg:text-9xl font-black mb-6 text-gray-900 leading-tight" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                Smart Farming<br />
                <span className="text-teal-600">Starts Here</span>
              </h1>
            </div>
            
            <div className="hero-subtitle mb-12">
              <p className="morph-text text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
                SmartKrishi is a smart agriculture platform that leverages <span className="text-teal-600 font-semibold">AI</span> and real-time data to help farmers make better decisions—from crop planning to market selling.
              </p>
            </div>

            <div className="hero-cta mb-16">
              {!showAuthButtons ? (
                <button 
                  onClick={handleCtaClick}
                  className="group px-10 py-4 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  ref={addToMagneticRefs}
                >
                  <span className="flex items-center space-x-2">
                    <span>Start Growing Smarter</span>
                    <span className="text-xl group-hover:translate-x-2 transition-transform duration-300">🚀</span>
                  </span>
                </button>
              ) : (
                <div className="auth-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => handleAuthClick('login')}
                    className="login-btn group px-10 py-4 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[140px]"
                    ref={addToMagneticRefs}
                  >
                    <span className="flex items-center space-x-2">
                      <span>🔑</span>
                      <span>Login</span>
                    </span>
                  </button>
                  <button 
                    onClick={() => handleAuthClick('signup')}
                    className="signup-btn group px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[140px]"
                    ref={addToMagneticRefs}
                  >
                    <span className="flex items-center space-x-2">
                      <span>✨</span>
                      <span>Sign Up</span>
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Enhanced Hero Stats */}
            <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '500K+', label: 'Acres Monitored', emoji: '🌾', color: 'from-green-400 to-green-600' },
                { value: '25%', label: 'Yield Increase', emoji: '📈', color: 'from-blue-400 to-blue-600' },
                { value: '40%', label: 'Water Saved', emoji: '💧', color: 'from-cyan-400 to-cyan-600' },
                { value: '24/7', label: 'AI Monitoring', emoji: '🤖', color: 'from-purple-400 to-purple-600' }
              ].map((stat, index) => (
                <div key={index} className="interactive-card text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-500">
                  <div className="text-3xl mb-3">{stat.emoji}</div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`} style={{ fontFamily: '"Quicksand", sans-serif' }}>{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section id="features" ref={featuresRef} className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="morph-text text-4xl md:text-6xl font-bold mb-6 text-gray-900" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Features</span>
              </h2>
              <p className="morph-text text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Comprehensive AI-powered agricultural solutions designed to revolutionize modern farming practices
              </p>
            </div>

            <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="feature-card interactive-card group p-8 bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:border-teal-300 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden relative"
                  ref={addToMagneticRefs}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <span className="text-4xl group-hover:scale-125 transition-transform duration-500">{feature.image}</span>
                        <span className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300">{feature.emoji}</span>
                      </div>
                      <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-teal-700 transition-colors duration-300" style={{ fontFamily: '"Quicksand", sans-serif' }}>{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced How It Works */}
        <section id="process" ref={howItWorksRef} className="py-24 bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="morph-text text-4xl md:text-6xl font-bold mb-6 text-gray-900" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Works</span>
              </h2>
              <p className="morph-text text-xl text-gray-600 max-w-3xl mx-auto">
                Four simple steps to transform your farming operation with cutting-edge technology
              </p>
            </div>

            <div className="space-y-20">
              {steps.map((step, index) => (
                <div key={index} className="step-item">
                  <div className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:space-x-16 space-y-12 lg:space-y-0`}>
                    <div className="flex-1">
                      <div className="image-reveal w-full h-64 bg-gradient-to-br from-teal-100 via-blue-100 to-green-100 rounded-2xl mb-8 flex items-center justify-center text-6xl border border-teal-200/50 shadow-lg overflow-hidden relative">
                        {/* Animated background particles */}
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-200/20 to-blue-200/20"></div>
                        <span className="relative z-10 transform hover:scale-110 transition-transform duration-500">{step.image}</span>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900" style={{ fontFamily: '"Quicksand", sans-serif' }}>{step.title}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed mb-4">{step.desc}</p>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-0.5 bg-gradient-to-r from-teal-500 to-blue-500"></div>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600 font-semibold">Step {step.step}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-r from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-2xl transform hover:scale-110 transition-all duration-500" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                        {step.step}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Benefits Horizontal Scroll */}
        <section id="benefits" ref={horizontalRef} className="horizontal-container">
          <div className="flex h-screen">
            {benefits.map((benefit, index) => (
              <div key={index} className={`benefit-panel min-w-screen h-full flex items-center justify-center ${
                index === 0 ? 'bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-700' :
                index === 1 ? 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700' :
                index === 2 ? 'bg-gradient-to-br from-teal-700 via-green-700 to-emerald-700' :
                index === 3 ? 'bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-800' :
                'bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700'
              } relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Animated background elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-32 right-32 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-8 text-center text-white">
                  <div className="benefit-icon text-8xl mb-12 transform hover:scale-110 transition-transform duration-500">{benefit.icon}</div>
                  <h3 className="text-5xl md:text-7xl font-bold mb-8 leading-tight" style={{ fontFamily: '"Quicksand", sans-serif' }}>{benefit.title}</h3>
                  <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">{benefit.desc}</p>
                  <div className="inline-flex items-center space-x-4 bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition-all duration-500">
                    <span className="text-4xl">{benefit.icon}</span>
                    <div className="text-left">
                      <div className="text-white/80 text-sm">Impact Metric</div>
                      <div className="text-white font-bold text-2xl" style={{ fontFamily: '"Quicksand", sans-serif' }}>{benefit.title.split(' ')[0]}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 border border-white/20">
              <div className="w-64 h-2 bg-gray-300/30 rounded-full overflow-hidden">
                <div className="progress-bar h-full bg-gradient-to-r from-white to-teal-300 rounded-full w-0 shadow-lg"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Voice Interface */}
        <section ref={voiceRef} className="voice-section py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="morph-text text-4xl md:text-6xl font-bold mb-6 text-gray-900" style={{ fontFamily: '"Quicksand", sans-serif' }}>
              Multilingual <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-purple-600 to-blue-600">Voice</span> AI
            </h2>
            <p className="morph-text text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
              Communicate with your smart farm using advanced voice recognition in multiple languages with natural conversation flow
            </p>

            <div className="relative inline-block mb-16">
              <button
                className="voice-button group relative w-40 h-40 bg-gradient-to-r from-teal-600 via-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:from-teal-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-500 shadow-2xl transform hover:scale-105"
                onClick={() => setIsPlaying(!isPlaying)}
                ref={addToMagneticRefs}
              >
                {isPlaying ? (
                  <div className="flex items-center space-x-1">
                    {Array.from({length: 4}).map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 h-8 bg-white rounded-full animate-pulse" 
                        style={{ animationDelay: `${i * 0.1}s` }}
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white text-4xl ml-2 transform group-hover:scale-110 transition-transform duration-300">🎤</div>
                )}
              </button>
              
              <div className="absolute inset-0 flex items-center justify-center">
                {Array.from({length: 12}).map((_, i) => (
                  <div 
                    key={i} 
                    className="voice-wave w-1 bg-gradient-to-t from-teal-400 to-purple-400 rounded-full mx-0.5" 
                    style={{height: `${15 + i * 3}px`}}
                  ></div>
                ))}
              </div>
              
              {Array.from({length: 4}).map((_, i) => (
                <div 
                  key={i} 
                  className={`voice-pulse absolute inset-0 rounded-full border-2 border-gradient-to-r from-teal-400/40 to-purple-400/40`} 
                  style={{ animationDelay: `${i * 0.7}s` }}
                ></div>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto mb-16">
              {[
                { lang: 'English', flag: '🇺🇸', phrase: 'Show crop status', color: 'from-blue-400 to-blue-600' },
                { lang: 'हिंदी', flag: '🇮🇳', phrase: 'फसल की स्थिति दिखाएं', color: 'from-orange-400 to-orange-600' },
                { lang: 'বাংলা', flag: '🇧🇩', phrase: 'ফসলের অবস্থা দেখান', color: 'from-green-400 to-green-600' },
                { lang: 'தமிழ்', flag: '🇮🇳', phrase: 'பயிர் நிலையைக் காட்டு', color: 'from-red-400 to-red-600' },
                { lang: 'తెలుగు', flag: '🇮🇳', phrase: 'పంట స్థితిని చూపించు', color: 'from-purple-400 to-purple-600' }
              ].map((item, index) => (
                <div key={index} className="interactive-card px-4 py-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200/50 hover:border-teal-300 hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden relative" ref={addToMagneticRefs}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-3 transform hover:scale-110 transition-transform duration-300">{item.flag}</div>
                    <div className={`font-semibold mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} style={{ fontFamily: '"Quicksand", sans-serif' }}>{item.lang}</div>
                    <div className="text-gray-600 text-xs italic">"{item.phrase}"</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { command: '"Show crop health analytics"', response: 'Displaying comprehensive crop health dashboard with AI insights...', icon: '🌱', color: 'from-green-400 to-green-600' },
                { command: '"Start precision irrigation"', response: 'Activating smart irrigation system with optimal water distribution...', icon: '💧', color: 'from-blue-400 to-blue-600' },
                { command: '"Generate weather forecast"', response: 'Analyzing meteorological data for 14-day precision forecast...', icon: '🌤️', color: 'from-yellow-400 to-orange-600' }
              ].map((sample, index) => (
                <div key={index} className="interactive-card p-8 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:border-teal-300 hover:shadow-2xl transition-all duration-500 overflow-hidden relative" ref={addToMagneticRefs}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${sample.color} opacity-0 hover:opacity-5 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-6 transform hover:scale-110 transition-transform duration-300">{sample.icon}</div>
                    <div className={`bg-gradient-to-r ${sample.color} bg-opacity-10 border border-current/20 p-4 rounded-lg mb-4`}>
                      <p className={`font-semibold bg-gradient-to-r ${sample.color} bg-clip-text text-transparent`} style={{ fontFamily: '"Quicksand", sans-serif' }}>{sample.command}</p>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{sample.response}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Security & Integration */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="morph-text text-4xl md:text-6xl font-bold mb-6 text-gray-900" style={{ fontFamily: '"Quicksand", sans-serif' }}>
                Security & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Integration</span>
              </h2>
              <p className="morph-text text-xl text-gray-600 max-w-3xl mx-auto">
                Enterprise-grade security with seamless third-party integrations and military-level encryption
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                {[
                  { icon: '🛡️', title: 'Military-Grade Security', desc: 'Advanced encryption protects your valuable farm data with 256-bit AES encryption', color: 'bg-red-100 text-red-600', gradient: 'from-red-400 to-red-600' },
                  { icon: '📡', title: 'Real-time Connectivity', desc: 'Always connected via multiple network protocols with 99.99% uptime guarantee', color: 'bg-blue-100 text-blue-600', gradient: 'from-blue-400 to-blue-600' },
                  { icon: '🌐', title: 'Global Integration Hub', desc: 'Connects with 1000+ agricultural tools and platforms seamlessly', color: 'bg-purple-100 text-purple-600', gradient: 'from-purple-400 to-purple-600' },
                  { icon: '🚁', title: 'Aerial Intelligence', desc: 'Advanced drone and satellite monitoring with real-time image analysis', color: 'bg-orange-100 text-orange-600', gradient: 'from-orange-400 to-orange-600' }
                ].map((item, index) => (
                  <div key={index} className="interactive-card flex items-start space-x-6 p-6 bg-white/90 backdrop-blur-sm rounded-2xl hover:bg-white transition-all duration-500 shadow-lg hover:shadow-2xl overflow-hidden relative" ref={addToMagneticRefs}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 hover:opacity-5 transition-opacity duration-300`}></div>
                    <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center relative z-10 transform hover:scale-110 transition-transform duration-300`}>
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <div className="flex-1 relative z-10">
                      <h4 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: '"Quicksand", sans-serif' }}>{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="image-reveal">
                <div className="bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 rounded-3xl p-8 border border-teal-200/50 shadow-2xl">
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { emoji: '🛡️', color: 'hover:border-red-300 hover:bg-red-50' },
                      { emoji: '🌐', color: 'hover:border-blue-300 hover:bg-blue-50' },
                      { emoji: '📱', color: 'hover:border-green-300 hover:bg-green-50' },
                      { emoji: '🚁', color: 'hover:border-orange-300 hover:bg-orange-50' },
                      { emoji: '📡', color: 'hover:border-purple-300 hover:bg-purple-50' },
                      { emoji: '☁️', color: 'hover:border-cyan-300 hover:bg-cyan-50' },
                      { emoji: '🔒', color: 'hover:border-gray-300 hover:bg-gray-50' },
                      { emoji: '📊', color: 'hover:border-indigo-300 hover:bg-indigo-50' },
                      { emoji: '🤖', color: 'hover:border-pink-300 hover:bg-pink-50' }
                    ].map((item, i) => (
                      <div key={i} className={`h-16 bg-white rounded-2xl border border-gray-200 flex items-center justify-center ${item.color} transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-lg`}>
                        <span className="text-2xl">{item.emoji}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-lg">
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-purple-600 font-bold text-lg mb-2" style={{ fontFamily: '"Quicksand", sans-serif' }}>🔗 Integrated Ecosystem</p>
                    <div className="flex justify-center space-x-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-teal-100 to-teal-200 text-teal-700 rounded-full text-sm font-medium">Secure</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm font-medium">Scalable</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-full text-sm font-medium">Smart</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer ref={footerRef} className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-teal-500/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-32 right-32 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-6" ref={addToMagneticRefs}>
                  <div className="text-3xl">🌱</div>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400" style={{ fontFamily: '"Quicksand", sans-serif' }}>SmartKrishi</span>
                </div>
                <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
                  Revolutionizing agriculture with AI-powered insights, IoT integration, and sustainable farming solutions for the future of food production.
                </p>
                <div className="flex space-x-4">
                  {[
                    { emoji: '🌱', label: 'Sustainable', color: 'hover:border-green-500 hover:bg-green-500/10' },
                    { emoji: '📱', label: 'Mobile First', color: 'hover:border-blue-500 hover:bg-blue-500/10' },
                    { emoji: '🤖', label: 'AI Powered', color: 'hover:border-purple-500 hover:bg-purple-500/10' },
                    { emoji: '🌍', label: 'Global Reach', color: 'hover:border-teal-500 hover:bg-teal-500/10' }
                  ].map((social, index) => (
                    <div key={index} className={`interactive-card w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700 ${social.color} transition-all duration-300 cursor-pointer transform hover:scale-110`} ref={addToMagneticRefs}>
                      <span className="text-lg" title={social.label}>{social.emoji}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 text-lg" style={{ fontFamily: '"Quicksand", sans-serif' }}>Platform</h4>
                <ul className="space-y-3 text-gray-400">
                  {[
                    { icon: '🚀', text: 'Features', color: 'hover:text-teal-400' },
                    { icon: '💰', text: 'Pricing', color: 'hover:text-blue-400' },
                    { icon: '📚', text: 'API Docs', color: 'hover:text-purple-400' },
                    { icon: '🔌', text: 'Integration', color: 'hover:text-green-400' },
                    { icon: '📱', text: 'Mobile App', color: 'hover:text-orange-400' }
                  ].map((item, index) => (
                    <li key={index}>
                      <a href="#" className={`${item.color} transition-colors duration-300 flex items-center space-x-2 group`}>
                        <span className="group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                        <span>{item.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-lg" style={{ fontFamily: '"Quicksand", sans-serif' }}>Support</h4>
                <ul className="space-y-3 text-gray-400">
                  {[
                    { icon: '❓', text: 'Help Center', color: 'hover:text-yellow-400' },
                    { icon: '👥', text: 'Community', color: 'hover:text-green-400' },
                    { icon: '📞', text: 'Contact Us', color: 'hover:text-blue-400' },
                    { icon: '🎓', text: 'Training', color: 'hover:text-purple-400' },
                    { icon: '🛠️', text: '24/7 Support', color: 'hover:text-red-400' }
                  ].map((item, index) => (
                    <li key={index}>
                      <a href="#" className={`${item.color} transition-colors duration-300 flex items-center space-x-2 group`}>
                        <span className="group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                        <span>{item.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="border-t border-gray-800 mt-12 pt-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: '500K+', label: 'Acres Monitored', emoji: '🌾', color: 'from-green-400 to-green-600' },
                  { value: '15K+', label: 'Happy Farmers', emoji: '👨‍🌾', color: 'from-blue-400 to-blue-600' },
                  { value: '99.9%', label: 'Uptime', emoji: '⚡', color: 'from-yellow-400 to-orange-600' },
                  { value: '50+', label: 'Countries', emoji: '🌍', color: 'from-purple-400 to-pink-600' }
                ].map((stat, index) => (
                  <div key={index} className="interactive-card p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-500 hover:bg-gray-700/50" ref={addToMagneticRefs}>
                    <div className="text-3xl mb-2 transform hover:scale-110 transition-transform duration-300">{stat.emoji}</div>
                    <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`} style={{ fontFamily: '"Quicksand", sans-serif' }}>{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Final Footer */}
            <div className="border-t border-gray-800 mt-12 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-gray-400">
                  <p>&copy; 2025 SmartKrishi. All rights reserved. Made with 💚 for farmers worldwide.</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-teal-400">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">All Services Operational</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <span className="text-sm">AI Systems Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SmartKrishiLanding;