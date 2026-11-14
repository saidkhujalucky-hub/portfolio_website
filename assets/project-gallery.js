import {
  M as Mesh, G as Group, n as MeshBasicMaterial, s as PlaneGeometry,
  u as TextureLoader, h as SRGBColorSpace,
} from './three-Dg8cbNBX.js';

const projects = [
  {
    id: 'echo', name: 'ECHO', image: './assets/echo-project.png',
    href: 'https://saidkhujalucky-hub.github.io/my_game/web/',
    kind: {ru: '3D-головоломка', uz: '3D boshqotirma', en: '3D puzzle game'},
    description: {
      ru: 'Исследуйте затопленный город и решайте головоломки вместе со своими копиями из прошлых временных петель.',
      uz: 'Suv bosgan shaharni o‘rganing va avvalgi vaqt halqalaridagi nusxalaringiz bilan boshqotirmalarni yeching.',
      en: 'Explore a flooded city and solve puzzles alongside echoes of your past selves.',
    },
    action: {ru: 'Играть в браузере', uz: 'Brauzerda o‘ynash', en: 'Play in browser'},
    tools: 'JavaScript · Three.js · Web Audio',
  },
  {
    id: 'sat-practice', name: 'SAT Practice', image: './assets/projects/sat-practice.webp',
    href: 'https://sat12.saidkhujalucky.workers.dev/',
    kind: {ru: 'Образование', uz: 'Ta’lim', en: 'Education'},
    description: {
      ru: 'Платформа для подготовки к SAT. Проходите уроки и пробные тесты, затем разбирайте свои ответы.',
      uz: 'SAT imtihoniga tayyorlanish platformasi. Darslar va sinov testlarini bajaring, so‘ng javoblaringizni tahlil qiling.',
      en: 'A platform for SAT preparation. Work through lessons and practice tests, then review your answers.',
    },
    action: {ru: 'Открыть тренажёр', uz: 'Mashqlarni ochish', en: 'Open practice platform'},
  },
  {
    id: 'house3', name: 'House3', image: './assets/projects/house3.webp',
    href: 'https://house3-9ws.pages.dev/',
    kind: {ru: 'Недвижимость', uz: 'Ko‘chmas mulk', en: 'Real estate'},
    description: {
      ru: 'Веб-платформа для поиска недвижимости. Выберите интересующий объект и откройте его объявление.',
      uz: 'Ko‘chmas mulk qidirish uchun veb-platforma. Qiziqtirgan obyektni tanlang va uning e’lonini oching.',
      en: 'A website for discovering real estate. Browse properties and open a listing to take a closer look.',
    },
    action: {ru: 'Смотреть объекты', uz: 'Obyektlarni ko‘rish', en: 'Browse properties'},
  },
];

export function projectName(id) {
  return projects.find(project => project.id === id)?.name;
}

export function projectCards(language, id) {
  const selection = id ? projects.filter(project => project.id === id) : projects;
  return '<div class="project-gallery">' + selection.map((project, index) => `
    <article class="gallery-project">
      <a class="gallery-link" href="${project.href}" target="_blank" rel="noopener noreferrer"
         aria-labelledby="project-${project.id}-name project-${project.id}-action">
        <div class="gallery-preview">
          <img src="${project.image}" alt="" decoding="async" loading="${index ? 'lazy' : 'eager'}">
        </div>
        <div class="gallery-content">
          <span class="gallery-kind">${project.kind[language]}</span>
          <h3 id="project-${project.id}-name">${project.name}</h3>
          <p>${project.description[language]}</p>
          ${project.tools ? '<small>'+project.tools+'</small>' : ''}
          <span class="gallery-action" id="project-${project.id}-action">${project.action[language]} <span aria-hidden="true">↗</span></span>
        </div>
      </a>
    </article>`).join('') + '</div>';
}

export function buildProjectRoom(world) {
  const room = world.zoneGroup('projects');
  const width = 3.38, height = 2.05, gap = .28;
  const loader = new TextureLoader();
  const exhibits = new Group();
  const anisotropy = Math.min(8, world.renderer.capabilities.getMaxAnisotropy());
  room.add(exhibits);
  projects.forEach((project, index) => {
    const x = (index - (projects.length - 1) / 2) * (width + gap);
    const frame = new Group();
    frame.position.set(x, 2.7, -2);
    exhibits.add(frame);
    world.box(frame, width+.13, height+.14, .2, 0, 0, 0, world.dark);
    for (const edge of [-1, 1]) {
      world.box(frame, .026, height+.08, .025, edge*(width/2+.033), 0, .106, world.gold);
    }
    const texture = loader.load(project.image, image => {
      // Keep the original proportions while filling the picture frame.
      const ratio = image.image.width / image.image.height;
      const viewRatio = width / height;
      image.repeat.set(Math.min(1, viewRatio/ratio), Math.min(1, ratio/viewRatio));
      image.offset.set((1-image.repeat.x)/2, (1-image.repeat.y)/2);
    });
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = anisotropy;
    const image = new Mesh(new PlaneGeometry(width, height), new MeshBasicMaterial({map:texture,toneMapped:false}));
    image.position.z = .105;
    frame.add(image);
    world.target(image, 'project:'+project.id, 'projects');
    const title = world.label(frame, project.name, width, 0, -height/2-.31, .13, {fontSize:105,color:'#ecd7b2',serif:true});
    world.target(title, 'project:'+project.id, 'projects');
  });
  world.box(exhibits, projects.length*(width+gap), .3, 1.65, 0, .24, -2, world.dark);
  const fit = () => {
    const scale = Math.min(1, window.innerWidth / window.innerHeight * 2);
    exhibits.scale.x = exhibits.scale.y = exhibits.scale.z = scale;
    exhibits.position.y = (1-scale)*2;
  };
  fit();
  window.addEventListener('resize', fit);
}
