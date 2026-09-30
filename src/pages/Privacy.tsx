import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { SITE } from '../data/site';

// NOTE: Placeholder text. Replace with the client's actual privacy policy before launch.
const sections = [
  ['Information we collect', 'When you fill a form on this site (contact or installation request) we collect the details you enter, such as your name, phone number, address and TV model.'],
  ['How we use it', 'We use these details only to respond to your request, schedule installations, provide warranty service and improve our products.'],
  ['Sharing', 'We do not sell your personal information. Details may be shared with our service partners only to fulfil your request.'],
  ['Your choices', 'You can ask us to update or delete your information at any time by calling our support numbers.'],
];

export default function Privacy() {
  return (
    <>
      <PageHero crumb="Privacy" eyebrow="Legal" title="Privacy" accent="policy." sub={`How ${SITE.company} handles your information.`} />
      <section className="section section--tight">
        <div className="container prose">
          {sections.map(([h, p], i) => (
            <Reveal key={h} delay={i * 0.05}>
              <h2>{h}</h2>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
