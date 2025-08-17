export const setCookie = (name: string, value: string, days: number = 7): void => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    
    // Usa variáveis do Vite para determinar ambiente
    const isDevelopment = import.meta.env.VITE_NODE_ENV === 'development' || 
                         import.meta.env.DEV || 
                         window.location.hostname === 'localhost';
    
    const secureFlag = isDevelopment ? "" : "; Secure";
    const sameSite = isDevelopment ? "Lax" : "Strict";
    
    document.cookie = name + "=" + (value || "") + expires + "; path=/" + secureFlag + "; SameSite=" + sameSite;
    
    // Debug em desenvolvimento
    if (isDevelopment) {
        console.log("Cookie definido:", name, "=", value ? "***" : "vazio");
    }
};

export const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    // Debug em desenvolvimento
    if (import.meta.env.VITE_NODE_ENV === 'development') {
        console.log("Todos os cookies:", document.cookie);
    }
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export const eraseCookie = (name: string): void => {
    const isDevelopment = import.meta.env.VITE_NODE_ENV === 'development' || 
                         import.meta.env.DEV || 
                         window.location.hostname === 'localhost';
    
    const secureFlag = isDevelopment ? "" : "; Secure";
    const sameSite = isDevelopment ? "Lax" : "Strict";
    
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT' + secureFlag + '; SameSite=' + sameSite;
    
    if (isDevelopment) {
        console.log("Cookie removido:", name);
    }
};