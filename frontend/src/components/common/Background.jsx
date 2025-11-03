import React from "react";

/** Global background image with a subtle glow overlay.
 * Mount it once per page (or in App) and it will sit behind everything.
 */
export default function Background({ src = "/assets/images/bg-banks2.jpg" }) {
  return (
    <>
      <div className="page-bg" style={{ backgroundImage: `url(${src})` }} />
      <div className="page-overlay" />
    </>
  );
}
