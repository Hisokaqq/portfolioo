import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Magnetic from './Magnetic';
export default function Btn({children, backgroundColor="bg-red-400", ...attributes}) {

  const circle = useRef(null);
  const timeline = useRef(null);
  const timeoutId = useRef(null);
  useEffect( () => {
    timeline.current = gsap.timeline({paused: true})
    timeline.current
      .to(circle.current, {top: "-25%", width: "150%", duration: 0.4, ease: "power3.in"}, "enter")
      .to(circle.current, {top: "-150%", width: "125%", duration: 0.25}, "exit")
    return () => {
      if (timeoutId.current) clearTimeout(timeoutId.current)
      timeline.current?.kill()
    }
  }, [])

  const manageMouseEnter = () => {
    if(timeoutId.current) clearTimeout(timeoutId.current)
    timeline.current.tweenFromTo('enter', 'exit');
  }

  const manageMouseLeave = () => {
    timeoutId.current = setTimeout( () => {
      timeline.current.play();
    }, 300)
  }

  return (
    <Magnetic>
      <div className="roundedButton" style={{overflow: "hidden"}} onMouseEnter={() => {manageMouseEnter()}} onMouseLeave={() => {manageMouseLeave()}} onTouchStart={() => {manageMouseEnter()}} onTouchEnd={() => {manageMouseLeave()}} {...attributes}>
          {
            children
          }
        <div ref={circle}  className={`circle ${backgroundColor}`}></div>
      </div>
    </Magnetic>
  )
}