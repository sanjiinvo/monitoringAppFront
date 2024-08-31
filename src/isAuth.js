import { useNavigate } from "react-router-dom";

// Определение функции для получения токена и конфигурации API
const useAuth = () => {
  const navigate = useNavigate(); // Получаем функцию navigate из react-router

  // Функция для проверки авторизации и получения конфигурации для запроса
  const getAuthConfig = () => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage

    if (!token) {
      // Если токена нет, перенаправляем на страницу логина
      navigate('/login');
      return null; // Возвращаем null, чтобы можно было обработать случай без токена
    } else {
      // Если токен есть, создаем конфигурацию для запроса
      return {
        headers: {
          Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        },
      };
    }
  };

  return { getAuthConfig }; // Возвращаем функцию для использования в компонентах
};

export default useAuth;
