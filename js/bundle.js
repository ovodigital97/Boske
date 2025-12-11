const header = document.querySelector('header');

if (header) {
  const toggleScrolledClass = () => {
    if (window.scrollY > 0) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', toggleScrolledClass);
  toggleScrolledClass();
}

document.addEventListener('DOMContentLoaded', function() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  if (accordionItems) {

    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-item-header');
      const content = item.querySelector('.accordion-item-content');

      trigger.addEventListener('click', function() {
        const parent = this.parentNode;

        if (parent.classList.contains('active')) {
          parent.classList.remove('active');
          content.style.height = '0';
        } else {
          document.querySelectorAll('.accordion-item').forEach(child => {
            child.classList.remove('active');
            child.querySelector('.accordion-item-content').style.height = '0';
          });
          parent.classList.add('active');
          content.style.height = content.scrollHeight + 'px';
        }
      });
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const fileInputs = document.querySelectorAll('.wpcf7-file');

  fileInputs.forEach(function(fileInput) {
    const fileWrap = fileInput.closest('.wpcf7-form-control-wrap');

    const customFile = document.createElement('div');
    customFile.className = 'custom-file-display';
    customFile.innerHTML = `
          <div class="file-text">Прикрепить проект</div>
          <div class="file-icon"></div>
      `;

    fileWrap.appendChild(customFile);

    fileInput.addEventListener('change', function(e) {
      const fileName = this.files[0] ? this.files[0].name : 'Прикрепить проект';
      customFile.querySelector('.file-text').textContent = fileName;

      if (this.files[0]) {
        customFile.classList.add('file-selected');
      } else {
        customFile.classList.remove('file-selected');
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  var modalButtons = document.querySelectorAll('.open-modal-dialog'),
      overlay = document.querySelector('body'),
      closeButtons = document.querySelectorAll('.modal-dialog .modal-close');

  var currentOpenModal = null;

  async function openModal(modalBtn) {
    return new Promise(resolve => {
      var modalId = modalBtn.getAttribute('data-src'),
          modalElem = document.querySelector('.modal-dialog.' + modalId);

      if (currentOpenModal && currentOpenModal !== modalElem) {
        closeModalDirectly(currentOpenModal);
      }

      overlay.classList.add('modal-open');
      modalElem.style.display = 'flex';

      setTimeout(function() {
        modalElem.classList.add('modal-opening');
        currentOpenModal = modalElem;
        resolve();
      }, 0);
    });
  }

  async function closeModal(closeBtn) {
    return new Promise(resolve => {
      var modal = closeBtn.closest('.modal-dialog');
      modal.classList.remove('modal-opening');
      modal.classList.add('modal-closing');

      setTimeout(function() {
        modal.classList.remove('modal-closing');
        modal.style.display = 'none';
        overlay.classList.remove('modal-open');
        if (currentOpenModal === modal) {
          currentOpenModal = null;
        }
        resolve();
      }, 500);
    });
  }

  function closeModalDirectly(modalElem) {
    modalElem.classList.remove('modal-opening');
    modalElem.style.display = 'none';

    if (currentOpenModal === modalElem) {
      currentOpenModal = null;
    }

    var anyModalOpen = document.querySelector('.modal-dialog[style*="display: flex"]');
    if (!anyModalOpen) {
      overlay.classList.remove('modal-open');
    }
  }

  /* open modal */
  modalButtons.forEach(function(modalBtn) {
    modalBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      await openModal(modalBtn);
    });
  });

  /* close modal */
  closeButtons.forEach(function(closeBtn) {
    closeBtn.addEventListener('click', async function(e) {
      await closeModal(closeBtn);
    });
  });

  document.querySelectorAll('.modal-dialog').forEach(function(item) {
    item.addEventListener('click', async function(e) {
      if (e.target !== e.currentTarget) {
        return;
      } else {
        await closeModal(this);
      }
    });
  });

});


document.addEventListener('DOMContentLoaded', function() {
  const videoContainers = document.querySelectorAll('.custom-video');

  videoContainers.forEach(container => {
    const video = container.querySelector('video');
    const playButton = container.querySelector('.button-play-video');

    video.removeAttribute('controls');

    playButton.addEventListener('click', function() {
      if (video.paused) {
        video.play();
        playButton.style.display = 'none';
      }
    });

    video.addEventListener('pause', function() {
      playButton.style.display = 'block';
    });

    video.addEventListener('ended', function() {
      playButton.style.display = 'block';});

    video.addEventListener('click', function() {
      if (!video.paused) {
        playButton.style.display = 'none';
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const filterItems = document.querySelectorAll('.filter-item');

  filterItems.forEach(item => {
    item.addEventListener('click', function() {
      filterItems.forEach(filter => {
        filter.classList.remove('active');
      });

      this.classList.add('active');
    });
  });
});


class TabsManager {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.tabButtons = this.container.querySelectorAll('.nav-button');
    this.tabPanels = this.container.querySelectorAll('.tab-panel');
    this.isAnimating = false;
    this.animationDuration = 200;

    this.init();
  }

  init() {
    if (this.tabButtons.length === 0 || this.tabPanels.length === 0) return;

    this.tabButtons[1].classList.add('active');
    this.tabPanels[1].classList.add('active');

    this.tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (this.isAnimating) return;

        const button = e.currentTarget;
        this.switchTab(parseInt(button.dataset.tabId));
      });
    });
  }

  async switchTab(targetTabId) {
    const targetButton = this.container.querySelector(`.nav-button[data-tab-id="${targetTabId}"]`);
    const targetPanel = this.container.querySelector(`.tab-panel[data-tab-id="${targetTabId}"]`);

    if (!targetButton || !targetPanel) return;
    if (targetButton.classList.contains('active')) return;

    this.isAnimating = true;

    const activePanel = this.container.querySelector('.tab-panel.active');

    if (activePanel) {
      activePanel.style.transition = `opacity ${this.animationDuration}ms ease, visibility ${this.animationDuration}ms ease`;
      activePanel.style.opacity = '0';
      activePanel.style.visibility = 'hidden';

      await this.wait(this.animationDuration);

      activePanel.classList.remove('active');
      activePanel.style.transition = '';
      activePanel.style.opacity = '';
      activePanel.style.visibility = '';
    }

    this.tabButtons.forEach(btn => btn.classList.remove('active'));

    targetButton.classList.add('active');

    targetPanel.classList.add('active');
    targetPanel.style.transition = `opacity ${this.animationDuration}ms ease, visibility ${this.animationDuration}ms ease`;
    targetPanel.style.opacity = '0';
    targetPanel.style.visibility = 'visible';

    await this.wait(10);
    targetPanel.style.opacity = '1';

    await this.wait(this.animationDuration);

    targetPanel.style.transition = '';
    targetPanel.style.opacity = '';
    targetPanel.style.visibility = '';

    this.isAnimating = false;
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

function checkVisibility() {
  const blocks = document.querySelectorAll('.animate-section');

  blocks.forEach(block => {
    if (block.hasAttribute('data-animated')) {
      return;
    }

    const rect = block.getBoundingClientRect();
    const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      setTimeout(() => {
        block.classList.add('animated');
        block.setAttribute('data-animated', 'true');
      }, 500);
    }
  });
}

window.addEventListener('load', checkVisibility);
window.addEventListener('scroll', checkVisibility);


const mobileMenuButton = document.querySelector('.mobile-menu-btn');
const closeMenuButton = document.querySelector('.close-menu-button');
const headerNav = document.querySelector('.header-nav');
let isMenuOpen = false;

function toggleMobileMenu() {
  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    headerNav.classList.add('show');
  } else {
    headerNav.classList.remove('show');
  }
}

function closeMobileMenu() {
  isMenuOpen = false;
  headerNav.classList.remove('show');
}

mobileMenuButton.addEventListener('click', toggleMobileMenu);
closeMenuButton.addEventListener('click', closeMobileMenu);

document.addEventListener('click', (e) => {
  if (isMenuOpen &&
      !headerNav.contains(e.target) &&
      !mobileMenuButton.contains(e.target)) {
    closeMobileMenu();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isMenuOpen) {
    closeMobileMenu();
  }
});

var swiper1 = new Swiper(".blog-slider", {
  observer: true,
  observeParents: true,
  observeSlideChildren: true,
  watchSlidesProgress: true,
  pagination: {
    el: ".blog-slider .swiper-pagination",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    601: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    1025: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  }
});
