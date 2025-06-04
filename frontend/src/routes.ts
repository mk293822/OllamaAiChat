// routes.ts
export const routes = {
  dashboard: "/dashboard",
  chat: "/dashboard/c/:conversation_id",
  welcome: "/",
};
export const authRoutes = {
  login: "/login",
  register: "/register",
};
export const errorRoutes = {
  notFound: "*",
  forbidden: "/403",
};


