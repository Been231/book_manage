const API_BASE = 'http://127.0.0.1:8000';

/**
 * ===== TOKEN MANAGEMENT =====
 */
function getToken() {
    return localStorage.getItem('access_token');
}

function saveToken(access, refresh) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
}

function clearToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

function isLoggedIn() {
    return !!getToken();
}


/**
 * ===== API REQUEST HELPER =====
 */
async function apiFetch(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        clearToken();
        window.location.href = 'login.html';
        return;
    }

    return response;
}


/**
 * ===== AUTHENTICATION ENDPOINTS =====
 */
async function login(username, password) {
    const response = await fetch(`${API_BASE}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        saveToken(data.access, data.refresh);
        return { success: true };
    }
    return { success: false, message: 'Sai username hoac password' };
}

async function logout() {
    try {
        const response = await apiFetch('/api/logout/', {
            method: 'POST',
        });

        if (response && response.ok) {
            clearToken();
            window.location.href = 'login.html';
            return { success: true, message: 'Đăng xuất thành công' };
        } else {
            clearToken();
            window.location.href = 'login.html';
            return { success: true, message: 'Đăng xuất thành công' };
        }
    } catch (error) {
        console.error('Logout error:', error);
        clearToken();
        window.location.href = 'login.html';
        return { success: true, message: 'Đăng xuất thành công' };
    }
}
