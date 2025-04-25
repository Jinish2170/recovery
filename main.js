// Navigation sticky behavior
window.addEventListener('scroll', function () {
    const header = document.querySelector('.navbar');
    if (window.scrollY > 50) {  
        if (!header.classList.contains('sticky')) {
            header.classList.add('sticky');  
        }
    } else {
        if (header.classList.contains('sticky')) {
            header.classList.remove('sticky');  
        }
    }
});

// Initialize interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Card hover effects
    const cards = document.querySelectorAll('.modern-card, .treatment-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // View toggle in favorites page
    const viewToggleBtns = document.querySelectorAll('.view-toggle .btn');
    const centersGrid = document.querySelector('.centers-grid');
    
    viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewToggleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.view === 'list') {
                centersGrid.classList.add('list-view');
            } else {
                centersGrid.classList.remove('list-view');
            }
        });
    });

    // Comparison functionality
    const compareButtons = document.querySelectorAll('.card-actions .btn.secondary');
    const comparisonCards = document.querySelectorAll('.comparison-card');
    const compareBtn = document.querySelector('.compare-btn');
    let selectedCenters = [];

    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const centerCard = this.closest('.center-card');
            const centerInfo = {
                name: centerCard.querySelector('h3').textContent,
                image: centerCard.querySelector('.card-image img').src,
                location: centerCard.querySelector('.location').textContent,
                rating: centerCard.querySelector('.rating').textContent
            };

            if (this.classList.contains('active')) {
                // Remove from comparison
                this.classList.remove('active');
                selectedCenters = selectedCenters.filter(c => c.name !== centerInfo.name);
            } else if (selectedCenters.length < 2) {
                // Add to comparison
                this.classList.add('active');
                selectedCenters.push(centerInfo);
            }

            // Update comparison cards
            updateComparisonCards();
        });
    });

    function updateComparisonCards() {
        comparisonCards.forEach((card, index) => {
            if (selectedCenters[index]) {
                card.innerHTML = `
                    <div class="comparison-header">
                        <h3>${selectedCenters[index].name}</h3>
                        <button class="btn icon-btn remove-comparison"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="comparison-content">
                        <img src="${selectedCenters[index].image}" alt="${selectedCenters[index].name}">
                        <p>${selectedCenters[index].location}</p>
                        <div class="rating">${selectedCenters[index].rating}</div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="comparison-header">
                        <h3>Select Center</h3>
                        <p>Choose a center to compare</p>
                    </div>
                    <div class="comparison-placeholder">
                        <i class="fas fa-plus-circle"></i>
                    </div>
                `;
            }
        });

        // Update compare button state
        compareBtn.disabled = selectedCenters.length !== 2;
    }

    // Handle form submissions
    const contactForm = document.querySelector('#contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add form submission animation
            this.classList.add('submitting');
            setTimeout(() => {
                this.classList.remove('submitting');
                this.classList.add('submitted');
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you! We'll get back to you soon.</p>
                `;
                this.parentNode.appendChild(successMessage);
                // Reset form
                this.reset();
            }, 1500);
        });
    }

    // Insurance verification form
    const insuranceForm = document.querySelector('#insuranceForm');
    if (insuranceForm) {
        insuranceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            this.classList.add('verifying');
            setTimeout(() => {
                this.classList.remove('verifying');
                this.classList.add('verified');
                const verificationResult = document.createElement('div');
                verificationResult.className = 'verification-result';
                verificationResult.innerHTML = `
                    <i class="fas fa-shield-check"></i>
                    <p>Your insurance coverage has been verified!</p>
                    <button class="btn primary">View Coverage Details</button>
                `;
                this.parentNode.appendChild(verificationResult);
            }, 2000);
        });
    }

    // Dynamic content loading
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.classList.add('loading');
            // Simulate loading more content
            setTimeout(() => {
                this.classList.remove('loading');
                // Add new content here
            }, 1000);
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.dataset.tooltip;
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = tooltipText;
            document.body.appendChild(tooltipEl);
            
            const rect = this.getBoundingClientRect();
            tooltipEl.style.top = rect.top - tooltipEl.offsetHeight - 10 + 'px';
            tooltipEl.style.left = rect.left + (rect.width - tooltipEl.offsetWidth) / 2 + 'px';
            
            setTimeout(() => tooltipEl.classList.add('visible'), 10);
        });
        
        tooltip.addEventListener('mouseleave', function() {
            const tooltipEl = document.querySelector('.tooltip');
            if (tooltipEl) {
                tooltipEl.classList.remove('visible');
                setTimeout(() => tooltipEl.remove(), 200);
            }
        });
    });
});

