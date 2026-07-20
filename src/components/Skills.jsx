import './Skills.css';

const Skills = ({ skillList }) => {
  return (
    <section className="skills section" id="skills">
      <h2 className="section-title">Skills</h2>

      <div className="skills-grid">
        {skillList.map((skill) => (
          <div className="skill-badge card" key={skill}>
            {skill}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
