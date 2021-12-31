
const domain = 'localhost' || 'tugasguru.com';

const compile = (e: string, url?: string) => `https://${e}.${domain}/`;


export const auth = {
    login: compile("account"),
    register: compile("account", "register"),
}


export const routes = {
    auth
};

export default routes;