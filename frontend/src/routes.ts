// routes.ts
export const routes = {
	welcome: "/welcome",
	dashboard: "/",
	chat: "/c/:conversation_id",
};
export const authRoutes = {
  login: "/login",
  register: "/register",
};
export const errorRoutes = {
  notFound: "*",
  forbidden: "/403",
};


