export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="card">
          <span className="pill">Pixel Park Adventure</span>
          <h1>Family-first coding adventures for curious 7-year-olds</h1>
          <p>
            This scaffold sets up the child app shell for narrated onboarding,
            guided missions, and the milestone-three sandbox unlock defined in the plan.
          </p>
        </div>
        <div className="grid">
          <article className="card">
            <h2>Mission Path</h2>
            <p>Short guided coding missions with quick animation feedback.</p>
          </article>
          <article className="card">
            <h2>Starter Sandbox</h2>
            <p>Unlocked after mission three with remixable scene templates.</p>
          </article>
          <article className="card">
            <h2>Family Circle</h2>
            <p>Safe sharing flow designed for parent-guided creation and celebration.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
