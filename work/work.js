document.addEventListener('DOMContentLoaded', async () => {
  const createElement = (tag, props = {}, children = []) => {
    const element = document.createElement(tag);
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'className') element.className = value;
      else if (key === 'textContent') element.textContent = value;
      else element.setAttribute(key, value);
    });
    children.forEach(child => element.appendChild(child));
    return element;
  };

  const createGlassCard = (project) => {
    return createElement('div', {
      className: 'relative perspective-1000 group'
    }, [
      createElement('div', {
        className: 'w-full h-64 bg-white bg-opacity-10 backdrop-blur-md rounded-xl shadow-lg border border-white border-opacity-20 p-6 transform transition-all duration-500 group-hover:rotate-y-10 group-hover:scale-105'
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
    const cards = projects.map(createGlassCard);
    cards.forEach(card => container.appendChild(card));
  };

  try {
    const response = await fetch('projects.json');
    const projects = await response.json();
    renderCards(projects);
  } catch (error) {
    console.error('Error loading projects:', error);
  }
});
