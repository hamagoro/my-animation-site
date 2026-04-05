const travelData = {
  "prologue": [
  ],
  "london": [
  ],
  "dublin": [
  ],
  "edinburgh": [
  ],
  "leeds": [
  ],
  "york": [
  ],
  "london-end": [
  ],
  "epilogue": [
  ],
};

document.querySelectorAll('.swiper').forEach(el => { const id = el.closest('section').id; const wrapper = el.querySelector('.swiper-wrapper'); if(travelData[id]) { travelData[id].forEach(item => { wrapper.innerHTML += `<div class="swiper-slide"><div class="polaroid-frame"><img src="images/${item.img}"><div class="caption">${item.cap}</div></div></div>`; }); } new Swiper(el, { loop: true, pagination: { el: '.swiper-pagination', clickable: true }, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } }); });