const socket = io();

// Cuando llega una actualización desde el servidor
socket.on('products:updated', ({ products }) => {
  render(products);
});

// Manejo del formulario de creación (POST HTTP)
const form = document.getElementById('create-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  form.reset();
});

// Manejo de eliminación
document.getElementById('product-list').addEventListener('click', async (e) => {
  if (e.target.classList.contains('del')) {
    const id = e.target.dataset.id;
    await fetch(`/api/products/${id}`, { method: 'DELETE' });
  }
});

// Función para renderizar la lista
function render(products) {
  const ul = document.getElementById('product-list');
  ul.innerHTML = products.map(p => `
    <li data-id="${p.id}">
      ${p.title} - $${p.price}
      <button class="del" data-id="${p.id}">Eliminar</button>
    </li>
  `).join('');
}
