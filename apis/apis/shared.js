export const isLoggedIn = () => {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('access_token');
    }
    return false;
}

export const getUserRoles = () => {
    if (typeof window !== 'undefined') {
        const roles = localStorage.getItem('roles');
        return roles || '';
    }
    return '';
}