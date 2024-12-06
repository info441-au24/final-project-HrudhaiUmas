export async function checkAuthStatus() {
    try {
        const response = await fetch("/auth/status");
        const data = await response.json();

        return data;
    } catch (err) {
        console.log(err);
        return { authenticated: false };
    }
}