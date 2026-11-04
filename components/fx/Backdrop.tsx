/** Fondo: manchas de color que se desvanecen, el agua con koi y el grano de película. */
export default function Backdrop() {
  return (
    <>
      <div className="prog" id="prog" />
      <div className="grain" aria-hidden="true" />
      <div className="fade" aria-hidden="true">
        <div className="fade-in">
          <i className="blob b1" />
          <i className="blob b2" />
          <i className="blob b3" />
        </div>
        <canvas id="water" />
      </div>
    </>
  );
}
