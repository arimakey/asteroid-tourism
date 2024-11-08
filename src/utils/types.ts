
export interface User {
    username: string;
    email: string;
    uid: string;
}

export type UserLogin = {
    email: string;
    password: string;
}

export type UserRegister = {
    email: string;
    password: string;
    username: string;
}

export type UserRegisterWithConfig = UserRegister & {
    pais?: string;
    idioma?: string;
}