import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_SSO_CLIENT_ID,
        authority: process.env.NEXT_PUBLIC_TENANT_URL,
        redirectUri: process.env.NEXT_PUBLIC_SSO_REDIRECT_URL,
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false,
    },
    scopes: [
        'user.read'
    ],
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
        allowNativeBroker: false,
    },
};