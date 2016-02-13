'use strict'
function Accordion(elementId, options) {
  var elem = document.getElementById(elementId);
  if (!elem) return;
  var defaults = {
    showButton: true,
    showFirst: true,
    showFast: false,
    hideOthersOnClick: false
  }
  if (options) {
    for (var prop in options) {
      if (defaults.hasOwnProperty(prop)) {
        defaults[prop] = options[prop];
      }
    }
  }
  var headers = [];
  for (var i = 0; i < elem.children.length; i += 2) {
    var header = elem.children[i];
    headers.push(header);
    var statusButton;
    if (defaults.showButton) {
      statusButton = document.createElement('span');
      statusButton.className = 'statusButton' + ((i == 0 && defaults.showFirst) ? ' minus' : ' plus');
      header.appendChild(statusButton);
    }
    var content = elem.children[i + 1];
    content.setAttribute('data-origin-height', content.clientHeight);
    content.style.display = (i == 0 && defaults.showFirst) ? 'block' : 'none';
    content.style.height = content.clientHeight + 'px';
    content.style.overflow = 'hidden';
    (function(header) {
      header.addEventListener('click', function() {
        handleClick(header);
      });
    })(header);
  }
  var timer;
  function handleClick(header) {
    var content = header.nextElementSibling;
    var shouldHide = content.style.display === 'block';
    if (shouldHide && defaults.hideOthersOnClick) {
      return;
    }
    if (defaults.hideOthersOnClick) {
      for (var i = 0; i < headers.length; i++) {
        (function(index) {
          animate(headers[index], headers[index].nextElementSibling, true, 1);
        })(i);
      }
    }
    content.style.height = shouldHide ?
      content.getAttribute('data-origin-height') + 'px' : '0px';
    content.style.display = 'block';
    timer = setInterval(function() {
      animate(header, content, shouldHide, (defaults.showFast ? 1 : undefined))
    }, 25);
  }
  function animate(header, content, shouldHide, speed) {
    var oHeight = content.getAttribute('data-origin-height');
    var koef = oHeight / (speed || 10);
    koef = shouldHide ? -koef : koef;
    var statusBtn = defaults.showButton ? header.children[header.children.length - 1] : undefined;
    if (statusBtn) {
      statusBtn.className = statusBtn.className.replace('minus', '').replace('plus', '') + (koef > 0 ? 'minus' : 'plus');
    }
    var newHeight = parseInt(content.style.height, 10) + koef;
    content.style.height = Math.max(0, newHeight) + 'px';
    content.style.height = Math.min(oHeight, newHeight) + 'px';
    if (parseInt(content.style.height, 10) <= 0) {
      content.style.display = 'none';
      if (timer) {
        clearInterval(timer);
      }
    }
    if (parseInt(content.style.height, 10) >= oHeight) {
      if (timer) {
        clearInterval(timer);
      }
    }
  }
}
new Accordion("accordion1", {
  showFirst: true,
  showButton: true,
  showFast: false,
  hideOthersOnClick: true
});
