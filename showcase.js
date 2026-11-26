const workshop = document.querySelector('#session');
if (workshop) workshop.onsubmit = e => {
  e.preventDefault();
  workshop.querySelector('output').textContent = 'Sample reservation: one seat for ' + workshop.elements.slot.value + '. No booking was made.';
};
const enquiry = document.querySelector('#garden-brief');
if (enquiry) enquiry.onsubmit = e => {
  e.preventDefault();
  enquiry.querySelector('output').textContent = 'Your sample brief: ' + enquiry.elements.service.value + '. Priority: ' + enquiry.elements.goal.value + '. No enquiry was sent.';
};
const catalog = [['Arc Study',32],['Leaf Lines',36],['Evening Signal',40]];
const key = 'folio-demo-cart-v1';
function readCart() {
  try { const data = JSON.parse(sessionStorage.getItem(key) || '[]');
    return Array.isArray(data) ? data.filter(x => x && Number.isInteger(x.id) && catalog[x.id] && ['A3','A4'].includes(x.size) && Number.isInteger(x.qty) && x.qty > 0 && x.qty <= 99) : [];
  } catch { return []; }
}
const product = document.querySelector('#product');
if (product) product.onsubmit = e => {
  e.preventDefault();
  const cart = readCart(), id = Number(product.dataset.item), size = product.elements.size.value;
  const line = cart.find(x => x.id === id && x.size === size);
  if (line) line.qty = Math.min(99, line.qty + 1); else cart.push({id,size,qty:1});
  sessionStorage.setItem(key, JSON.stringify(cart));
  product.querySelector('output').textContent = catalog[id][0] + ' (' + size + ') in cart. Quantity: ' + (line?.qty || 1);
};
const basket = document.querySelector('#basket');
function drawCart() {
  const cart = readCart();
  basket.replaceChildren();
  let total = 0;
  for (const [index,line] of cart.entries()) {
    const [name, base] = catalog[line.id], amount = (base + (line.size === 'A3' ? 16 : 0)) * line.qty;
    total += amount;
    const row = document.createElement('p');
    row.textContent = name + ' · ' + line.size + ' × ' + line.qty + ' · $' + amount + ' ';
    const remove = document.createElement('button');
    remove.textContent = 'Remove'; remove.setAttribute('aria-label','Remove ' + name + ' ' + line.size);
    remove.onclick = () => { cart.splice(index,1); sessionStorage.setItem(key, JSON.stringify(cart)); drawCart(); };
    row.append(remove); basket.append(row);
  }
  const summary = document.createElement('h3');
  summary.textContent = cart.length ? 'Total: $' + total + ' USD' : 'Your cart is empty';
  const browse=document.createElement('a');browse.href='folio.html#prints';browse.className='inline';browse.textContent='Browse prints';
  basket.append(summary,browse); document.querySelector('#checkout').hidden = !cart.length;
}
if (basket) {
  drawCart(); window.addEventListener('pageshow',drawCart);
  document.querySelector('#order').onclick = () => {
    if (!readCart().length) return drawCart();
    sessionStorage.removeItem(key);drawCart();document.querySelector('#receipt').textContent='Demo order complete. No charge or shipment was created.';
  };
}