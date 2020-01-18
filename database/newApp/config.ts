export const Config = {
    PasswordRegEx: /([A-Z]|[a-z]|[0-9]|[`~!@#$%^&*()\-=+\{\[\]\}\\\|;:'",<.>/?_ ]){8,32}/g,
};

export type ConfigType = typeof Config;
