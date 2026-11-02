// Generic sample memories for the memory browser demo; nothing product-specific (D11).
import type { InMemoryClientOptions } from '@codecora/memory';

type Seed = NonNullable<InMemoryClientOptions['memories']>[number];

export const sampleMemories: Seed[] = [
  {
    id: 'm-01',
    content: 'Use bun workspaces for the monorepo; packages build before svelte-check runs.',
    tags: ['project:atlas', 'build'],
    memoryType: 'decision',
    importance: 0.8,
    pinned: true,
    createdAt: '2026-10-02T09:12:00Z',
  },
  {
    id: 'm-02',
    content:
      'Release flow: version PR to develop (squash), then develop to main with a merge commit, then tag.',
    tags: ['project:atlas', 'release', 'git'],
    memoryType: 'procedure',
    importance: 0.7,
    createdAt: '2026-10-05T14:40:00Z',
  },
  {
    id: 'm-03',
    content:
      'The staging database rejects connections without TLS since the October upgrade. Set sslmode=require.',
    tags: ['project:harbor', 'database', 'gotcha'],
    memoryType: 'fact',
    importance: 0.6,
    createdAt: '2026-10-09T08:05:00Z',
  },
  {
    id: 'm-04',
    content: 'Compact density is for pointer-dense tools; every control is 32 px there.',
    tags: ['project:atlas', 'design'],
    memoryType: 'fact',
    createdAt: '2026-10-12T11:30:00Z',
  },
  {
    id: 'm-05',
    content:
      'Weekly planning moved to Tuesday mornings.\nAgenda lives in the team room; bring blockers, not status.',
    tags: ['team', 'planning'],
    memoryType: 'context',
    createdAt: '2026-10-15T07:55:00Z',
  },
  {
    id: 'm-06',
    content: 'Never log Authorization headers; compare keys by fingerprint instead of value.',
    tags: ['security', 'project:harbor'],
    memoryType: 'decision',
    importance: 0.9,
    createdAt: '2026-10-20T16:20:00Z',
  },
  {
    id: 'm-07',
    content: 'Search ranks by meaning on a real server; this demo only matches words.',
    tags: ['demo'],
    memoryType: 'fact',
    createdAt: '2026-10-28T10:00:00Z',
  },
];

export const sampleRooms: NonNullable<InMemoryClientOptions['rooms']> = [
  { id: 'atlas', title: 'Atlas', memoryIds: ['m-01', 'm-02', 'm-04'] },
  { id: 'team', title: 'Team', memoryIds: ['m-05'] },
];
