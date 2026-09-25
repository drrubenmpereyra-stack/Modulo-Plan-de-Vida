// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_ru-VW32S77NlTJgpV7gHBrSDBEUNZPs",
  authDomain: "plan-de-vida-be189.firebaseapp.com",
  projectId: "plan-de-vida-be189",
  storageBucket: "plan-de-vida-be189.firebasestorage.app",
  messagingSenderId: "970544287065",
  appId: "1:970544287065:web:cde28f9a2260f636e95048"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Referencias a elementos de la vista
const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('loginForm');

// Comprobar estado de sesión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const currentRole = sessionStorage.getItem('userRole');
    const currentUserName = sessionStorage.getItem('userName');

    if (currentRole && currentUserName) {
        mostrarApp(currentRole, currentUserName);
    } else {
        mostrarLogin();
    }
});

// Manejo del formulario de Login con acceso fijo del Administrador
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = document.getElementById('usuario').value.trim();
        const passInput = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');
        errorMsg.style.display = 'none';

        // Verificación estricta de Credenciales del Administrador
        if (userInput === "DRPEREYRA" && passInput === "235689") {
            sessionStorage.setItem('userRole', 'admin');
            sessionStorage.setItem('userName', 'Dr. Pereyra');
            mostrarApp('admin', 'Dr. Pereyra');
            return;
        }

        // Espacio reservado para las futuras instrucciones de acceso de pacientes
        // Por ahora, cualquier otro dato genera error de credenciales
        errorMsg.innerText = "Usuario o contraseña incorrectos.";
        errorMsg.style.display = 'block';
    });
}

function mostrarLogin() {
    loginSection.style.display = 'flex';
    appSection.style.display = 'none';
}

function mostrarApp(role, userName) {
    loginSection.style.display = 'none';
    appSection.style.display = 'flex';
    document.getElementById('displayUser').innerText = `${userName} (${role.toUpperCase()})`;
    construirMenuNavegacion(role);
}

function construirMenuNavegacion(role) {
    const navContainer = document.getElementById('dynamicNav');
    if (!navContainer) return;

    let menuHTML = '';

    if (role === 'admin') {
        menuHTML = `
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
    } else if (role === 'patient') {
        menuHTML = `
            <div class="nav-item">
                <button class="dropdown-toggle">Protocolo ▾</button>
                <div class="dropdown-menu">
                    <button onclick="cargarVista('autorrealizacion.html')">Autorrealización</button>
                    <button onclick="cargarVista('mapaautenticidad.html')">Mapa de autenticidad</button>
                    <button onclick="cargarVista('urgenciaysentido.html')">Urgencia y sentido</button>
                    <button onclick="cargarVista('viaysosten.html')">Viabilidad y sostén</button>
                    <button onclick="cargarVista('valoracionyfreno.html')">Valoración y freno</button>
                    <button onclick="cargarVista('explvital.html')">Exploración Vital</button>
                </div>
            </div>
        `;
    }
    navContainer.innerHTML = menuHTML;
}

// Funciones globales accesibles desde la interfaz
window.cargarVista = function(urlPagina) {
    const iframe = document.getElementById('mainFrame');
    if (iframe) {
        iframe.src = urlPagina;
    }
}

window.cerrarSesion = function() {
    sessionStorage.clear();
    signOut(auth).then(() => {
        mostrarLogin();
    }).catch(() => {
        mostrarLogin();
    });
}
