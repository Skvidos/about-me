// Add lazy loading to all images that don't have it
// This script can be run in browser or during build process

(function() {
  const images = document.querySelectorAll('img.slider-image, img.social_icon_img, img.link-icon');
  
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
  
  console.log(`Added lazy loading to ${images.length} images`);
})();
