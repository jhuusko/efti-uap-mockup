import { UILQuery, IdentifierQuery, RequestResult, RequestStatus } from './types';
import { mockConsignments } from './mockData';

const PENDING_DURATION_MS = 2500;
const requestTimestamps = new Map<string, number>();

function generateRequestId(): string {
  return `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function submitUILQuery(query: UILQuery): Promise<string> {
  await delay(400);
  const requestId = generateRequestId();
  requestTimestamps.set(requestId, Date.now());
  saveRequest(requestId, {
    requestId,
    status: RequestStatus.PENDING,
    queryType: 'uil',
    query,
    submittedAt: new Date().toISOString(),
  });
  return requestId;
}

export async function submitIdentifierQuery(query: IdentifierQuery): Promise<string> {
  await delay(400);
  const requestId = generateRequestId();
  requestTimestamps.set(requestId, Date.now());
  saveRequest(requestId, {
    requestId,
    status: RequestStatus.PENDING,
    queryType: 'identifiers',
    query,
    submittedAt: new Date().toISOString(),
  });
  return requestId;
}

export async function getRequestResult(requestId: string): Promise<RequestResult | null> {
  await delay(200);
  const stored = loadRequest(requestId);
  if (!stored) return null;

  const submittedAt = requestTimestamps.get(requestId);
  const elapsed = submittedAt ? Date.now() - submittedAt : PENDING_DURATION_MS + 1;

  if (elapsed < PENDING_DURATION_MS) {
    return { ...stored, status: RequestStatus.PENDING };
  }

  if (stored.status === RequestStatus.PENDING) {
    const completed: RequestResult = {
      ...stored,
      status: RequestStatus.COMPLETE,
      data: mockConsignments,
    };
    saveRequest(requestId, completed);
    return completed;
  }

  return stored;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function saveRequest(requestId: string, result: RequestResult) {
  if (typeof window === 'undefined') return;
  const key = `efti_request_${requestId}`;
  localStorage.setItem(key, JSON.stringify(result));

  // Maintain recent searches list
  const recent = getRecentSearches();
  const summary = buildSummary(result);
  const exists = recent.findIndex((r) => r.requestId === requestId);
  const entry = { requestId, queryType: result.queryType, summary, submittedAt: result.submittedAt };
  if (exists >= 0) {
    recent[exists] = entry;
  } else {
    recent.unshift(entry);
  }
  localStorage.setItem('efti_recent_searches', JSON.stringify(recent.slice(0, 10)));
}

function loadRequest(requestId: string): RequestResult | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(`efti_request_${requestId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RequestResult;
  } catch {
    return null;
  }
}

function buildSummary(result: RequestResult): string {
  if (result.queryType === 'uil') {
    const q = result.query as UILQuery;
    return `UIL: ${q.datasetId}`;
  } else {
    const q = result.query as IdentifierQuery;
    return `ID: ${q.identifier}`;
  }
}

export function getRecentSearches() {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('efti_recent_searches');
  if (!raw) return [];
  try {
    return JSON.parse(raw) as { requestId: string; queryType: string; summary: string; submittedAt: string }[];
  } catch {
    return [];
  }
}
