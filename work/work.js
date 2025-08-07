document.addEventListener('DOMContentLoaded', async () => {
  // Functional utilities (duplicated from main.js for independence)
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

  // Mobile menu functionality (duplicated for this page)
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

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);

    const mobileMenuLinks = Array.from(mobileMenu?.querySelectorAll('a') || []);
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

  // Fixed createGlassCard: removed fixed height (h-64) to auto-size, added overflow-auto for long content
  const createGlassCard = (project) => {
    return createElement('div', {
      className: 'relative perspective-1000 group'
    }, [
      createElement('div', {
        className: 'w-full min-h-[16rem] bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg border border-white border-opacity-20 p-6 transform transition-all duration-500 group-hover:rotate-y-10 group-hover:scale-105 overflow-auto'
      }, [
        createElement('h3', { className: 'text-xl font-bold text-gray-800 mb-2', textContent: project.name }),
        createElement('p', { className: 'text-gray-600 mb-4', textContent: project.description }),
        createElement('p', { className: 'text-sm text-gray-500', textContent: `Status: ${project.status}` }),
        createElement('p', { className: 'text-sm text-gray-500', textContent: `Technologies: ${project.technologies}` }),
        createElement('a', { href: project.repo, className: 'mt-4 inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg', textContent: 'View Project' })
      ])
    ]);
  };

  const renderCards = (projects) => {
    const container = document.getElementById('works-container');
    if (!container) return;
    container.innerHTML = ''; // Clear existing
    projects.forEach(project => {
      const card = createGlassCard(project);
      container.appendChild(card);
    });
  };

  try {
    const response = await fetch('projects.json');
    const projects = await response.json();
    renderCards(projects);
  } catch (error) {
    console.error('Error loading projects:', error);
  }


  renderCards(projects);
  setupMobileMenu()
});



