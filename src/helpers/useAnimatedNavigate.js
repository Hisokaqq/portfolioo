import { useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Shared "animate out, then navigate" behavior used by the Projects and
// Me/Contact pages. Returns two animation controls to bind to elements plus
// an `animateTo(path)` that plays the exit animation before routing.
export default function useAnimatedNavigate(delay = 300) {
  const navigate = useNavigate();
  const control = useAnimation();
  const control2 = useAnimation();

  const animateTo = (to) => {
    control.start({ y: -20, transition: { duration: 0.3 } });
    control2.start({ opacity: 0, transition: { duration: 0.3 } });
    setTimeout(() => {
      navigate(to);
    }, delay);
  };

  return { control, control2, animateTo };
}
