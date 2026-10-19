(() => {
  'use strict';

  /* =========================================================
     HEADER
  ========================================================= */

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const globalNav = document.querySelector('.global-nav');

  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  updateHeader();

  window.addEventListener('scroll', updateHeader, {
    passive: true
  });


  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const closeMenu = () => {
    if (!globalNav || !menuToggle) return;

    globalNav.classList.remove('is-open');
    menuToggle.classList.remove('is-open');

    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '메뉴 열기');
  };

  if (menuToggle && globalNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = !globalNav.classList.contains('is-open');

      globalNav.classList.toggle('is-open', isOpen);
      menuToggle.classList.toggle('is-open', isOpen);

      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute(
        'aria-label',
        isOpen ? '메뉴 닫기' : '메뉴 열기'
      );
    });

    globalNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }


  /* =========================================================
     NAVIGATION
  ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');

      if (!href || href === '#') return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      closeMenu();
    });
  });


  /* =========================================================
     SECTION SCROLL
  ========================================================= */

  const sections = document.querySelectorAll(
    [
      '.hero-section',
      '.about-section',
      '.design-section',
      '.publish-section',
      '.team-section',
      '.contact-section'
    ].join(',')
  );

  let isSectionScrolling = false;

  const getScrollContainer = () => {
    const main = document.querySelector('main');

    if (!main) return window;

    const styles = window.getComputedStyle(main);

    const canScrollMain =
      main.scrollHeight > main.clientHeight &&
      (
        styles.overflowY === 'auto' ||
        styles.overflowY === 'scroll'
      );

    return canScrollMain ? main : window;
  };

  const getScrollTop = (container) => {
    if (container === window) {
      return window.scrollY;
    }

    return container.scrollTop;
  };

  const getSectionTop = (section, container) => {
    if (container === window) {
      return (
        section.getBoundingClientRect().top +
        window.scrollY
      );
    }

    const containerRect = container.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();

    return (
      sectionRect.top -
      containerRect.top +
      container.scrollTop
    );
  };

  const getCurrentSectionIndex = () => {
    if (!sections.length) return 0;

    const container = getScrollContainer();
    const currentScroll = getScrollTop(container);

    let closestIndex = 0;
    let closestDistance = Infinity;

    sections.forEach((section, index) => {
      const sectionTop = getSectionTop(section, container);
      const distance = Math.abs(sectionTop - currentScroll);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const moveToSection = (index) => {
    if (!sections[index]) return;

    const container = getScrollContainer();
    const targetTop = getSectionTop(sections[index], container);

    if (container === window) {
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    }
  };


  /* =========================================================
     PC SECTION WHEEL
  ========================================================= */

  window.addEventListener(
    'wheel',
    (event) => {
      if (window.innerWidth <= 700) return;

      const target = event.target;

      /*
        프로젝트 버튼이나 내부 슬라이드 버튼을
        조작할 때는 페이지 섹션 이동을 막음
      */

      if (
        target.closest('.project-button') ||
        target.closest('.project-modal') ||
        target.closest('.design-prev') ||
        target.closest('.design-next') ||
        target.closest('.publish-prev') ||
        target.closest('.publish-next') ||
        target.closest('.team-prev') ||
        target.closest('.team-next') ||
        target.closest('.team-inner-prev') ||
        target.closest('.team-inner-next') ||
        target.closest('.inner-swiper-prev') ||
        target.closest('.inner-swiper-next') ||
        target.closest('.inner-swiper-pagination') ||
        target.closest('.team-inner-pagination')
      ) {
        return;
      }

      if (isSectionScrolling) {
        event.preventDefault();
        return;
      }

      if (Math.abs(event.deltaY) < 10) return;

      const currentIndex = getCurrentSectionIndex();
      let nextIndex = currentIndex;

      if (event.deltaY > 0) {
        nextIndex = Math.min(
          currentIndex + 1,
          sections.length - 1
        );
      } else {
        nextIndex = Math.max(currentIndex - 1, 0);
      }

      if (nextIndex === currentIndex) return;

      event.preventDefault();
      isSectionScrolling = true;

      moveToSection(nextIndex);

      setTimeout(() => {
        isSectionScrolling = false;
      }, 900);
    },
    {
      passive: false
    }
  );


  /* =========================================================
     PROJECT CARD GRID
     디자인 프로젝트 4개 / 웹 퍼블리싱 프로젝트 3개
     바깥 카드 Swiper는 사용하지 않고 Grid로 표시
  ========================================================= */

  const setupProjectGrid = (selector, columnCount) => {
    const container = document.querySelector(selector);

    if (!container) return;

    const wrapper = container.querySelector(
      ':scope > .swiper-wrapper'
    );

    if (!wrapper) return;

    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns =
      `repeat(${columnCount}, minmax(0, 1fr))`;

    wrapper.style.gap = '16px';
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.transform = 'none';
    wrapper.style.transition = 'none';

    Array.from(wrapper.children).forEach((slide) => {
      if (!slide.classList.contains('swiper-slide')) return;

      slide.style.width = 'auto';
      slide.style.maxWidth = '100%';
      slide.style.minWidth = '0';
      slide.style.height = '100%';
      slide.style.marginRight = '0';
      slide.style.flexShrink = '1';
      slide.style.transform = 'none';
    });
  };

  const updateProjectGrid = () => {
    setupProjectGrid(
      '.design-swiper, #design .project-swiper',
      4
    );

    setupProjectGrid(
      '.publish-swiper, #publish .project-swiper',
      3
    );
  };

  updateProjectGrid();

  window.addEventListener('load', updateProjectGrid);
  window.addEventListener('resize', updateProjectGrid);


  /* =========================================================
     TEAM PROJECT IMAGE SWIPER
     팀 프로젝트 내부 이미지 슬라이드는 유지
  ========================================================= */

  if (typeof Swiper !== 'undefined') {

    /* =======================================================
       TEAM PROJECT - 가운데 이미지 Swiper
    ======================================================= */

    const teamCard = document.querySelector(
      '.team-project-card'
    );

    if (teamCard) {
      const teamInnerElement = teamCard.querySelector(
        '.team-inner-swiper'
      );

      if (teamInnerElement) {
        const teamSlides = teamInnerElement.querySelectorAll(
          ':scope > .swiper-wrapper > .swiper-slide'
        );

        const slideCount = teamSlides.length;

        const teamInnerPrev =
          teamInnerElement.querySelector('.team-inner-prev') ||
          teamCard.querySelector('.team-inner-prev') ||
          teamCard.querySelector('.team-prev');

        const teamInnerNext =
          teamInnerElement.querySelector('.team-inner-next') ||
          teamCard.querySelector('.team-inner-next') ||
          teamCard.querySelector('.team-next');

        const teamInnerPagination =
          teamInnerElement.querySelector(
            '.team-inner-pagination'
          );

        const teamCounter = teamCard.querySelector(
          '.team-pagination span'
        );

        const teamInnerSwiper = new Swiper(
          teamInnerElement,
          {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: 0,
            speed: 500,

            loop: slideCount > 1,
            grabCursor: slideCount > 1,
            allowTouchMove: slideCount > 1,

            observer: true,
            observeParents: true,
            watchOverflow: false,
            nested: true,

            preventClicks: true,
            preventClicksPropagation: true,

            navigation:
              teamInnerPrev && teamInnerNext
                ? {
                  prevEl: teamInnerPrev,
                  nextEl: teamInnerNext
                }
                : undefined,

            pagination: teamInnerPagination
              ? {
                el: teamInnerPagination,
                clickable: true
              }
              : undefined,

            on: {
              init(swiper) {
                updateTeamCounter(swiper);
              },

              slideChange(swiper) {
                updateTeamCounter(swiper);
              }
            }
          }
        );

        function updateTeamCounter(swiper) {
          if (!teamCounter) return;

          const current = swiper.realIndex + 1;
          const total = slideCount;

          teamCounter.textContent =
            `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        }

        if (teamInnerPrev) {
          teamInnerPrev.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
        }

        if (teamInnerNext) {
          teamInnerNext.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
        }

        teamInnerElement.teamSwiper = teamInnerSwiper;
      }
    }
  }


  /* =========================================================
     PROJECT MODAL
  ========================================================= */

  const modal = document.querySelector('#projectModal');
  const modalImage = document.querySelector('#modalImage');
  const modalCategory = document.querySelector('#modalCategory');
  const modalYear = document.querySelector('#modalYear');
  const modalTitle = document.querySelector('#modalTitle');
  const modalDescription = document.querySelector('#modalDescription');
  const modalSite = document.querySelector('#modalSite');
  const modalLog = document.querySelector('#modalLog');

  let lastFocusedElement = null;

  const setModalLink = (element, url) => {
    if (!element) return;

    const isValid =
      url &&
      url.trim() !== '' &&
      url !== '#';

    if (isValid) {
      element.href = url;
      element.classList.remove('is-disabled');
      element.removeAttribute('aria-disabled');
      element.removeAttribute('tabindex');
    } else {
      element.href = '#';
      element.classList.add('is-disabled');
      element.setAttribute('aria-disabled', 'true');
      element.setAttribute('tabindex', '-1');
    }
  };

  const openModal = (projectCard) => {
    if (!modal || !projectCard) return;

    lastFocusedElement = document.activeElement;

    const image = projectCard.dataset.image || '';
    const category = projectCard.dataset.category || '';
    const year = projectCard.dataset.year || '';
    const title = projectCard.dataset.title || '';
    const description = projectCard.dataset.description || '';
    const site = projectCard.dataset.site || '#';
    const log = projectCard.dataset.log || '#';

    if (modalImage) {
      modalImage.src = image;
      modalImage.alt = title
        ? `${title} 프로젝트 이미지`
        : '프로젝트 이미지';
    }

    if (modalCategory) {
      modalCategory.textContent = category;
    }

    if (modalYear) {
      modalYear.textContent = year;
    }

    if (modalTitle) {
      modalTitle.textContent = title;
    }

    if (modalDescription) {
      modalDescription.textContent = description;
    }

    setModalLink(modalSite, site);
    setModalLink(modalLog, log);

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    document.body.classList.add('modal-open');

    const closeButton = modal.querySelector('.modal-close');

    if (closeButton) {
      closeButton.focus();
    }
  };

  const closeModal = () => {
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('modal-open');

    if (modalImage) {
      modalImage.src = '';
      modalImage.alt = '';
    }

    if (
      lastFocusedElement &&
      typeof lastFocusedElement.focus === 'function'
    ) {
      lastFocusedElement.focus();
    }
  };


  /* =========================================================
     MODAL CLICK
  ========================================================= */

  document.addEventListener('click', (event) => {
    const projectButton = event.target.closest(
      '.project-button'
    );

    if (projectButton) {
      const projectCard = projectButton.closest(
        '.project-card'
      );

      if (projectCard) {
        event.preventDefault();
        openModal(projectCard);
        return;
      }
    }

    const closeButton = event.target.closest(
      '[data-modal-close]'
    );

    if (closeButton) {
      event.preventDefault();
      closeModal();
      return;
    }

    const disabledLink = event.target.closest(
      '.btn.is-disabled'
    );

    if (disabledLink) {
      event.preventDefault();
    }
  });


  /* =========================================================
     MODAL BACKDROP
  ========================================================= */

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  }


  /* =========================================================
     ESC
  ========================================================= */

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      modal &&
      modal.classList.contains('is-open')
    ) {
      closeModal();
    }
  });


  /* =========================================================
     TOP BUTTON
  ========================================================= */

  const topButton = document.querySelector('.top-button');

  if (topButton) {
    topButton.addEventListener('click', () => {
      const container = getScrollContainer();

      if (container === window) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        container.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  }


  /* =========================================================
     LOAD
     팀 프로젝트 이미지 캐러셀
  ========================================================= */

  window.addEventListener('load', () => {
    updateProjectGrid();

    const teamCard = document.querySelector(
      '.team-project-card'
    );

    if (teamCard) {
      const leftCard = teamCard.querySelector(
        '.team-preview-left'
      );

      const mainCard = teamCard.querySelector(
        '.team-preview-main'
      );

      const rightCard = teamCard.querySelector(
        '.team-preview-right'
      );

      const farCard = teamCard.querySelector(
        '.team-preview-far'
      );

      const prevButton = teamCard.querySelector(
        '.team-prev'
      );

      const nextButton = teamCard.querySelector(
        '.team-next'
      );

      const counter = teamCard.querySelector(
        '.team-pagination span'
      );

      if (
        leftCard &&
        mainCard &&
        rightCard &&
        farCard
      ) {
        let positions = [
          leftCard,
          mainCard,
          rightCard,
          farCard
        ];

        let currentIndex = 0;
        let isAnimating = false;

        const positionClasses = [
          'team-preview-left',
          'team-preview-main',
          'team-preview-right',
          'team-preview-far'
        ];

        function renderPositions() {
          positions.forEach((card, index) => {
            card.classList.remove(...positionClasses);
            card.classList.add(positionClasses[index]);
          });
        }

        function updateCounter() {
          if (!counter) return;

          counter.textContent =
            `${String(currentIndex + 1).padStart(2, '0')} / 04`;
        }

        function moveNext() {
          if (isAnimating) return;

          isAnimating = true;

          positions = [
            positions[3],
            positions[0],
            positions[1],
            positions[2]
          ];

          currentIndex = (currentIndex + 1) % 4;

          renderPositions();
          updateCounter();

          setTimeout(() => {
            isAnimating = false;
          }, 700);
        }

        function movePrev() {
          if (isAnimating) return;

          isAnimating = true;

          positions = [
            positions[1],
            positions[2],
            positions[3],
            positions[0]
          ];

          currentIndex = (currentIndex - 1 + 4) % 4;

          renderPositions();
          updateCounter();

          setTimeout(() => {
            isAnimating = false;
          }, 700);
        }

        if (nextButton) {
          nextButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            moveNext();
          });
        }

        if (prevButton) {
          prevButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            movePrev();
          });
        }

        renderPositions();
        updateCounter();
      }
    }
  });

})();