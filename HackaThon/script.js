
    document.addEventListener("DOMContentLoaded", () => {
      // JSON data (20 famous places in Kolkata)
      const data = {
        "700001": { 
          "place": "Writers' Building", 
          "history": "Constructed in 1777, it served as the office for East India Company writers and later became the secretariat of West Bengal.",
          "icon": "fa-pen-fancy"
        },
        "700016": { 
          "place": "College Street", 
          "history": "Known as 'Boi Para', it is the largest book market in India and a hub of intellectual culture.",
          "icon": "fa-book"
        },
        "700020": { 
          "place": "Kalighat Temple", 
          "history": "One of the 51 Shakti Peethas, Kalighat Temple is a major pilgrimage site dedicated to Goddess Kali.",
          "icon": "fa-place-of-worship"
        },
        "700021": { 
          "place": "Victoria Memorial", 
          "history": "Built between 1906–1921, this marble monument commemorates Queen Victoria and is now a museum.",
          "icon": "fa-monument"
        },
        "700023": { 
          "place": "Howrah Bridge", 
          "history": "Opened in 1943, this cantilever bridge over the Hooghly River is an iconic symbol of Kolkata.",
          "icon": "fa-bridge"
        },
        "700027": { 
          "place": "Indian Museum", 
          "history": "Founded in 1814, it is the oldest museum in India, housing rare collections of antiques and fossils.",
          "icon": "fa-landmark"
        },
        "700029": { 
          "place": "Rabindra Sarobar", 
          "history": "An artificial lake surrounded by gardens, named after Rabindranath Tagore, popular for recreation.",
          "icon": "fa-water"
        },
        "700031": { 
          "place": "Dakshineswar Kali Temple", 
          "history": "Built in 1855 by Rani Rashmoni, dedicated to Goddess Kali, associated with Sri Ramakrishna.",
          "icon": "fa-place-of-worship"
        },
        "700034": { 
          "place": "Science City", 
          "history": "Opened in 1997, Science City is the largest science center in India with interactive exhibits.",
          "icon": "fa-flask"
        },
        "700036": { 
          "place": "Belur Math", 
          "history": "Founded by Swami Vivekananda, headquarters of the Ramakrishna Mission, blending Hindu, Christian, and Islamic architecture.",
          "icon": "fa-university"
        },
        "700037": { 
          "place": "Alipore Zoo", 
          "history": "Established in 1876, it is India's oldest zoological park, home to diverse species.",
          "icon": "fa-paw"
        },
        "700039": { 
          "place": "South Park Street Cemetery", 
          "history": "Dating back to 1767, it is one of the oldest cemeteries in the world, with colonial-era tombs.",
          "icon": "fa-tombstone"
        },
        "700040": { 
          "place": "Birla Planetarium", 
          "history": "Inaugurated in 1963, it is one of the largest planetariums in Asia, offering astronomy shows.",
          "icon": "fa-globe"
        },
        "700041": { 
          "place": "St. Paul's Cathedral", 
          "history": "Completed in 1847, this Anglican cathedral is known for its Gothic architecture.",
          "icon": "fa-church"
        },
        "700046": { 
          "place": "Eden Gardens", 
          "history": "Established in 1864, Eden Gardens is one of the most iconic cricket stadiums in the world.",
          "icon": "fa-baseball-ball"
        },
        "700050": { 
          "place": "Marble Palace", 
          "history": "Built in 1835 by Raja Rajendra Mullick, famous for its marble architecture and art collection.",
          "icon": "fa-gem"
        },
        "700052": { 
          "place": "Town Hall", 
          "history": "Constructed in 1813, Town Hall was used for social gatherings and is now a heritage site.",
          "icon": "fa-building"
        },
        "700053": { 
          "place": "Metropolitan Building", 
          "history": "A colonial-era building on Chowringhee Road, known for its grand architecture.",
          "icon": "fa-archway"
        },
        "700054": { 
          "place": "Sealdah Station", 
          "history": "One of the busiest railway stations in India, serving millions of passengers daily.",
          "icon": "fa-train"
        },
        "700055": { 
          "place": "Nakhoda Mosque", 
          "history": "Built in 1926, it is the largest mosque in Kolkata, modeled after Akbar's tomb in Agra.",
          "icon": "fa-mosque"
        }
      };

      // DOM elements
      const grid = document.getElementById('pincode-grid');
      const modal = document.getElementById('modal');
      const closeBtn = document.getElementById('close');
      const closeModalBtn = document.getElementById('close-modal-btn');
      const placeName = document.getElementById('place-name');
      const pincode = document.getElementById('pincode');
      const history = document.getElementById('history');
      const wikiContent = document.getElementById('wiki-content');
      const readMoreBtn = document.getElementById('read-more-btn');
      const themeToggle = document.getElementById('theme-toggle');
      const searchInput = document.getElementById('search-input');
      const filteredPincodes = document.getElementById('filtered-pincodes');

      // Current selected pincode for Wikipedia API
      let currentPincode = '';
      let currentPlaceName = '';

      // Render grid of pincodes with place names
      function renderGrid(filter = '') {
        grid.innerHTML = '';
        let count = 0;
        
        for (let code in data) {
          const place = data[code].place.toLowerCase();
          const pincode = code;
          
          if (filter === '' || place.includes(filter.toLowerCase()) || pincode.includes(filter)) {
            const card = document.createElement('div');
            card.className = 'pincode-card';
            card.innerHTML = `
              <div class="card-icon">
                <i class="fas ${data[code].icon}"></i>
              </div>
              <div class="pincode-number">${code}</div>
            `;
            card.addEventListener('click', () => showDetails(code));
            grid.appendChild(card);
            count++;
          }
        }
        
        filteredPincodes.textContent = count;
      }

      // Initial render
      renderGrid();

      // Search functionality
      searchInput.addEventListener('input', (e) => {
        renderGrid(e.target.value);
      });

      // Show details in modal
      function showDetails(code) {
        const info = data[code];
        currentPincode = code;
        currentPlaceName = info.place;
        
        placeName.textContent = info.place || "Data not available";
        pincode.textContent = code;
        history.textContent = info.history || "Historical details coming soon.";
        
        // Reset wiki content
        wikiContent.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading from Wikipedia...</div>';
        
        // Fetch Wikipedia data
        fetchWikipediaData(info.place);
        
        modal.style.display = 'block';
      }

      // Fetch Wikipedia data
      async function fetchWikipediaData(placeName) {
        try {
          const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`);
          const data = await response.json();
          
          if (data.extract) {
            wikiContent.innerHTML = `<p>${data.extract}</p>`;
            readMoreBtn.onclick = () => {
              window.open(data.content_urls.desktop.page, '_blank');
            };
          } else {
            wikiContent.innerHTML = '<p>No additional information available from Wikipedia.</p>';
          }
        } catch (error) {
          console.error('Error fetching Wikipedia data:', error);
          wikiContent.innerHTML = '<p>Failed to load additional information. Please check your connection.</p>';
        }
      }

      // Close modal
      function closeModal() {
        modal.style.display = 'none';
      }

      closeBtn.onclick = closeModal;
      closeModalBtn.onclick = closeModal;

      // Close modal when clicking outside
      window.onclick = (event) => {
        if (event.target === modal) {
          closeModal();
        }
      };

      // Theme toggle
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
          themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
          themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
      });
    });
  