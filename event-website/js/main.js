document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule-container');
  const categorySearch = document.getElementById('category-search');
  let talksData = [];

  // Fetch talk data from the server
  fetch('/api/talks')
    .then(response => response.json())
    .then(data => {
      talksData = data;
      generateSchedule(talksData);
    })
    .catch(error => {
      console.error('Error fetching talk data:', error);
      scheduleContainer.innerHTML = '<p>Error loading schedule. Please try again later.</p>';
    });

  // Search functionality
  categorySearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTalks = talksData.filter(talk => {
      return talk.category.some(cat => cat.toLowerCase().includes(searchTerm));
    });
    generateSchedule(filteredTalks, searchTerm);
  });

  function generateSchedule(talks, searchTerm = '') {
    scheduleContainer.innerHTML = '';
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

    const formatTime = (date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    let talkCounter = 0;

    if (searchTerm === '') {
        talks.forEach((talk, index) => {
            if (talkCounter === 2) {
                // Lunch break
                const lunchBreakItem = document.createElement('div');
                lunchBreakItem.className = 'schedule-item break';
                const lunchStartTime = new Date(currentTime.getTime());
                const lunchEndTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
                lunchBreakItem.innerHTML = `
                    <div class="time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>
                    <h2>Lunch Break</h2>
                `;
                scheduleContainer.appendChild(lunchBreakItem);
                currentTime.setTime(lunchEndTime.getTime());
            }

            const talkItem = document.createElement('div');
            talkItem.className = 'schedule-item';

            const startTime = new Date(currentTime.getTime());
            const endTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);

            talkItem.innerHTML = `
                <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
                <h2>${talk.title}</h2>
                <div class="speakers">By: ${talk.speakers.join(', ')}</div>
                <div class="categories">
                ${talk.category.map(cat => `<span class="category">${cat}</span>`).join('')}
                </div>
                <p>${talk.description}</p>
            `;
            scheduleContainer.appendChild(talkItem);

            currentTime.setTime(endTime.getTime() + 10 * 60 * 1000); // 10 minute transition
            talkCounter++;
            });
    } else {
        talks.forEach((talk, index) => {
            const talkItem = document.createElement('div');
            talkItem.className = 'schedule-item';

            const startTime = new Date(currentTime.getTime());
            const endTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);

            talkItem.innerHTML = `
                <h2>${talk.title}</h2>
                <div class="speakers">By: ${talk.speakers.join(', ')}</div>
                <div class="categories">
                ${talk.category.map(cat => `<span class="category">${cat}</span>`).join('')}
                </div>
                <p>${talk.description}</p>
            `;
            scheduleContainer.appendChild(talkItem);

            currentTime.setTime(endTime.getTime() + 10 * 60 * 1000); // 10 minute transition
            talkCounter++;
            });
    }
  }
});
