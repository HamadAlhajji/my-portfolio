// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Hide Cyber Loader on Page Load
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('cyber-loader');
        if (loader) {
            loader.classList.add('loader-hidden');
        }
    }, 2200); // مدة عرض الانيميشن بالملي ثانية
});