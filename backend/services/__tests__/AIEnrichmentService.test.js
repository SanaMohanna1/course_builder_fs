import { jest } from '@jest/globals';

const mockResponsePayload = {
  summary: 'This lesson covers the essentials.',
  learning_objectives: ['Understand basics', 'Apply concepts', 'Evaluate outcomes'],
  examples: ['Example A', 'Example B'],
  difficulty: 'Intermediate',
  estimated_duration_minutes: 45,
  tags: ['sample'],
  recommendations: ['Review previous module']
};

const mockGenerateContent = jest.fn().mockResolvedValue({
  response: {
    text: () => JSON.stringify(mockResponsePayload)
  }
});

jest.unstable_mockModule('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class MockGemini {
      constructor() {
        this.getGenerativeModel = jest.fn().mockReturnValue({
          generateContent: mockGenerateContent
        });
      }
    }
  };
});

const { enrichLesson } = await import('../AIEnrichmentService.js');

describe('AIEnrichmentService', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
    jest.clearAllMocks();
  });

  test('returns parsed enrichment payload when Gemini succeeds', async () => {
    const result = await enrichLesson({
      topicName: 'Testing',
      lessonName: 'Unit Testing Basics',
      description: 'Learn how to test functions.',
      skills: ['testing']
    });

    expect(result).toEqual({
      summary: mockResponsePayload.summary,
      learning_objectives: mockResponsePayload.learning_objectives,
      examples: mockResponsePayload.examples,
      difficulty: mockResponsePayload.difficulty,
      estimated_duration_minutes: mockResponsePayload.estimated_duration_minutes,
      tags: mockResponsePayload.tags,
      recommendations: mockResponsePayload.recommendations
    });
  });

  test('returns default payload when API key is missing', async () => {
    delete process.env.GEMINI_API_KEY;

    const result = await enrichLesson({
      topicName: 'Testing',
      lessonName: 'Unit Testing Basics'
    });

    expect(result.summary).toBe('Enrichment unavailable');
    expect(result.learning_objectives).toEqual([]);
  });
});

