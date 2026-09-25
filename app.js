const firebaseConfig = {
  apiKey: "AIzaSyD_ru-VW32S77NlTJgpV7gHBrSDBEUNZPs",
  authDomain: "plan-de-vida-be189.firebaseapp.com",
  projectId: "plan-de-vida-be189",
  storageBucket: "plan-de-vida-be189.firebasestorage.app",
  messagingSenderId: "970544287065",
  appId: "1:970544287065:web:cde28f9a2260f636e95048"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Revisar sesión al cargar
document.addEventListener('DOMContentLoaded', () => {
    const role = sessionStorage.getItem('userRole');
    const name = sessionStorage.getItem('userName');
    if (role && name) {
        mostrarApp(role, name);
    }
});

// Función directa disparada por el botón (sin bloqueos de formularios)
window.intentarLogin = function() {
    const userInput = document.getElementById('usuario').value.trim();
    const passInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    errorMsg.style.display = 'none';

    if (userInput === "DRPEREYRA" && passInput === "235689") {
        sessionStorage.setItem('userRole', 'admin');
        sessionStorage.setItem('userName', 'Dr. Pereyra');
        mostrarApp('admin', 'Dr. Pereyra');
    } else {
        errorMsg.style.display = 'block';
    }
}

function mostrarApp(role, userName) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'flex';
    document.getElementById('displayUser').innerText = `${userName} (${role.toUpperCase()})`;
    
    const navContainer = document.getElementById('dynamicNav');
    if (role === 'admin') {
        navContainer.innerHTML = `
            <button class="nav-btn" onclick="cargarVista('pacientes.html')">Pacientes</button>
            <div class="nav-item">
                <button class="dropdown-toggle">Protocolo ▾</button>
                <div class="dropdown-menu">
                    <button onclick="cargarVista('exp_autor.html')">Autorrealización</button>
                    <button onclick="cargarVista('exp_ma.html')">Mapa de autenticidad</button>
                    <button onclick="cargarVista('exp_urg_sentido.html')">Urgencia y sentido</button>
                    <button onclick="cargarVista('exp_vys.html')">Viabilidad y sostén</button>
                    <button onclick="cargarVista('exp_val_freno.html')">Valoración y freno</button>
                    <button onclick="cargarVista('exp_explvital.html')">Exploración Vital</button>
                </div>
            </div>
            <button class="nav-btn" onclick="cargarVista('integracion.html')">Integración y conclusiones</button>
        `;
    }
}

window.cargarVista = function(urlPagina) {
    document.getElementById('mainFrame').src = urlPagina;
}

window.cerrarSesion = function() {
    sessionStorage.clear();
    location.reload();
}
