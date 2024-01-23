export const isLoggedIn = () => {
    if (typeof window !== 'undefined') {
        return !!localStorage.getItem('access_token');
    }
    return false;
}