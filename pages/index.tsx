import image from "../images/pomodoro-working.gif"
import Image from "next/image";

export default function Home() {

  return (
    <div className="home-section card">
        <div className="home-image">
            <Image 
                src={image}
                width={500}
                height={500}
                alt="sample image"
            />
        </div>
        <div className="home-content">
            <div className="title">
                Manage tasks easily using pomodoro technique
            </div>
            <div className="description">
                Supercharge your productivity with Pomodoro Pro. Stay focused, manage tasks, and achieve more in timed work sessions and refreshing breaks.
            </div>
            <div className="btn-cta">
                <a href="#">Try Now!!</a>
            </div>
        </div>
    </div>
  );
}
