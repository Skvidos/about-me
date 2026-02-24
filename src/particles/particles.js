// Mobile-optimized particles initialization
document.addEventListener('DOMContentLoaded', function () {
  // Detect if on mobile device
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isSmallMobile = window.matchMedia('(max-width: 480px)').matches;

  // Skip particles on very small mobile devices to save battery/performance
  if (isSmallMobile) {
    // Just show placeholder or hide entirely
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
      particlesContainer.style.display = 'none';
    }
    return;
  }

  // Initialize particles with device-optimized settings
  if (window.particlesJS) {
    const particleCount = isMobile ? 25 : 40;
    const particleSpeed = isMobile ? 0.3 : 0.5;
    const animationSpeed = isMobile ? 0.3 : 1;

    particlesJS("particles-js", {
      "particles": {
        "number": {
          "value": particleCount,
          "density": {
            "enable": true,
            "value_area": isMobile ? 1000 : 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.7,
          "random": true,
          "anim": {
            "enable": true,
            "speed": animationSpeed,
            "opacity_min": 0.2,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 4,
            "size_min": 0.3,
            "sync": false
          }
        },
        "line_linked": {
          "enable": false,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": particleSpeed,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 600
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "bubble"
          },
          "onclick": {
            "enable": isMobile ? false : true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 400,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 250,
            "size": 0,
            "duration": 2,
            "opacity": 0,
            "speed": 3
          },
          "repulse": {
            "distance": 400,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });

    const updateInterval = isMobile ? 1000 : 500;

    if (countParticles && window.pJSDom && window.pJSDom[0]) {
      setInterval(() => {
        if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
          countParticles.innerText = window.pJSDom[0].pJS.particles.array.length;
        }
      }, updateInterval);
    }
  }
});