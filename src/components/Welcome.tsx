interface WelcomeProps {
  onBegin: () => void;
}

export default function Welcome({ onBegin }: WelcomeProps) {
  return (
    <div className="welcome">
      <h1>Before we build anything, let's talk.</h1>
      <p>
        This isn't a course. It's a short conversation to figure out what's
        actually worth your time — and then we'll create something made for you.
      </p>
      <button className="btn-primary" onClick={onBegin}>
        Let's begin
      </button>
    </div>
  );
}
