import { Link } from "react-router-dom";

function About() {
  return (
    <main className="about-page">
      <section className="home-about">
        <div className="home-section-heading">
          <span className="eyebrow">About WIL Connect</span>
          <h1>Your next step should feel possible.</h1>
          <p>Work-integrated learning connects what you study with the work you want to do. WIL Connect brings students and employers together to make those first experiences easier to find and share.</p>
        </div>
        <div className="home-audience-grid">
          <article className="home-audience home-student-audience">
            <span className="audience-number">01 / STUDENTS</span>
            <h2>Put your learning into motion.</h2>
            <p>Discover real placements, save the ones that inspire you, and build a profile that shows employers your strengths and interests.</p>
            <Link to="/opportunities">Explore student opportunities <span aria-hidden="true">-&gt;</span></Link>
          </article>
          <article className="home-audience home-employer-audience">
            <span className="audience-number">02 / EMPLOYERS</span>
            <h2>Help new talent find a way in.</h2>
            <p>Tell students who you are, share meaningful work, and connect with emerging talent ready to learn and contribute.</p>
            <Link to="/register" state={{ role: "Employer" }}>Create an employer profile <span aria-hidden="true">-&gt;</span></Link>
          </article>
        </div>
      </section>
    </main>
  );
}

export default About;