import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';

const CameraController = () => {
  const [isCameraFirstPerson, setIsCameraFirstPerson] = useState(true);
  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey) {
        setIsCameraFirstPerson(!isCameraFirstPerson);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCameraFirstPerson]);

  useEffect(() => {
    if (isCameraFirstPerson) {
      // First-person camera settings
      camera.position.set(0, 5, 0);
      camera.fov = 45;
      camera.rotation.set(0, 0, 0);
    } else {
      // Third-person camera settings
      camera.position.set(25, 22, 25);
      camera.rotation.set(-Math.PI / 6, 0, 0);
    }
  }, [isCameraFirstPerson, camera]);

  return null;
};

export default CameraController;
