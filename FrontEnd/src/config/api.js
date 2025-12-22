//File này dùng để cấu hình API URL cho Frontend để phục vụ cho việc deploy lên github pages
export const API_BASE_URL = import.meta.env.PROD
  ? 'https://cv-backend-side.onrender.com'
  : 'http://localhost:8888';