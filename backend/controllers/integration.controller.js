/**
 * Unified Integration Controller
 * Handles all integration requests through single endpoint: POST /api/fill-content-metrics
 * Implements strict stringified JSON request/response contract.
 */

import { dispatchIntegrationRequest } from '../integration/dispatcher.js';

/**
 * Map external requester_service values to internal dispatcher service names
 */
function mapRequesterToServiceName(requesterService) {
  const key = String(requesterService || '').trim().toLowerCase();
  const mapping = {
    'content-studio': 'ContentStudio',
    'contentstudio': 'ContentStudio',
    'learner-ai': 'LearnerAI',
    'learnerai': 'LearnerAI',
    'assessment': 'Assessment',
    'skills-engine': 'SkillsEngine',
    'skillsengine': 'SkillsEngine',
    'directory': 'Directory',
    'learning-analytics': 'LearningAnalytics',
    'learninganalytics': 'LearningAnalytics',
    'management-reporting': 'ManagementReporting',
    'managementreporting': 'ManagementReporting',
    'devlab': 'Devlab',
    'dev-lab': 'Devlab'
  };
  return mapping[key] || null;
}

/**
 * Unified integration endpoint handler
 * POST /api/fill-content-metrics
 *
 * Contract rules:
 * 1) Request body is a stringified JSON (Express JSON parser will yield a string)
 * 2) Parse with JSON.parse to object: must contain requester_service, payload, response:{answer:""}
 * 3) Route by requester_service, pass payload to handler
 * 4) Put handler result into response.answer (stringified) and return the full object as stringified JSON
 * 5) On parse/validation error: respond 400 with stringified JSON error
 */
export async function handleFillContentMetrics(req, res) {
  try {
    // Body may arrive as a string (stringified JSON) per contract.
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    let envelope;
    try {
      envelope = JSON.parse(rawBody);
    } catch (parseError) {
      const errorPayload = {
        error: 'Bad Request',
        message: 'Failed to parse request body as JSON',
        details: parseError.message
      };
      return res.status(400).send(JSON.stringify(errorPayload));
    }

    // Validate required fields and structure
    const hasRequester = typeof envelope.requester_service === 'string' && envelope.requester_service.trim().length > 0;
    const hasPayload = envelope.payload && typeof envelope.payload === 'object';
    const hasResponse = envelope.response && typeof envelope.response === 'object' && typeof envelope.response.answer === 'string';

    if (!hasRequester || !hasPayload || !hasResponse) {
      const errorPayload = {
        error: 'Bad Request',
        message: 'Envelope must include "requester_service" (string), "payload" (object), and "response" (object with "answer" string)'
      };
      return res.status(400).send(JSON.stringify(errorPayload));
    }

    // Route to appropriate handler based on requester_service
    const serviceName = mapRequesterToServiceName(envelope.requester_service);
    if (!serviceName) {
      const errorPayload = {
        error: 'Bad Request',
        message: `Unsupported requester_service: ${envelope.requester_service}`
      };
      return res.status(400).send(JSON.stringify(errorPayload));
    }

    // Call dispatcher with the payload
    const resultObject = await dispatchIntegrationRequest(serviceName, envelope.payload);

    // Place result as stringified JSON into response.answer, preserve overall structure
    envelope.response.answer = JSON.stringify(resultObject ?? {});

    // Return the full object as stringified JSON
    return res.status(200).send(JSON.stringify(envelope));
  } catch (error) {
    console.error('[Integration Controller] Error:', error);
    const status = error.status || 500;
    const errorPayload = {
      error: status === 500 ? 'Internal Server Error' : 'Error',
      message: error.message || 'Unhandled error'
    };
    return res.status(status).send(JSON.stringify(errorPayload));
  }
}

export default {
  handleFillContentMetrics
};
