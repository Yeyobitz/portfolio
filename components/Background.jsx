import { useEffect, useState } from 'react';

const Background = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Función para detectar si es dispositivo móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Verificar al montar el componente
    checkMobile();

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkMobile);

    // Limpiar listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="background">
      {isMobile ? (
        // Fondo simple para móviles
        <div className="background-mobile" />
      ) : (
        // Fondo animado para desktop
        <div className="background-particles">
          {/* Aquí va tu código actual de partículas */}
        </div>
      )}
    </div>
  );
};

export default Background; 