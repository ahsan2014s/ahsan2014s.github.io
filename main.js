const createElement = (tag, props = {}, children = []) => {
  const element = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'className') element.className = value;
    else if (key === 'innerHTML') element.innerHTML = value;
    else if (key === 'textContent') element.textContent = value;
    else element.setAttribute(key, value);
  });
  children.forEach(child => element.appendChild(child));
  return element;
};

const addEventListeners = (elements, event, handler) => {
  elements.forEach(el => el.addEventListener(event, handler));
};

const toggleClass = (element, className, condition) => {
  element.classList.toggle(className, condition);
};

// Mobile menu functionality
const setupMobileMenu = () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
    toggleClass(mobileMenuBtn, 'open', isMenuOpen);
    toggleClass(mobileMenu, 'opacity-0', !isMenuOpen);
    toggleClass(mobileMenu, '-translate-y-2', !isMenuOpen);
    toggleClass(mobileMenu, 'pointer-events-none', !isMenuOpen);
    toggleClass(mobileMenu, 'opacity-100', isMenuOpen);
    toggleClass(mobileMenu, 'translate-y-0', isMenuOpen);
    toggleClass(mobileMenu, 'pointer-events-auto', isMenuOpen);
  };

  mobileMenuBtn.addEventListener('click', toggleMenu);

  const mobileMenuLinks = Array.from(mobileMenu.querySelectorAll('a'));
  addEventListeners(mobileMenuLinks, 'click', () => {
    isMenuOpen = false;
    toggleMenu();
  });

  document.addEventListener('click', (e) => {
    if (isMenuOpen && !mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      isMenuOpen = false;
      toggleMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      isMenuOpen = false;
      toggleMenu();
    }
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (window.innerWidth >= 768 && isMenuOpen) {
        isMenuOpen = false;
        toggleMenu();
      }
    }, 250);
  });
};

// Contact modal
const showContactModal = () => {
  const modal = createElement('div', {
    className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm'
  });

  modal.innerHTML = `
    <div class="glass-effect-menu rounded-lg p-6 sm:p-8 max-w-md mx-4 transform scale-0 transition-transform duration-300">
      <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Let's Connect!</h3>
      <p class="text-gray-600 mb-6 text-sm sm:text-base">Thanks for your interest! Here are the best ways to reach me:</p>
      <div class="space-y-3">
        <div class="flex items-center space-x-3">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
          <span class="text-gray-700 text-sm sm:text-base">anikahsan1225@protonmail.com</span>
        </div>
        <div class="flex items-center space-x-3">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
          </svg>
          <span class="text-gray-700 text-sm sm:text-base"></span>
        </div>
        <div class="flex items-center space-x-3">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span class="text-gray-700 text-sm sm:text-base"></span>
        </div>
      </div>
      <button class="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300 text-sm sm:text-base" onclick="this.closest('.fixed').remove()">
        Close
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  setTimeout(() => {
    modal.querySelector('div').style.transform = 'scale(1)';
  }, 10);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};

// Global variable for projects data
let projectsData = [];

// Function to fetch JSON
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const routes = {
  '/': async () => {
    if (projectsData.length === 0) {
      projectsData = await fetchData('work/projects.json');
    }
    const top3 = projectsData.slice(0, 3);
    renderWorkGrid(top3);
  },
  '/research': () => {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = '<div class="text-center p-8"><h2>Research Section</h2><p>Content coming soon.</p></div>';
  },
  '/work': async () => {
    const mainContent = document.getElementById('main-content');
    if (projectsData.length === 0) {
      projectsData = await fetchData('work/projects.json');
    }
    mainContent.innerHTML = `
      <div class="flex flex-col items-center justify-center min-h-screen pt-20 px-2 sm:px-4 pb-16">
        <h1 class="text-3xl font-bold text-gray-800 mb-8">My Works</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl w-full">
          ${projectsData.map(createGlassCard).join('')}
        </div>
      </div>
    `;
  };
const router = () => {
  const hash = window.location.hash.slice(1) || '/';
  const path = hash.startsWith('/') ? hash : `/${hash}`;
  const routeHandler = routes[path] || routes['/'];
  routeHandler();
};

// Setup router
const setupRouter = () => {
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
};

// Function to render top 3 sticky notes on home
const renderWorkGrid = (projects) => {
  const grid = document.getElementById('work-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const colors = ['bg-yellow-600', 'bg-purple-600', 'bg-red-600'];
  projects.forEach((proj, index) => {
    const note = document.createElement('div');
    note.className = 'sticky-note p-3 sm:p-4 rounded-lg relative';
    note.dataset.project = proj.name.toLowerCase().replace(/\s+/g, '-');
    note.innerHTML = `
      <h4 class="font-semibold text-gray-800 text-xs sm:text-sm mb-1 sm:mb-2">${proj.name}</h4>
      <p class="text-gray-700 text-xs">${proj.description}</p>
      <div class="absolute top-2 right-2 w-2 h-2 ${colors[index % colors.length]} rounded-full"></div>
    `;
    grid.appendChild(note);
  });

  setupProjects();
};

// Project modal
const showProjectModal = (projectKey) => {
  const details = projectsData.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === projectKey)

  const modal = createElement('div', {
    className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm px-4'
  });

  modal.innerHTML = `
    <div class="glass-effect-menu rounded-lg p-6 sm:p-8 max-w-md w-full transform scale-0 transition-transform duration-300">
      <h3 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4">${details.name}</h3>
      <p class="text-gray-600 mb-6 text-sm sm:text-base">${details.description}</p>
      <div class="space-y-2 mb-6">
        <p class="text-gray-500 text-xs sm:text-sm"><strong>Status:</strong> ${details.status}</p>
        <p class="text-gray-500 text-xs sm:text-sm"><strong>Technologies:</strong> ${details.technologies}</p>
        <p class="text-gray-500 text-xs sm:text-sm"><strong>Duration:</strong> ${details.duration}</p>
      </div>
      <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <button class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 text-sm sm:text-base" onclick="this.closest('.fixed').remove()">
          Close
        </button>
        <button class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 text-sm sm:text-base" onclick="window.open('${details.repo}', '_blank')">
          View Project
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  setTimeout(() => {
    modal.querySelector('div').style.transform = 'scale(1)';
  }, 10);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
};

// Setup project interactions
const setupProjects = () => {
  const stickyNotes = Array.from(document.querySelectorAll('.sticky-note'));
  addEventListeners(stickyNotes, 'click', (e) => {
    const projectKey = e.currentTarget.dataset.project;
    showProjectModal(projectKey);
  });

  addEventListeners(stickyNotes, 'mouseenter', (e) => {
    e.currentTarget.style.zIndex = '20';
  });

  addEventListeners(stickyNotes, 'mouseleave', (e) => {
    e.currentTarget.style.zIndex = '';
  });
};

// Scroll animations
const setupScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.slide-in').forEach(el => observer.observe(el));
};

const setupSmoothScrolling = () => {
  const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
  addEventListeners(anchors, 'click', (e) => {
    e.preventDefault();
    const target = document.querySelector(e.currentTarget.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
};

// Close modals on Escape
const setupModalClose = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.fixed.inset-0').forEach(modal => modal.remove());
    }
  });
};

const createGlassCard = (item) => `
  <div class="relative perspective-1000 group">
    <div class="w-full h-64 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg border border-white border-opacity-20 p-6 transform transition-all duration-500 group-hover:rotate-y-10 group-hover:scale-105">
      <h3 class="text-xl font-bold text-gray-800 mb-2">${item.name}</h3>
      <p class="text-gray-600 mb-4">${item.description}</p>
      <p class="text-sm text-gray-500">Status: ${item.status}</p>
      <p class="text-sm text-gray-500">Technologies: ${item.technologies}</p>
      <a href="${item.repo}" class="mt-4 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg">View Project</a>
    </div>
  </div>
`;

// Loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  document.getElementById('contact-btn').addEventListener('click', showContactModal);
  setupProjects();
  setupScrollAnimations();
  setupSmoothScrolling();
  setupRouter();
  setupModalClose();
  router();
});


