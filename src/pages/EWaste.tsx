import { Recycle, Truck, Factory, Leaf } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { Reveal } from '../components/Reveal';
import { MagneticButton } from '../components/MagneticButton';

const steps = [
  { icon: <Truck size={22} />, t: 'Hand it over', s: 'Contact us to return old or end-of-life Willett electronics.' },
  { icon: <Factory size={22} />, t: 'Authorised recycling', s: 'E-waste goes to authorised recyclers, not the local scrap yard.' },
  { icon: <Recycle size={22} />, t: 'Materials recovered', s: 'Metals, glass and plastics are recovered and reused where possible.' },
  { icon: <Leaf size={22} />, t: 'Safer disposal', s: 'Hazardous parts are handled safely, keeping them out of soil and water.' },
];

export default function EWaste() {
  return (
    <>
      <PageHero arts={['forest', 'lagoon']} crumb="E-waste" eyebrow="Responsibility" title="Good TVs," accent="good endings." sub="Electronics don’t belong in landfills. Here’s how Willett helps you dispose of old devices responsibly." />
      <section className="section section--tight">
        <div className="container ew-grid">
          {steps.map((x, i) => (
            <Reveal key={x.t} className="support-card" delay={i * 0.06}>
              <span className="support-icon">{x.icon}</span>
              <p className="support-kicker">Step {i + 1}</p>
              <h3>{x.t}</h3>
              <p className="muted">{x.s}</p>
            </Reveal>
          ))}
        </div>
        <div className="container" style={{ marginTop: 48, textAlign: 'center' }}>
          <MagneticButton to="/contact?topic=other">Arrange an e-waste pickup</MagneticButton>
        </div>
      </section>
    </>
  );
}
