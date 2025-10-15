// Configuración de la API
const API_BASE_URL = 'http://localhost:8080/api'; // URL del backend
const API_TEST_ENDPOINT = '/test/health'; // Endpoint de prueba del backend

// Configuración para desarrollo
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isDevelopment ? API_BASE_URL : '/api'; // En producción, asume que el frontend y backend están en el mismo dominio

// Elementos del DOM
const apiStatus = document.getElementById('api-status');
const statusText = document.getElementById('status-text');
const testApiBtn = document.getElementById('test-api-btn');
const apiResult = document.getElementById('api-result');
const resultContent = document.getElementById('result-content');

// Función para mostrar estado
function showStatus(message, isError = false) {
    statusText.textContent = message;
    statusText.className = isError ? 'error' : '';
}

// Función para probar la conexión con la API
async function testApiConnection() {
    showStatus('Conectando...');
    apiResult.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}${API_TEST_ENDPOINT}`);
        
        if (response.ok) {
            const data = await response.json();
            showStatus('Conexión exitosa');
            
            // Mostrar resultado
            resultContent.textContent = JSON.stringify(data, null, 2);
            apiResult.style.display = 'block';
        } else if (response.status === 500) {
            throw new Error('Error interno del servidor. Asegúrate de que el backend esté corriendo.');
        } else if (response.status === 404) {
            throw new Error('Endpoint no encontrado. Verifica la URL del backend.');
        } else {
            throw new Error(`Error HTTP: ${response.status}`);
        }
    } catch (error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
            showStatus('Backend no encontrado. Asegúrate de que esté corriendo en http://localhost:8080', true);
        } else {
            showStatus(`Error: ${error.message}`, true);
        }
        resultContent.textContent = error.toString();
        apiResult.style.display = 'block';
    }
}

// Función para manejar el login
async function handleLogin(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userEmail', email);
            showLoginSuccess();
            return { success: true };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Credenciales inválidas' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para manejar el registro
async function handleRegister(userData) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userEmail', userData.email);
            showLoginSuccess();
            return { success: true };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Error en el registro' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para crear oferta de trabajo
async function createJob(jobData) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return { success: false, message: 'No autenticado' };
    }

    try {
        const response = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(jobData),
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al crear oferta' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para actualizar oferta de trabajo
async function updateJob(jobId, jobData) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return { success: false, message: 'No autenticado' };
    }

    try {
        const response = await fetch(`${API_URL}/jobs/${jobId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(jobData),
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al actualizar oferta' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para eliminar oferta de trabajo
async function deleteJob(jobId) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return { success: false, message: 'No autenticado' };
    }

    try {
        const response = await fetch(`${API_URL}/jobs/${jobId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al eliminar oferta' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para crear candidato
async function createCandidate(candidateData) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return { success: false, message: 'No autenticado' };
    }

    try {
        const response = await fetch(`${API_URL}/clipers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(candidateData),
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al crear candidato' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para actualizar candidato
async function updateCandidate(candidateId, candidateData) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return { success: false, message: 'No autenticado' };
    }

    try {
        const response = await fetch(`${API_URL}/clipers/${candidateId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(candidateData),
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al actualizar candidato' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para eliminar candidato
async function deleteCandidate(candidateId) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return { success: false, message: 'No autenticado' };
    }

    try {
        const response = await fetch(`${API_URL}/clipers/${candidateId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al eliminar candidato' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para crear empresa
async function createCompany(companyData) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return { success: false, message: 'No autenticado' };
    }

    try {
        const response = await fetch(`${API_URL}/companies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(companyData),
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al crear empresa' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para actualizar empresa
async function updateCompany(companyId, companyData) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return { success: false, message: 'No autenticado' };
    }

    try {
        const response = await fetch(`${API_URL}/companies/${companyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(companyData),
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al actualizar empresa' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para eliminar empresa
async function deleteCompany(companyId) {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return { success: false, message: 'No autenticado' };
    }

    try {
        const response = await fetch(`${API_URL}/companies/${companyId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            return { success: true };
        } else {
            const error = await response.json();
            return { success: false, message: error.message || 'Error al eliminar empresa' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para obtener datos protegidos
async function getProtectedData() {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        return { success: false, message: 'No autenticado' };
    }

    try {
        const response = await fetch(`${API_URL}/protected`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            return { success: true, data };
        } else {
            return { success: false, message: 'No autorizado' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para obtener ofertas de trabajo
async function getJobs() {
    try {
        const response = await fetch(`${API_URL}/jobs`);
        
        if (response.ok) {
            const jobs = await response.json();
            return { success: true, jobs };
        } else {
            return { success: false, message: 'Error al obtener ofertas' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para obtener candidatos
async function getCandidates() {
    try {
        const response = await fetch(`${API_URL}/clipers`);
        
        if (response.ok) {
            const candidates = await response.json();
            return { success: true, candidates };
        } else {
            return { success: false, message: 'Error al obtener candidatos' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para obtener empresas
async function getCompanies() {
    try {
        const response = await fetch(`${API_URL}/companies`);
        
        if (response.ok) {
            const companies = await response.json();
            return { success: true, companies };
        } else {
            return { success: false, message: 'Error al obtener empresas' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Función para mostrar login exitoso
function showLoginSuccess() {
    const authLink = document.getElementById('auth-link');
    const authItem = document.getElementById('auth-item');
    
    authLink.textContent = 'Logout';
    authLink.setAttribute('data-page', 'logout');
    
    // Redirigir a la página de inicio
    showPage('home');
}

// Función para manejar logout
function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    
    const authLink = document.getElementById('auth-link');
    const authItem = document.getElementById('auth-item');
    
    authLink.textContent = 'Login';
    authLink.setAttribute('data-page', 'login');
    
    showPage('home');
}

// Función para mostrar página
function showPage(pageName) {
    // Ocultar todas las páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });
    
    // Mostrar la página solicitada
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.style.display = 'block';
        targetPage.classList.add('active');
    }
    
    // Actualizar menú de navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
    
    // Cargar contenido específico de la página
    switch(pageName) {
        case 'jobs':
            loadJobs();
            break;
        case 'candidates':
            loadCandidates();
            break;
        case 'companies':
            loadCompanies();
            break;
    }
}

// Función para cargar ofertas de trabajo
async function loadJobs() {
    const jobsContainer = document.getElementById('jobs-container');
    const loadingElement = document.getElementById('jobs-loading');
    
    loadingElement.style.display = 'block';
    jobsContainer.innerHTML = '';
    
    // Si no hay backend, mostrar datos de ejemplo
    if (!isDevelopment) {
        showSampleJobs();
        loadingElement.style.display = 'none';
        return;
    }
    
    const result = await getJobs();
    
    if (result.success) {
        // Si no hay ofertas, mostrar mensaje
        if (result.jobs.length === 0) {
            jobsContainer.innerHTML = '<p class="no-data">No hay ofertas de trabajo disponibles.</p>';
        } else {
            // Mostrar ofertas
            result.jobs.forEach(job => {
                const jobCard = createJobCard(job);
                jobsContainer.appendChild(jobCard);
            });
        }
    } else {
        // Si hay error, mostrar datos de ejemplo
        showSampleJobs();
    }
    
    loadingElement.style.display = 'none';
}

// Función para mostrar ofertas de ejemplo
function showSampleJobs() {
    const jobsContainer = document.getElementById('jobs-container');
    const sampleJobs = [
        {
            title: 'Desarrollador Full Stack',
            company: 'TechCorp',
            location: 'Bogotá',
            salary: '$2.500.000 - $4.000.000',
            description: 'Buscamos un desarrollador con experiencia en React, Node.js y bases de datos SQL.'
        },
        {
            title: 'Diseñador UX/UI',
            company: 'Design Studio',
            location: 'Medellín',
            salary: '$2.000.000 - $3.500.000',
            description: 'Empresa creativa busca diseñador con experiencia en Figma y prototipado.'
        },
        {
            title: 'Analista de Datos',
            company: 'Data Solutions',
            location: 'Remoto',
            salary: '$2.800.000 - $4.500.000',
            description: 'Analista para trabajar con Python, SQL y herramientas de visualización.'
        }
    ];
    
    sampleJobs.forEach(job => {
        const jobCard = createJobCard(job);
        jobsContainer.appendChild(jobCard);
    });
}

// Función para crear tarjeta de oferta
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    
    card.innerHTML = `
        <h3>${job.title || 'Título no disponible'}</h3>
        <p><strong>Empresa:</strong> ${job.company || 'No especificada'}</p>
        <p><strong>Ubicación:</strong> ${job.location || 'No especificada'}</p>
        <p><strong>Salario:</strong> ${job.salary || 'No especificado'}</p>
        <p><strong>Descripción:</strong> ${job.description || 'No disponible'}</p>
        <div class="job-actions">
            <button class="btn-apply">Postularse</button>
            <button class="btn-edit" data-id="${job.id || ''}">Editar</button>
            <button class="btn-delete" data-id="${job.id || ''}">Eliminar</button>
        </div>
    `;
    
    // Agregar eventos a los botones de acción
    const editBtn = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            editJob(job.id || job._id);
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            deleteJob(job.id || job._id);
        });
    }
    
    return card;
}

// Función para cargar candidatos
async function loadCandidates() {
    const candidatesContainer = document.getElementById('candidates-container');
    const loadingElement = document.getElementById('candidates-loading');
    
    loadingElement.style.display = 'block';
    candidatesContainer.innerHTML = '';
    
    // Si no hay backend, mostrar datos de ejemplo
    if (!isDevelopment) {
        showSampleCandidates();
        loadingElement.style.display = 'none';
        return;
    }
    
    const result = await getCandidates();
    
    if (result.success) {
        // Si no hay candidatos, mostrar mensaje
        if (result.candidates.length === 0) {
            candidatesContainer.innerHTML = '<p class="no-data">No hay candidatos disponibles.</p>';
        } else {
            // Mostrar candidatos
            result.candidates.forEach(candidate => {
                const candidateCard = createCandidateCard(candidate);
                candidatesContainer.appendChild(candidateCard);
            });
        }
    } else {
        // Si hay error, mostrar datos de ejemplo
        showSampleCandidates();
    }
    
    loadingElement.style.display = 'none';
}

// Función para mostrar candidatos de ejemplo
function showSampleCandidates() {
    const candidatesContainer = document.getElementById('candidates-container');
    const sampleCandidates = [
        {
            name: 'Juan Pérez',
            email: 'juan.perez@example.com',
            phone: '3001234567',
            experience: '5 años',
            skills: 'JavaScript, React, Node.js'
        },
        {
            name: 'María García',
            email: 'maria.garcia@example.com',
            phone: '3007654321',
            experience: '3 años',
            skills: 'Python, Django, SQL'
        },
        {
            name: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@example.com',
            phone: '3009876543',
            experience: '7 años',
            skills: 'Java, Spring Boot, MySQL'
        }
    ];
    
    sampleCandidates.forEach(candidate => {
        const candidateCard = createCandidateCard(candidate);
        candidatesContainer.appendChild(candidateCard);
    });
}

// Función para crear tarjeta de candidato
function createCandidateCard(candidate) {
    const card = document.createElement('div');
    card.className = 'candidate-card';
    
    card.innerHTML = `
        <h3>${candidate.name || 'Nombre no disponible'}</h3>
        <p><strong>Email:</strong> ${candidate.email || 'No especificado'}</p>
        <p><strong>Teléfono:</strong> ${candidate.phone || 'No especificado'}</p>
        <p><strong>Experiencia:</strong> ${candidate.experience || 'No especificada'}</p>
        <p><strong>Habilidades:</strong> ${candidate.skills || 'No especificadas'}</p>
        <div class="candidate-actions">
            <button class="btn-contact">Contactar</button>
            <button class="btn-edit" data-id="${candidate.id || ''}">Editar</button>
            <button class="btn-delete" data-id="${candidate.id || ''}">Eliminar</button>
        </div>
    `;
    
    // Agregar eventos a los botones de acción
    const editBtn = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            editCandidate(candidate.id || candidate._id);
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            deleteCandidate(candidate.id || candidate._id);
        });
    }
    
    return card;
}

// Función para cargar empresas
async function loadCompanies() {
    const companiesContainer = document.getElementById('companies-container');
    const loadingElement = document.getElementById('companies-loading');
    
    loadingElement.style.display = 'block';
    companiesContainer.innerHTML = '';
    
    // Si no hay backend, mostrar datos de ejemplo
    if (!isDevelopment) {
        showSampleCompanies();
        loadingElement.style.display = 'none';
        return;
    }
    
    const result = await getCompanies();
    
    if (result.success) {
        // Si no hay empresas, mostrar mensaje
        if (result.companies.length === 0) {
            companiesContainer.innerHTML = '<p class="no-data">No hay empresas disponibles.</p>';
        } else {
            // Mostrar empresas
            result.companies.forEach(company => {
                const companyCard = createCompanyCard(company);
                companiesContainer.appendChild(companyCard);
            });
        }
    } else {
        // Si hay error, mostrar datos de ejemplo
        showSampleCompanies();
    }
    
    loadingElement.style.display = 'none';
}

// Función para mostrar empresas de ejemplo
function showSampleCompanies() {
    const companiesContainer = document.getElementById('companies-container');
    const sampleCompanies = [
        {
            name: 'TechCorp',
            industry: 'Tecnología',
            size: '100-500 empleados',
            location: 'Bogotá',
            description: 'Empresa líder en soluciones tecnológicas para el sector financiero.'
        },
        {
            name: 'Design Studio',
            industry: 'Diseño',
            size: '20-50 empleados',
            location: 'Medellín',
            description: 'Estudio creativo especializado en diseño UX/UI y branding.'
        },
        {
            name: 'Data Solutions',
            industry: 'Análisis de Datos',
            size: '50-100 empleados',
            location: 'Remoto',
            description: 'Consultora especializada en análisis de datos y business intelligence.'
        }
    ];
    
    sampleCompanies.forEach(company => {
        const companyCard = createCompanyCard(company);
        companiesContainer.appendChild(companyCard);
    });
}

// Función para crear tarjeta de empresa
function createCompanyCard(company) {
    const card = document.createElement('div');
    card.className = 'company-card';
    
    card.innerHTML = `
        <h3>${company.name || 'Nombre no disponible'}</h3>
        <p><strong>Industria:</strong> ${company.industry || 'No especificada'}</p>
        <p><strong>Tamaño:</strong> ${company.size || 'No especificado'}</p>
        <p><strong>Ubicación:</strong> ${company.location || 'No especificada'}</p>
        <p><strong>Descripción:</strong> ${company.description || 'No disponible'}</p>
        <div class="company-actions">
            <button class="btn-view">Ver Detalles</button>
            <button class="btn-edit" data-id="${company.id || ''}">Editar</button>
            <button class="btn-delete" data-id="${company.id || ''}">Eliminar</button>
        </div>
    `;
    
    // Agregar eventos a los botones de acción
    const editBtn = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            editCompany(company.id || company._id);
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            deleteCompany(company.id || company._id);
        });
    }
    
    return card;
}

// Función para editar oferta de trabajo
function editJob(jobId) {
    // En una aplicación real, esto abriría un modal o formulario de edición
    const jobData = {
        title: 'Nueva Oferta Editada',
        company: 'Empresa Editada',
        location: 'Nueva Ubicación',
        salary: '$3.000.000 - $5.000.000',
        description: 'Descripción editada de la oferta de trabajo.'
    };
    
    updateJob(jobId, jobData).then(result => {
        if (result.success) {
            alert('Oferta actualizada exitosamente');
            loadJobs(); // Recargar las ofertas
        } else {
            alert('Error al actualizar la oferta: ' + result.message);
        }
    });
}

// Función para editar candidato
function editCandidate(candidateId) {
    // En una aplicación real, esto abriría un modal o formulario de edición
    const candidateData = {
        name: 'Candidato Editado',
        email: 'editado@example.com',
        phone: '3001112222',
        experience: '10 años',
        skills: 'JavaScript, React, Node.js, Python'
    };
    
    updateCandidate(candidateId, candidateData).then(result => {
        if (result.success) {
            alert('Candidato actualizado exitosamente');
            loadCandidates(); // Recargar los candidatos
        } else {
            alert('Error al actualizar el candidato: ' + result.message);
        }
    });
}

// Función para editar empresa
function editCompany(companyId) {
    // En una aplicación real, esto abriría un modal o formulario de edición
    const companyData = {
        name: 'Empresa Editada',
        industry: 'Nueva Industria',
        size: '200-500 empleados',
        location: 'Nueva Ciudad',
        description: 'Descripción editada de la empresa.'
    };
    
    updateCompany(companyId, companyData).then(result => {
        if (result.success) {
            alert('Empresa actualizada exitosamente');
            loadCompanies(); // Recargar las empresas
        } else {
            alert('Error al actualizar la empresa: ' + result.message);
        }
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Probar conexión al cargar
    testApiConnection();
    
    // Manejar clic en botón de prueba de API
    testApiBtn.addEventListener('click', testApiConnection);
    
    // Manejar navegación
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            
            if (page === 'logout') {
                handleLogout();
            } else {
                showPage(page);
            }
        });
    });
    
    // Manejar pestañas de autenticación
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Actualizar pestañas activas
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Mostrar formulario correspondiente
            if (tabName === 'login') {
                document.getElementById('login-form-container').style.display = 'block';
                document.getElementById('register-form-container').style.display = 'none';
            } else {
                document.getElementById('login-form-container').style.display = 'none';
                document.getElementById('register-form-container').style.display = 'block';
            }
        });
    });
    
    // Manejar formulario de login
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('login-message');
        
        messageDiv.textContent = 'Iniciando sesión...';
        messageDiv.className = 'message';
        
        const result = await handleLogin(email, password);
        
        if (result.success) {
            messageDiv.textContent = '¡Inicio de sesión exitoso!';
            messageDiv.className = 'message success';
            
            // Redirigir a la página de inicio después de un momento
            setTimeout(() => {
                showPage('home');
            }, 1000);
        } else {
            messageDiv.textContent = result.message;
            messageDiv.className = 'message error';
        }
    });
    
    // Manejar formulario de registro
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value,
            role: document.getElementById('reg-role').value
        };
        
        const messageDiv = document.getElementById('register-message');
        messageDiv.textContent = 'Creando cuenta...';
        messageDiv.className = 'message';
        
        const result = await handleRegister(userData);
        
        if (result.success) {
            messageDiv.textContent = '¡Cuenta creada exitosamente!';
            messageDiv.className = 'message success';
            
            // Redirigir a la página de inicio después de un momento
            setTimeout(() => {
                showPage('home');
            }, 1000);
        } else {
            messageDiv.textContent = result.message;
            messageDiv.className = 'message error';
        }
    });
    
    // Manejar botón CTA en la página de inicio
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            showPage('jobs');
        });
    }
    
    // Verificar si hay un token guardado al cargar
    const token = localStorage.getItem('authToken');
    if (token) {
        // El usuario ya está autenticado
        showLoginSuccess();
    }
});