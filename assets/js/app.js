// ==========================================
// GOOGLE PLACES API CONFIGURATION
// ==========================================
const GOOGLE_PLACES_CONFIG = {
  apiKey: '', // Enter Google Places API Key here
  placeId: '' // Enter Business Place ID here
};

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // SHARED: Mobile Navigation Menu
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

  const toggleMenu = (open) => {
    if (open) {
      mobileMenu.classList.add('open');
      mobileOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('open');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (menuToggle) menuToggle.addEventListener('click', () => toggleMenu(true));
  if (menuClose) menuClose.addEventListener('click', () => toggleMenu(false));
  if (mobileOverlay) mobileOverlay.addEventListener('click', () => toggleMenu(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // ==========================================
  // SHARED: Scroll Animations (Intersection Observer)
  // ==========================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));


  // ==========================================
  // HOME PAGE: Hero Image Slider
  // ==========================================
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (n) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
      showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      showSlide(currentSlide - 1);
    };

    const startSlideShow = () => {
      slideInterval = setInterval(nextSlide, 5000); // Auto change every 5 seconds
    };

    const stopSlideShow = () => {
      clearInterval(slideInterval);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopSlideShow();
        nextSlide();
        startSlideShow();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopSlideShow();
        prevSlide();
        startSlideShow();
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopSlideShow();
        showSlide(index);
        startSlideShow();
      });
    });

    // Start slideshow
    startSlideShow();
  }


  // ==========================================
  // HOME PAGE: Services Carousel ("What We Do")
  // ==========================================
  const servicesTrack = document.getElementById('servicesCarouselTrack');
  const servicesPrev = document.getElementById('servicesPrev');
  const servicesNext = document.getElementById('servicesNext');
  
  if (servicesTrack) {
    let currentIndex = 0;
    
    const updateCarousel = () => {
      const card = servicesTrack.querySelector('.service-carousel-card');
      if (!card) return;
      
      const cardWidth = card.offsetWidth;
      const gap = 30; // matching CSS gap
      
      const scrollAmount = currentIndex * (cardWidth + gap);
      servicesTrack.style.transform = `translateX(-${scrollAmount}px)`;
    };

    if (servicesNext) {
      servicesNext.addEventListener('click', () => {
        const visibleCards = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
        const maxIndex = servicesTrack.children.length - visibleCards;
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      });
    }

    if (servicesPrev) {
      servicesPrev.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });
    }
    
    // Recalculate on resize
    window.addEventListener('resize', updateCarousel);
    // Initial calculation
    setTimeout(updateCarousel, 100);
  }


  // ==========================================
  // HOME PAGE: Gallery Stacked Card Slider
  // ==========================================
  const gallerySlider = document.getElementById('gallerySlider');
  const galleryPrev = document.getElementById('galleryPrev');
  const galleryNext = document.getElementById('galleryNext');
  
  if (gallerySlider) {
    let currentX = 0;
    const cardWidth = 480; // Flex width + gap (450 + 30)
    const maxScroll = (gallerySlider.children.length - 1) * cardWidth;

    const slideGallery = (direction) => {
      if (direction === 'next') {
        currentX = Math.min(currentX + cardWidth, maxScroll);
      } else {
        currentX = Math.max(currentX - cardWidth, 0);
      }
      gallerySlider.style.transform = `translateX(-${currentX}px)`;
    };

    if (galleryNext) galleryNext.addEventListener('click', () => slideGallery('next'));
    if (galleryPrev) galleryPrev.addEventListener('click', () => slideGallery('prev'));
  }


  // ==========================================
  // HOME PAGE: Reviews Testimonial Slider
  // ==========================================
  let reviewsInterval = null;
  const resetReviewsSliderScroll = () => {
    const reviewsSlider = document.getElementById('reviewsSlider');
    if (!reviewsSlider) return;
    
    if (reviewsInterval) clearInterval(reviewsInterval);

    let scrollVal = 0;
    const reviewCardWidth = 380; // 350px card width + 30px gap

    const autoSlideReviews = () => {
      const maxReviewsScroll = (reviewsSlider.children.length - 2) * reviewCardWidth;
      scrollVal += reviewCardWidth;
      if (scrollVal > maxReviewsScroll) {
        scrollVal = 0;
      }
      reviewsSlider.style.transform = `translateX(-${scrollVal}px)`;
    };

    reviewsInterval = setInterval(autoSlideReviews, 4000);
  };


  // ==========================================
  // GALLERY PAGE: Category Filtering & Lightbox
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid-item');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeImages = []; // Stores filtered image URLs
  let currentLightboxIdx = 0;

  // Gallery Filters
  if (filterButtons.length > 0 && galleryItems.length > 0) {
    
    const applyFilter = (filterValue) => {
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.85)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.getAttribute('data-filter'));
      });
    });

    // Populate active items list for lightbox navigation
    const updateActiveImages = () => {
      activeImages = [];
      galleryItems.forEach(item => {
        if (item.style.display !== 'none') {
          activeImages.push({
            src: item.querySelector('img').src,
            alt: item.querySelector('img').alt,
            title: item.querySelector('.gallery-grid-item-title').textContent
          });
        }
      });
    };

    // Open Lightbox
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        updateActiveImages();
        const imgSrc = item.querySelector('img').src;
        currentLightboxIdx = activeImages.findIndex(img => img.src === imgSrc);
        
        showLightbox(currentLightboxIdx);
      });
    });

    const showLightbox = (index) => {
      if (index < 0 || index >= activeImages.length) return;
      currentLightboxIdx = index;
      const data = activeImages[currentLightboxIdx];
      
      lightboxImg.src = data.src;
      lightboxImg.alt = data.alt;
      lightboxCaption.textContent = data.title;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => {
        showLightbox((currentLightboxIdx + 1) % activeImages.length);
      });
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => {
        showLightbox((currentLightboxIdx - 1 + activeImages.length) % activeImages.length);
      });
    }

    // Close lightbox on background click
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }
  }


  // ==========================================
  // REVIEWS PAGE & API: Google Places Reviews & Form
  // ==========================================
  const reviewsGridList = document.getElementById('reviewsListGrid');
  const newReviewForm = document.getElementById('newReviewForm');
  const starSelector = document.getElementById('starSelector');
  const ratingInput = document.getElementById('selectedStarValue');

  // Hardcoded default reviews
  const defaultReviews = [
    { name: 'Ramesh Kumar', stars: 5, text: "Srivenkateswara decoration team did a brilliant stage setup for my sister's wedding in Ariyalur. The flower arrangements and backdrop colors were perfectly matched to our traditional expectations. Deliver on time!", date: '2 months ago', img: 'https://lh3.googleusercontent.com/a/default-user=s45-c' },
    { name: 'Anitha Shanmugam', stars: 4, text: 'Decorated our home for the puberty ceremony function. Nice balloon arch designs and clean arrangements. Highly recommend for family celebrations in Ariyalur.', date: '4 months ago', img: 'https://lh3.googleusercontent.com/a/default-user=s45-c' },
    { name: 'Vijay Prasath', stars: 5, text: 'Excellent management of our school annual day stage setups. The lighting and background layout was grand. Very professional team. Think out of the box indeed.', date: '6 months ago', img: 'https://lh3.googleusercontent.com/a/default-user=s45-c' },
    { name: 'Deepak R', stars: 4, text: 'Custom decoration concept was handled very well for our anniversary function. We got a good budget estimate and friendly consultation support. Delighted with their work.', date: '8 months ago', img: 'https://lh3.googleusercontent.com/a/default-user=s45-c' }
  ];

  const getStoredReviews = () => {
    let local = JSON.parse(localStorage.getItem('decor_reviews') || '[]');
    if (local.length === 0) {
      localStorage.setItem('decor_reviews', JSON.stringify(defaultReviews));
      return defaultReviews;
    }
    return local;
  };

  const renderRatingDashboard = () => {
    const reviews = getStoredReviews();
    const totalCount = reviews.length;
    const sumStars = reviews.reduce((sum, r) => sum + r.stars, 0);
    let avg = totalCount > 0 ? (sumStars / totalCount).toFixed(1) : '0.0';

    const overviewStr = localStorage.getItem('decor_rating_overview');
    let displayTotalCount = `Based on ${totalCount} Google Ratings`;
    if (overviewStr) {
      const overview = JSON.parse(overviewStr);
      avg = parseFloat(overview.rating).toFixed(1);
      displayTotalCount = `Based on ${overview.totalCount} Google Ratings`;
    }

    const avgEl = document.getElementById('averageRating');
    const totalCountEl = document.getElementById('totalReviewsCount');
    
    if (avgEl) avgEl.textContent = avg;
    if (totalCountEl) totalCountEl.textContent = displayTotalCount;

    // Distribution
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      dist[r.stars] = (dist[r.stars] || 0) + 1;
    });

    for (let i = 1; i <= 5; i++) {
      const percentage = totalCount > 0 ? (dist[i] / totalCount) * 100 : 0;
      const barFill = document.getElementById(`bar-${i}`);
      if (barFill) barFill.style.width = `${percentage}%`;
    }
  };

  const renderReviewsOnPage = () => {
    const reviews = getStoredReviews();

    // 1. Render homepage review slider
    const reviewsSlider = document.getElementById('reviewsSlider');
    if (reviewsSlider) {
      reviewsSlider.innerHTML = '';
      reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
          starsHTML += i <= review.stars 
            ? '<i class="fa-solid fa-star"></i>' 
            : '<i class="fa-regular fa-star"></i>';
        }

        card.innerHTML = `
          <div class="review-card-header">
            <div class="reviewer-info">
              <img class="reviewer-img" src="${review.img || 'https://lh3.googleusercontent.com/a/default-user=s45-c'}" alt="${review.name}" referrerpolicy="no-referrer">
              <span class="reviewer-name">${review.name}</span>
            </div>
            <i class="fa-brands fa-google google-icon"></i>
          </div>
          <div class="review-stars">
            ${starsHTML}
          </div>
          <p class="review-text">${review.text}</p>
          <span class="review-card-date">${review.date || 'Just now'}</span>
        `;
        reviewsSlider.appendChild(card);
      });
      resetReviewsSliderScroll();
    }

    // 2. Render reviews page grid
    if (reviewsGridList) {
      reviewsGridList.innerHTML = '';
      reviews.forEach(review => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.setAttribute('data-rating', review.stars);

        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
          starsHTML += i <= review.stars 
            ? '<i class="fa-solid fa-star"></i>' 
            : '<i class="fa-regular fa-star"></i>';
        }

        card.innerHTML = `
          <div class="review-card-header">
            <div class="reviewer-info">
              <img class="reviewer-img" src="${review.img || 'https://lh3.googleusercontent.com/a/default-user=s45-c'}" alt="${review.name}" referrerpolicy="no-referrer">
              <span class="reviewer-name">${review.name}</span>
            </div>
            <i class="fa-brands fa-google google-icon"></i>
          </div>
          <div class="review-stars">
            ${starsHTML}
          </div>
          <p class="review-text">${review.text}</p>
          <span class="review-card-date">${review.date || 'Just now'}</span>
        `;
        reviewsGridList.appendChild(card);
      });
      renderRatingDashboard();
    }
  };

  const fetchRealtimeReviews = (placeId) => {
    try {
      const dummyDiv = document.createElement('div');
      const service = new google.maps.places.PlacesService(dummyDiv);
      service.getDetails({
        placeId: placeId,
        fields: ['reviews', 'rating', 'user_ratings_total']
      }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          let reviews = [];
          if (place.reviews && place.reviews.length > 0) {
            reviews = place.reviews.map(r => ({
              name: r.author_name,
              stars: Math.round(r.rating),
              text: r.text,
              date: r.relative_time_description,
              img: r.profile_photo_url || 'https://lh3.googleusercontent.com/a/default-user=s45-c'
            }));
          }
          
          if (reviews.length > 0) {
            localStorage.setItem('decor_reviews', JSON.stringify(reviews));
            localStorage.setItem('decor_rating_overview', JSON.stringify({
              rating: place.rating || 4.0,
              totalCount: place.user_ratings_total || reviews.length
            }));
          } else {
            loadFallbackReviews();
            return;
          }
          renderReviewsOnPage();
        } else {
          console.warn('Google Places details failed. Falling back. Status:', status);
          loadFallbackReviews();
        }
      });
    } catch (e) {
      console.error('Error fetching Places API reviews:', e);
      loadFallbackReviews();
    }
  };

  const loadFallbackReviews = () => {
    let local = localStorage.getItem('decor_reviews');
    if (!local) {
      localStorage.setItem('decor_reviews', JSON.stringify(defaultReviews));
    }
    renderReviewsOnPage();
  };

  const initGoogleReviews = () => {
    const { apiKey, placeId } = GOOGLE_PLACES_CONFIG;
    if (!apiKey || !placeId) {
      loadFallbackReviews();
      return;
    }

    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => fetchRealtimeReviews(placeId);
      script.onerror = () => {
        console.error('Failed to load Google Places SDK.');
        loadFallbackReviews();
      };
      document.head.appendChild(script);
    } else {
      fetchRealtimeReviews(placeId);
    }
  };

  // Run initialization
  initGoogleReviews();

  // Star Selector Interaction in Form
  if (reviewsGridList) {
    if (starSelector) {
      const stars = starSelector.querySelectorAll('i');
      stars.forEach(star => {
        star.addEventListener('click', () => {
          const val = parseInt(star.getAttribute('data-value'));
          ratingInput.value = val;
          
          stars.forEach(s => {
            const sVal = parseInt(s.getAttribute('data-value'));
            if (sVal <= val) {
              s.className = 'fa-solid fa-star selected';
            } else {
              s.className = 'fa-regular fa-star';
            }
          });
        });
      });
    }

    // Submit New Review Form
    if (newReviewForm) {
      newReviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('review-name').value;
        const msg = document.getElementById('review-msg').value;
        const starsVal = parseInt(ratingInput.value);

        const newReview = {
          name: name,
          stars: starsVal,
          text: msg,
          date: 'Just now',
          img: 'https://lh3.googleusercontent.com/a/default-user=s45-c'
        };

        const currentReviews = getStoredReviews();
        currentReviews.unshift(newReview); // Add to beginning
        localStorage.setItem('decor_reviews', JSON.stringify(currentReviews));

        // Reset Form
        newReviewForm.reset();
        
        // Reset Star UI
        const starIcons = starSelector.querySelectorAll('i');
        starIcons.forEach(s => s.className = 'fa-regular fa-star');

        // Re-render
        renderReviewsOnPage();

        // Scroll to dashboard
        const dashboard = document.getElementById('reviews-dashboard');
        if (dashboard) dashboard.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }


  // ==========================================
  // SERVICES PAGE: Budget Estimator
  // ==========================================
  const eventCards = document.querySelectorAll('[data-type="event"]');
  const themeCards = document.querySelectorAll('[data-type="theme"]');
  const addonCards = document.querySelectorAll('[data-type="addon"]');
  
  if (eventCards.length > 0) {
    const summaryEvent = document.getElementById('summaryEvent');
    const summaryTheme = document.getElementById('summaryTheme');
    const summaryAddons = document.getElementById('summaryAddons');
    const estimatedPrice = document.getElementById('estimatedPrice');
    const applyEstimateBtn = document.getElementById('applyEstimateBtn');

    let selectedEvent = { name: 'Wedding Ceremony', price: 25000 };
    let selectedTheme = { name: 'Classic Traditional', price: 15000 };
    let selectedAddons = [];

    // Event Selection
    eventCards.forEach(card => {
      card.addEventListener('click', () => {
        eventCards.forEach(c => {
          c.classList.remove('selected');
          c.querySelector('input[type="radio"]').checked = false;
        });
        card.classList.add('selected');
        card.querySelector('input[type="radio"]').checked = true;

        selectedEvent.name = card.querySelector('.select-card-name').textContent;
        selectedEvent.price = parseInt(card.getAttribute('data-price'));
        
        calculateBudget();
      });
    });

    // Theme Selection
    themeCards.forEach(card => {
      card.addEventListener('click', () => {
        themeCards.forEach(c => {
          c.classList.remove('selected');
          c.querySelector('input[type="radio"]').checked = false;
        });
        card.classList.add('selected');
        card.querySelector('input[type="radio"]').checked = true;

        selectedTheme.name = card.querySelector('.select-card-name').textContent;
        selectedTheme.price = parseInt(card.getAttribute('data-price'));
        
        calculateBudget();
      });
    });

    // Addon Selection
    addonCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
        }

        if (checkbox.checked) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }

        updateAddons();
        calculateBudget();
      });
    });

    const updateAddons = () => {
      selectedAddons = [];
      addonCards.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
          selectedAddons.push({
            name: card.querySelector('.select-card-name').textContent,
            price: parseInt(card.getAttribute('data-price'))
          });
        }
      });
    };

    const calculateBudget = () => {
      const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
      const total = selectedEvent.price + selectedTheme.price + addonsTotal;

      summaryEvent.textContent = selectedEvent.name;
      summaryTheme.textContent = selectedTheme.name;
      summaryAddons.textContent = selectedAddons.length > 0 
        ? selectedAddons.map(a => a.name.split(' ')[0]).join(', ') 
        : 'None';

      let minPrice = total;
      let maxPrice = total + 5000;
      if (selectedEvent.price < 10000) {
        maxPrice = total + 2000;
      }

      estimatedPrice.textContent = `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`;
    };

    if (applyEstimateBtn) {
      applyEstimateBtn.addEventListener('click', () => {
        const addonsStr = selectedAddons.length > 0 
          ? selectedAddons.map(a => a.name).join(', ') 
          : 'None';

        const customMessage = `Hello! I would like to book a final quote for:\n` +
                              `- Event Type: ${selectedEvent.name}\n` +
                              `- Theme Style: ${selectedTheme.name}\n` +
                              `- Add-ons selected: ${addonsStr}\n` +
                              `- Estimated budget: ${estimatedPrice.textContent}\n` +
                              `Please contact me to discuss my date and details.`;
        
        // Save pending estimate context in localstorage, and redirect
        localStorage.setItem('pending_estimate', customMessage);
        window.location.href = 'contact.html';
      });
    }
  }


  // ==========================================
  // CONTACT PAGE: Form Pre-fill & Submissions
  // ==========================================
  const inquiryDetails = document.getElementById('form-details');
  const inquiryForm = document.getElementById('inquiryForm');
  const bookingFormContainer = document.getElementById('bookingFormContainer');
  const successMessage = document.getElementById('successMessage');

  if (inquiryDetails) {
    // Check if redirect came from services page estimator
    const pendingEstimate = localStorage.getItem('pending_estimate');
    if (pendingEstimate) {
      inquiryDetails.value = pendingEstimate;
      
      // Auto pre-select event type dropdown based on text keyword matching
      const eventSelect = document.getElementById('form-event-type');
      if (eventSelect) {
        if (pendingEstimate.includes('Wedding')) eventSelect.value = 'wedding';
        else if (pendingEstimate.includes('Birthday')) eventSelect.value = 'birthday';
        else if (pendingEstimate.includes('School')) eventSelect.value = 'annual-day';
        else if (pendingEstimate.includes('Traditional')) eventSelect.value = 'traditional';
      }

      localStorage.removeItem('pending_estimate'); // Clear after load
    }
  }

  // Inquiry Form Submitter
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value;
      const phone = document.getElementById('form-phone').value;
      const eventType = document.getElementById('form-event-type').value;
      const date = document.getElementById('form-date').value;
      const details = document.getElementById('form-details').value;

      // Submit Button Loading state
      const submitBtn = inquiryForm.querySelector('.submit-btn');
      submitBtn.textContent = 'Sending Inquiry...';
      submitBtn.disabled = true;

      setTimeout(() => {
        const inquiryData = {
          name: name,
          phone: phone,
          eventType: eventType,
          date: date,
          details: details,
          submittedAt: new Date().toISOString()
        };

        // Record locally to simulate booking
        let currentInquiries = JSON.parse(localStorage.getItem('decor_inquiries') || '[]');
        currentInquiries.push(inquiryData);
        localStorage.setItem('decor_inquiries', JSON.stringify(currentInquiries));

        // Switch to success card
        bookingFormContainer.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1200);
    });
  }

});
