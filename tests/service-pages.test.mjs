import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

const pages = [
  ['src/pages/PlatformPage.tsx', 'platformCapabilities', 'platformJourney'],
  ['src/pages/BootcampsPage.tsx', 'bootcampPrograms', 'bootcampJourney'],
  ['src/pages/TrainingPage.tsx', 'trainingPrograms', 'trainingComponents'],
  ['src/pages/AdvisoryPage.tsx', 'advisoryServices', 'advisoryJourney'],
  ['src/pages/TalentEvaluationPage.tsx', 'talentCapabilities', 'talentJourney'],
];

test('cada página de servicio incluye SEO, hero, contenido centralizado y CTA', async () => {
  for (const [file, primaryContent, secondaryContent] of pages) {
    const source = await read(file);
    assert.match(source, /<Seo/);
    assert.match(source, /<PageHero/);
    assert.match(source, new RegExp(primaryContent));
    assert.match(source, new RegExp(secondaryContent));
    assert.match(source, /<CTASection \/>/);
  }
});

test('los componentes reutilizables de la Parte 2 existen', async () => {
  const components = await Promise.all([
    read('src/components/common/PageHero.tsx'),
    read('src/components/common/CapabilityGrid.tsx'),
    read('src/components/common/JourneySteps.tsx'),
    read('src/components/common/ProgramGrid.tsx'),
    read('src/components/common/ValueBand.tsx'),
  ]);
  assert.equal(components.length, 5);
  components.forEach((component) => assert.match(component, /export function/));
});
