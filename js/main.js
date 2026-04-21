 
    const windows = document.querySelectorAll('.window');
    const openButtons = document.querySelectorAll('.open-window');
    const closeButtons = document.querySelectorAll('.close-window');
    let topZ = 20;

    function bringToFront(windowEl) {
      topZ += 1;
      windowEl.style.zIndex = String(topZ);
    }

    function openWindow(windowId) {
      const target = document.getElementById(windowId);
      if (!target) return;
      target.classList.add('active');
      bringToFront(target);
    }

    function closeWindow(windowId) {
      const target = document.getElementById(windowId);
      if (!target) return;
      target.classList.remove('active');
    }

    openButtons.forEach((button) => {
      button.addEventListener('click', () => {
        openWindow(button.dataset.window);
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        closeWindow(button.dataset.window);
      });
    });

    windows.forEach((windowEl) => {
      windowEl.addEventListener('mousedown', () => {
        bringToFront(windowEl);
      });
    });

    function updateClock() {
      const clock = document.getElementById('clock');
      if (!clock) return;
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const suffix = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      clock.textContent = `${hours}:${minutes} ${suffix}`;
    }

    updateClock();
    setInterval(updateClock, 1000);

    windows.forEach((windowEl) => {
      const bar = windowEl.querySelector('.window-bar');
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      if (!bar) return;

      bar.addEventListener('mousedown', (e) => {
        if (window.innerWidth < 768) return;
        if (e.target.classList.contains('window-btn')) return;

        isDragging = true;
        bringToFront(windowEl);

        const rect = windowEl.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const maxLeft = window.innerWidth - windowEl.offsetWidth - 12;
        const maxTop = window.innerHeight - windowEl.offsetHeight - 100;

        let left = e.clientX - offsetX;
        let top = e.clientY - offsetY;

        left = Math.max(12, Math.min(left, maxLeft));
        top = Math.max(12, Math.min(top, maxTop));

        windowEl.style.left = `${left}px`;
        windowEl.style.top = `${top}px`;
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });
    });

    console.assert(document.querySelectorAll('.window').length === 6, 'Expected 6 desktop windows.');
    console.assert(document.querySelectorAll('.open-window').length === 6, 'Expected 6 desktop icons.');
    console.assert(typeof openWindow === 'function', 'openWindow should exist.');
    console.assert(typeof closeWindow === 'function', 'closeWindow should exist.');
  