let queueRect = document.querySelector('#queue'),
  regFileRect = document.querySelector('#regfile'),
  storeRsRect = document.querySelector('#store'),
  loadRSRect = document.querySelector('#load'),
  addRsRect = document.querySelector('#addbuffer'),
  multiRsRect = document.querySelector('#multibuffer'),
  memoryRect = document.querySelector('#memory'),
  adderRect = document.querySelector('#adder'),
  multiRect = document.querySelector('#multiplier');

export const queueEl = document.createElement('div'),
  regFileEl = document.createElement('div'),
  soterEl = document.createElement('div'),
  loadEl = document.createElement('div'),
  addRsEl = document.createElement('div'),
  multiRsEl = document.createElement('div'),
  memoryEl = document.createElement('div'),
  adderEl = document.createElement('div'),
  multiEl = document.createElement('div');

[
  [queueEl, queueRect, 'queue'],
  [regFileEl, regFileRect, 'regFile'],
  [soterEl, storeRsRect, 'storeRS'],
  [loadEl, loadRSRect, 'loadRS'],
  [addRsEl, addRsRect, 'addRS'],
  [multiRsEl, multiRsRect, 'multiRS'],
  [memoryEl, memoryRect, 'memory'],
  [adderEl, adderRect, 'adder'],
  [multiEl, multiRect, 'multi'],
].map((args) => position(...args));

function position(el, rect, id) {
  el.setAttribute('class', 'cont');
  el.setAttribute('id', `${id}`);
  el.setAttribute(
    'style',
    `display: flex;
     overflow-y: scroll;
     overflow-x: hidden;
     background:#333;
     position:absolute;
     box-shadow: 2px 2px 10px rgba(0,0,0,.4);
     top:${rect.getAttribute('y') - 1}px;
     left:${rect.getAttribute('x') - 1}px;
     width:${+rect.getAttribute('width') + 1}px;
     height:${+rect.getAttribute('height') + 1}px;`
  );
  document.body.appendChild(el);
}
