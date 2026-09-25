// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_ru-VW32S77NlTJgpV7gHBrSDBEUNZPs",
  authDomain: "plan-de-vida-be189.firebaseapp.com",
  projectId: "plan-de-vida-be189",
  storageBucket: "plan-de-vida-be189.firebasestorage.app",
  messagingSenderId: "970544287065",
  appId: "1:970544287065:web:cde28f9a2260f636e95048"
};

// Initialize Firebase (compatible con CDN global)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Referencias a elementos de la vista
const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');

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

// Función de Login dinámica y estricta
window.intentarLogin = async function() {
    const userInput = document.getElementById('usuario').value.trim();
    const passInput = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('error-msg');
    errorMsg.style.display = 'none';

    if (!userInput || !passInput) {
        errorMsg.innerText = "Por favor, complete ambos campos.";
        errorMsg.style.display = 'block';
        return;
    }

    // 1. Verificación de Administrador Fijo
    if (userInput.toUpperCase() === "DRPEREYRA" && passInput === "235689") {
        sessionStorage.setItem('userName', 'Dr. Pereyra');
        sessionStorage.setItem('userRole', 'admin');
        mostrarApp('admin', 'Dr. Pereyra');
        return;
    }

    // 2. Verificación de Paciente en Base de Datos (Firestore)
    // El usuario ingresa su Apellido y la contraseña es su Código Interno
    try {
        const querySnapshot = await db.collection("pacientes")
            .where("codigo", "==", passInput)
            .get();

        if (querySnapshot.empty) {
            errorMsg.innerText = "Usuario o código interno incorrectos.";
            errorMsg.style.display = 'block';
            return;
        }

        let pacienteEncontrado = false;
        let nombrePaciente = "";

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Verificamos si el apellido ingresado coincide (ignorando mayúsculas/minúsculas parciales)
            const nombreRegistrado = data.nombre ? data.nombre.toLowerCase() : "";
            const apellidoIngresado = userInput.toLowerCase();

            if (nombreRegistrado.includes(apellidoIngresado)) {
                pacienteEncontrado = true;
                nombrePaciente = data.nombre;
            }
        });

        if (pacienteEncontrado) {
            sessionStorage.setItem('userName', nombrePaciente);
            sessionStorage.setItem('userRole', 'patient');
            sessionStorage.setItem('patientCode', passInput);
            mostrarApp('patient', nombrePaciente);
        } else {
            errorMsg.innerText = "El apellido no coincide con el código ingresado.";
            errorMsg.style.display = 'block';
        }

    } catch (error) {
        console.error("Error al validar el acceso:", error);
        errorMsg.innerText = "Error de conexión con la base de datos.";
        errorMsg.style.display = 'block';
    }
}

function mostrarLogin() {
    loginSection.style.display = 'flex';
    appSection.style.display = 'none';
}

function mostrarApp(role, userName) {
    loginSection.style.display = 'none';
    appSection.style.display = 'flex';
    document.getElementById('displayUser').innerText = `${userName} (${role === 'admin' ? 'ADMINISTRADOR' : 'PACIENTE'})`;
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
    location.reload();
}
