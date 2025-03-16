// Header background change on scroll with gradual appearance
const header = document.getElementById('header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove scrolled class based on scroll position
    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Function to toggle between home and post pages
function showPost(postId) {
    // Hide home page
    document.getElementById('homePage').style.display = 'none';
    
    // Hide all post pages
    const postPages = document.querySelectorAll('.post-page');
    postPages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Show the selected post
    document.getElementById(postId).style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update URL
    window.history.pushState({}, '', postId + '.html');
}

// Handle back button
window.addEventListener('popstate', function() {
    // Simple implementation - just show home page on back button
    document.getElementById('homePage').style.display = 'block';
    
    const postPages = document.querySelectorAll('.post-page');
    postPages.forEach(page => {
        page.style.display = 'none';
    });
});


// Check if we need to show a specific post on page load (for direct links)
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const postId = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
    
    if (postId && postId !== '' && postId !== 'index' && document.getElementById(postId)) {
        showPost(postId);
    }
});

// Enhanced mobile dropdown menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Add ripple effect when clicked
        let ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const size = Math.max(this.offsetWidth, this.offsetHeight);
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - size/2;
        const y = e.clientY - rect.top - size/2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    // Close the menu when clicking outside
    document.addEventListener('click', function() {
        dropdownMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
    
    // Prevent menu closing when clicking inside the dropdown
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Add staggered animation for menu items
    const menuItems = dropdownMenu.querySelectorAll('a');
    menuItems.forEach((item, index) => {
        item.style.transitionDelay = (index * 0.05) + 's';
    });
});