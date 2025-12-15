let turnos = [];
let turnoAEliminar = null;

function esc(str) {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

function formatFecha(f) {
    if (!f) return "";
    const [y, m, d] = f.split("-");
    return `${d}-${m}-${y}`;
}

function getPeluqueroNombre(value) {
    switch (value) {
        case 'peluquero1': return 'Peluquero 1';
        case 'peluquero2': return 'Peluquero 2';
        case 'peluquero3': return 'Peluquero 3';
        case 'peluquero4': return 'Peluquero 4';
        default: return 'Desconocido';
    }
}

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        setTimeout(() => document.getElementById('loader').remove(), 500);
        document.getElementById('appContent').style.opacity = '1';
    }, 2600);
});

const fechaEl = document.getElementById('fecha');
const hoy = new Date();
const y = hoy.getFullYear();
const m = String(hoy.getMonth() + 1).padStart(2, '0');
const d = String(hoy.getDate()).padStart(2, '0');
const fechaActual = `${y}-${m}-${d}`;
fechaEl.min = fechaActual;
fechaEl.value = fechaActual;

const horaEl = document.getElementById('hora');
horaEl.innerHTML = '<option value="">-- elegir --</option>';
for (let h = 10; h <= 21; h++) {
    ['00', '30'].forEach(min => {
        let hh = String(h).padStart(2, '0');
        let val = `${hh}:${min}`;
        horaEl.innerHTML += `<option value="${val}">${val}</option>`;
    });
}

const clienteEl = document.getElementById('cliente');
const peluqueroEl = document.getElementById('peluquero');

function addTurno() {
    const cliente = clienteEl.value.trim();
    const peluquero = peluqueroEl.value;
    const fechaV = fechaEl.value;
    const horaV = horaEl.value;

    if (!cliente || !peluquero || !fechaV || !horaV) return alert("Completa todos los campos");

    turnos.push({ cliente, peluquero, fecha: fechaV, hora: horaV });

    clienteEl.value = "";
    peluqueroEl.value = "";
    fechaEl.value = fechaActual;
    horaEl.value = "";

    render();
}

function abrirModal(idx) {
    turnoAEliminar = idx;
    const t = turnos[idx];
    document.getElementById("modalText").innerText = `${t.cliente} (${getPeluqueroNombre(t.peluquero)}) — ${formatFecha(t.fecha)} / ${t.hora}`;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modalOverlay').style.display = 'none';
    turnoAEliminar = null;
}

function confirmarEliminar() {
    if (turnoAEliminar !== null) {
        turnos.splice(turnoAEliminar, 1);
        render();
    }
    cerrarModal();
}

function render() {
    const lista = document.getElementById('lista');
    const empty = document.getElementById('empty');
    const filtro = document.getElementById('filtro').value;

    lista.innerHTML = '';
    const filtrados = turnos.filter(t => filtro === 'todos' ? true : t.peluquero === filtro);
    empty.style.display = filtrados.length ? 'none' : 'block';

    filtrados.forEach((t, idx) => {
        const realIdx = turnos.indexOf(t);
        const div = document.createElement('div');
        div.className = 'turno';
        div.innerHTML = `
            <div class="avatar" aria-hidden>
                <svg class="svg-icon" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 
                    1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 
                    1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </div>

            <div class="meta">
                <div style="display:flex;gap:8px;align-items:center">
                    <div class="name">${esc(t.cliente)}</div>
                    <span class="chip ${t.peluquero}">
                        ${getPeluqueroNombre(t.peluquero)}
                    </span>
                </div>
                <div class="sub">📅 ${formatFecha(t.fecha)} — ⏰ ${t.hora}</div>
            </div>

            <div class="actions">
                <button class="btn-del" onclick="abrirModal(${realIdx})">Eliminar</button>
            </div>
        `;
        lista.appendChild(div);
    });
}

const canvasP = document.getElementById('particles');
const ctxP = canvasP.getContext('2d');

function resizeP() { canvasP.width = window.innerWidth; canvasP.height = window.innerHeight; }
resizeP();
window.addEventListener('resize', resizeP);

const particles = [];
const totalParticles = 120;
for (let i = 0; i < totalParticles; i++) {
    particles.push({
        x: Math.random() * canvasP.width,
        y: Math.random() * canvasP.height,
        r: Math.random() * 3.5 + 1.5,
        dx: (Math.random() - 0.5) * 1.1,
        dy: (Math.random() - 0.5) * 1.1,
        alpha: Math.random() * 0.8 + 0.6,
        pulse: Math.random() * 0.04 + 0.02
    });
}

function drawP() {
    ctxP.clearRect(0, 0, canvasP.width, canvasP.height);
    particles.forEach(p => {
        ctxP.shadowBlur = 22;
        ctxP.shadowColor = "rgba(193,18,31,1)";
        ctxP.beginPath();
        ctxP.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctxP.fillStyle = `rgba(255,40,40,${p.alpha})`;
        ctxP.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvasP.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvasP.height) p.dy *= -1;
        p.alpha += p.pulse;
        if (p.alpha <= 0.3 || p.alpha >= 1) p.pulse *= -1;
    });
    requestAnimationFrame(drawP);
}
drawP();

document.getElementById('fecha-area').addEventListener('click', () => {
    fechaEl.showPicker?.() || fechaEl.focus();
});