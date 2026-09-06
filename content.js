/* YOUR CONTENT LIVES HERE.
   Add new entries at the top of each list. Dates use YYYY-MM-DD.
   Set sample: false when an entry describes your actual work or life.
   Leave unknown links and metrics blank; they will never become fake links or numbers.
   After editing, open index.html. Run node build.mjs to refresh the standalone version.
*/
window.SITE_CONTENT = {
  profile: {
    name: 'Your Name',
    role: 'Research & life',
    institution: '',
    field: '',
    introduction: 'Research, weekly reflections, and life beyond the desk.',
    biography: '',
    researchFocus: '',
    methods: [],
    futureInterests: [],
    email: '',
    cvUrl: '',
    scholarUrl: '',
    orcidUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    // Only set this to true when you want to announce it publicly.
    seekingPostdoc: false
  },

  blogs: [
    {
      id: 'a-question-worth-staying-with',
      title: 'A question worth staying with',
      category: 'Research',
      date: '',
      sample: true,
      summary: 'One question, a little context, and a thought to carry into next week.',
      paragraphs: [
        'This is an example of a short weekly blog. Replace it with a question you have been thinking about, why it matters, and what you currently understand.',
        'A useful research note does not need a finished result. Explain the observation that started the question, the approach you might try, and what could change your mind.',
        'End with the next small step. Over time, these notes can show how your thinking develops.'
      ],
      links: []
    },
    {
      id: 'what-changed-my-mind',
      title: 'What changed my mind this week',
      category: 'Notes',
      date: '',
      sample: true,
      summary: 'A paper, a conversation, or an unexpected result. A note on learning.',
      paragraphs: [
        'Use this sample as a starting point for a reading note. Introduce one idea from a paper, seminar, or conversation and explain it in your own words.',
        'Describe what you thought before, what the new evidence suggests, and which questions remain open. Link to the original work so a reader can explore it.',
        'A specific observation is more useful than a long reading list.'
      ],
      links: []
    },
    {
      id: 'taking-the-long-way',
      title: 'Taking the long way home',
      category: 'Outside',
      date: '',
      sample: true,
      summary: 'Space for a small observation from life away from the desk.',
      paragraphs: [
        'Personal writing belongs here too. This sample can become a note from a walk, a ride, a book, or an ordinary moment that stayed with you.',
        'Write about what you noticed and why you want to remember it. It does not need an academic conclusion.',
        'If the note relates to a hike or ride, add the actual route to the trails section.'
      ],
      links: []
    }
  ],

  updates: [
    { id: 'research-milestone', date: '', category: 'Career', title: 'A research milestone', text: 'Add a publication, presentation, project milestone, or new role. Include a link to the work when it is available.', sample: true, url: '' },
    { id: 'outside-the-lab', date: '', category: 'Personal', title: 'A note from outside the lab', text: 'A move, a new interest, a memorable ride, or something worth celebrating.', sample: true, url: '' },
    { id: 'next-collaboration', date: '', category: 'Career', title: 'A new collaboration', text: 'Introduce the question, your role, and the people involved in an actual collaboration.', sample: true, url: '' }
  ],

  projects: [
    {
      id: 'current-research', title: 'The question I’m working on', label: 'Current research', status: 'Current', year: '', sample: true,
      summary: 'A clear research question, the approach, and what you hope to learn.',
      question: 'State the actual question your project addresses and why it matters.',
      approach: 'Describe the methods, data, or experiments you use to investigate it.',
      contribution: 'Explain which parts you personally designed, built, analysed, or led.',
      outcome: 'For work in progress, describe the current stage and the next test. Do not imply a result before it exists.',
      tags: ['Research question', 'Methods', 'Contribution'], links: []
    },
    {
      id: 'previous-project', title: 'From an idea to an outcome', label: 'Previous work', status: 'Completed', year: '', sample: true,
      summary: 'A completed project, the main finding, and the part you played.',
      question: 'Explain the problem that motivated a completed project.',
      approach: 'Describe the approach and the choices that shaped the work.',
      contribution: 'Separate your own contribution from the work of the wider team.',
      outcome: 'Summarise the evidence or output. Link to a real paper, repository, dataset, or report below.',
      tags: ['Previous work', 'Results'], links: []
    },
    {
      id: 'open-experiment', title: 'An experiment in the open', label: 'Work in progress', status: 'Current', year: '', sample: true,
      summary: 'A smaller investigation, useful tool, or collaborative side project.',
      question: 'Introduce a current experiment or tool and who it is useful for.',
      approach: 'Explain how you are developing it and how you evaluate progress.',
      contribution: 'Describe what you maintain or contribute.',
      outcome: 'Share the current state, its limitations, and the next step.',
      tags: ['Exploration', 'Open work'], links: []
    }
  ],

  trails: [
    {
      id: 'first-hiking-note', type: 'Hiking', name: 'A trail worth remembering', location: 'Your route / location', date: '', sample: true,
      distanceKm: null, ascentM: null, duration: '', difficulty: '', mapUrl: '', gpxUrl: '',
      summary: 'A place for the route, the conditions, and the moments that made the walk memorable.',
      notes: ['Replace this sample with a hike you have completed. Add the actual distance, ascent, date, and a link to your route.', 'Include practical observations from your outing, such as the surface, transport, or conditions on that date.']
    },
    {
      id: 'first-cycling-note', type: 'Cycling', name: 'Two wheels, a different pace', location: 'Your route / location', date: '', sample: true,
      distanceKm: null, ascentM: null, duration: '', difficulty: '', mapUrl: '', gpxUrl: '',
      summary: 'Favourite roads, unhurried detours, and notes from a day on the bike.',
      notes: ['Replace this sample with a ride you have completed. Add the real route, date, distance, and elevation gain.', 'Record the details you would want to know before riding it again. No route map is drawn until actual route data is available.']
    }
  ],

  // Example: { title: 'Actual title', authors: 'Author names', venue: 'Journal / conference', year: '2026', type: 'Paper', finding: 'One-sentence contribution.', url: 'https://doi.org/...' }
  publications: []
};
