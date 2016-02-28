module.exports = function(el, distance) {
  if (typeof distance !== 'number') {
    distance = 0;
  }
  // TODO: use distance to create alternate bounding client rect
  var rect = el.getBoundingClientRect();
  var paddedRect = {
    top: rect.top + distance,
    left: rect.left + distance,
    right: rect.right - distance,
    bottom: rect.bottom - distance
  };
  var pageHeight = (window.innerHeight || document.documentElement.clientHeight);
  var pageWidth = (window.innerWidth || document.documentElement.clientWidth);

  var isOnPage = (paddedRect.top >= 0 && paddedRect.left >= 0);
  var isUnderPage = (paddedRect.bottom <= pageHeight && paddedRect.right <= pageWidth);
  return (isOnPage && isUnderPage);
};