import './About.css';

const About = ({ bio, education, goal }) => {
  return (
    <section className="about section" id="about">
      <h2 className="section-title">About Me</h2>

      <div className="about-card card">
        <div className="about-block">
          <h3>Biography</h3>
          <p>{bio}</p>
        </div>

        <div className="about-block">
          <h3>Education</h3>
          <p>{education}</p>
        </div>

        <div className="about-block">
          <h3>Career Goal</h3>
          <p>{goal}</p>
        </div>
      </div>
    </section>
  );
};

export default About;
