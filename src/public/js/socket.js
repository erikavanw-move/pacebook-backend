const socket = io();

const statusEl = document.getElementById("conn-status");
socket.on("connect", () => {
  statusEl.textContent = "en vivo";
  statusEl.className = "conn on";
});
socket.on("disconnect", () => {
  statusEl.textContent = "sin conexión";
  statusEl.className = "conn off";
});

function toast(text) {
  const el = document.getElementById("toast");
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (el.hidden = true), 3000);
}

const servicesBody = document.getElementById("services-body");

function setAvailability(tr, available) {
  tr.dataset.available = String(available);
  const badge = tr.querySelector(".c-available .badge");
  badge.className = "badge " + (available ? "ok" : "no");
  badge.textContent = available ? "Disponible" : "No disponible";
}

function fillRow(tr, s) {
  tr.dataset.id = s.id;
  tr.querySelector(".c-name").textContent = s.name;
  tr.querySelector(".c-description").textContent = s.description;
  tr.querySelector(".c-duration").textContent = `${s.duration} min`;
  tr.querySelector(".c-price").textContent = `$${s.price}`;
  tr.querySelector(".c-category").textContent = s.category;
  setAvailability(tr, s.available);
}

function newRow() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td class="c-name"></td><td class="c-description"></td><td class="c-duration"></td>
    <td class="c-price"></td><td class="c-category"></td>
    <td class="c-available"><span class="badge"></span></td>
    <td class="actions">
      <button class="toggle" type="button">Cambiar disponibilidad</button>
      <button class="delete danger" type="button">Eliminar</button>
    </td>`;
  return tr;
}

function flash(el) {
  el.classList.remove("flash");
  void el.offsetWidth;
  el.classList.add("flash");
}

function refreshServicesEmpty() {
  document.getElementById("services-empty").hidden = servicesBody.children.length > 0;
}

if (servicesBody) {
  socket.on("service:created", (s) => {
    if (servicesBody.querySelector(`tr[data-id="${s.id}"]`)) return;
    const tr = newRow();
    fillRow(tr, s);
    servicesBody.appendChild(tr);
    flash(tr);
    refreshServicesEmpty();
    toast(`Nuevo servicio: ${s.name}`);
  });

  socket.on("service:updated", (s) => {
    const tr = servicesBody.querySelector(`tr[data-id="${s.id}"]`);
    if (!tr) return;
    fillRow(tr, s);
    flash(tr);
    toast(`Servicio actualizado: ${s.name}`);
  });

  socket.on("service:deleted", (s) => {
    const tr = servicesBody.querySelector(`tr[data-id="${s.id}"]`);
    if (tr) tr.remove();
    refreshServicesEmpty();
    toast(`Servicio eliminado: ${s.name}`);
  });


  document.getElementById("service-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    const errorEl = document.getElementById("form-error");
    errorEl.textContent = "";
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: f.name.value,
        description: f.description.value,
        duration: Number(f.duration.value),
        price: Number(f.price.value),
        category: f.category.value,
        available: f.available.checked,
      }),
    });
    if (res.ok) f.reset(), (f.available.checked = true);
    else errorEl.textContent = (await res.json()).error || "No se pudo crear";
  });

  servicesBody.addEventListener("click", async (e) => {
    const tr = e.target.closest("tr");
    if (!tr) return;
    const id = tr.dataset.id;
    if (e.target.classList.contains("toggle")) {
      await fetch(`/api/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: tr.dataset.available !== "true" }),
      });
    }
    if (e.target.classList.contains("delete")) {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
    }
  });
}


const bookingsList = document.getElementById("bookings-list");

function renderBooking(b) {
  const art = document.createElement("article");
  art.className = "card booking";
  art.dataset.id = b.id;

  const h = document.createElement("h2");
  h.textContent = b.clientName;
  const mail = document.createElement("p");
  mail.className = "meta";
  mail.textContent = b.clientEmail;
  const when = document.createElement("p");
  when.className = "meta";
  when.textContent = `${b.date} · ${b.time} `;
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = b.status;
  when.appendChild(badge);

  const ul = document.createElement("ul");
  if (b.services.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "Sin servicios todavía";
    ul.appendChild(li);
  }
  for (const item of b.services) {
    const li = document.createElement("li");
    li.textContent = `${item.service ? item.service.name : "Servicio eliminado"} × ${item.quantity}`;
    ul.appendChild(li);
  }

  art.append(h, mail, when, ul);
  return art;
}


async function reloadBookings(changedId) {
  const res = await fetch("/api/bookings");
  const bookings = await res.json();
  bookingsList.replaceChildren(...bookings.map(renderBooking));
  document.getElementById("bookings-empty").hidden = bookings.length > 0;
  const changed = bookingsList.querySelector(`[data-id="${changedId}"]`);
  if (changed) flash(changed);
}

if (bookingsList) {
  socket.on("booking:created", (b) => {
    reloadBookings(b.id);
    toast(`Nueva reserva de ${b.clientName}`);
  });
  socket.on("booking:updated", (b) => {
    reloadBookings(b.id);
    toast(`Reserva actualizada: ${b.clientName}`);
  });
}
