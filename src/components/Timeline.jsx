import { useEffect, useRef } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

// Reverse chronological — newest first.
const timelineEntries = [
  {
    role: 'Full-Stack Developer Intern',
    org: 'Dynatrace',
    period: 'Jun 2026 – Jul 2026',
    location: 'Vienna, AT',
    description:
      "Learned the Claude Code workflow — writing custom skills/tools, automating engineering tasks, and reviewing/refining other engineers' skills.",
    tags: ['React', 'TypeScript', 'Claude Code', 'MCP', 'Prompt Engineering', 'Claude Code Hooks', 'Git'],
  },
  {
    role: 'Full-Stack Developer Intern',
    org: 'Dynatrace',
    period: 'Aug 2025 – Sep 2025',
    location: 'Vienna, AT',
    description:
      'Onboarded into a large production codebase, shipped bug fixes & features (React TS, Django REST). Built component/integration/E2E tests (RTL, Playwright, Pytest). Upgraded the IconGenerator app on Hub.',
    tags: ['React', 'TypeScript', 'Django REST', 'RTL', 'Playwright', 'Pytest'],
  },
  {
    role: 'Freelance Developer',
    org: null,
    period: '2023 – Present',
    location: 'Remote',
    description:
      'Built single-page React sites and full-stack apps (Next.js + Django REST/FastAPI) for clients — auth, dashboards, third-party integrations, Vercel/Docker deployments.',
    tags: ['React', 'Next.js', 'Django REST', 'FastAPI', 'Vercel', 'Docker'],
  },
  {
    role: 'Open-Source Contributor',
    org: null,
    period: '2022 – 2023',
    location: null,
    description:
      'Documentation improvements, bug fixes, and API examples for public libraries. PR reviews, improved DX for newcomers.',
    tags: [],
  },
  {
    role: 'BSc Computer Science & Business Informatics',
    org: 'University of Vienna',
    period: '2022 – 2026',
    location: null,
    description: 'Core CS + software engineering. C++, Java, Rust, SQL, team projects. Focus: Data Analysis.',
    tags: [],
  },
  {
    role: 'BA Mathematics',
    org: 'University of Vienna',
    period: '2021 – 2023',
    location: null,
    description: '',
    tags: [],
  },
  {
    role: 'Gymnasium (Secondary School Diploma)',
    org: null,
    period: '2011 – 2019',
    location: null,
    description: '',
    tags: [],
  },
];

const TimelineEntry = ({ entry }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.35 });

  return (
    <li ref={ref} className="relative pl-8 md:pl-10 pb-10 last:pb-0">
      <motion.span
        className="absolute left-1 top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-red-400 ring-4 ring-[var(--bg)]"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
      />
      <motion.div
        data-cursor-text
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      >
        <p className="text-xs text-gray-500">
          {entry.period}
          {entry.location ? ` · ${entry.location}` : ''}
        </p>
        <p className="text-base lg:text-lg mt-1">{entry.role}</p>
        {entry.org && <p className="text-sm text-gray-500">{entry.org}</p>}
        {entry.description && <p className="text-sm mt-2 max-w-xl">{entry.description}</p>}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full border border-[var(--divider)] text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </li>
  );
};

// The vertical line's fill (grey -> coral) tracks the user's scroll position
// through this section specifically, not the whole page. Since this content
// lives inside a drei <Scroll html> region (virtual scroll driven by
// ScrollControls, not native window scroll — see ScrollHint for the same
// pattern), progress is read from drei's useScroll + useFrame. The section's
// own offset range within the total scroll is measured from the DOM rather
// than hardcoded, since it shifts whenever content above/below it changes.
const Timeline = () => {
  const scroll = useScroll();
  const { size } = useThree();
  const listRef = useRef(null);
  const rangeRef = useRef({ start: 0, distance: 1, margin: 0 });
  const fill = useMotionValue(0);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const measure = () => {
      const totalTravel = size.height * (scroll.pages - 1);
      if (totalTravel <= 0) return;
      const distance = el.offsetHeight / totalTravel;
      // `offsetTop / totalTravel` alone is the point where the list's *top*
      // reaches the top of the viewport — i.e. already mostly scrolled past.
      // Shifting back by one viewport height instead anchors 0 to "the list
      // is just entering at the bottom of the screen" and 1 to "the list has
      // just fully entered" (rather than "has fully scrolled away"), which is
      // both an earlier start and a reachable, earlier finish.
      rangeRef.current = {
        start: (el.offsetTop - size.height) / totalTravel,
        distance,
        margin: distance * 0.1,
      };
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [size.height, scroll.pages]);

  useFrame(() => {
    const { start, distance, margin } = rangeRef.current;
    fill.set(scroll.range(start, distance, margin));
  });

  return (
    <div className="w-full flex items-center justify-center py-20 md:py-28">
      <div className="md:w-[70%] w-[90%]">
        <p className="text-xs text-gray-500 tracking-widest uppercase mb-8">Experience &amp; Education</p>
        <ol ref={listRef} className="relative">
          <div className="absolute left-1 top-1 bottom-1 -translate-x-1/2 w-0.5 bg-[var(--track)] rounded-full" />
          <motion.div
            className="absolute left-1 top-1 -translate-x-1/2 w-0.5 bg-red-400 rounded-full origin-top"
            style={{ scaleY: fill, height: 'calc(100% - 0.5rem)' }}
          />
          {timelineEntries.map((entry) => (
            <TimelineEntry key={`${entry.role}-${entry.period}`} entry={entry} />
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Timeline;
