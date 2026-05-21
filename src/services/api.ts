import type { ChatMessage, StoryOption } from '../types';

export function streamChat(
  apiBaseUrl: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void,
): AbortController {
  const controller = new AbortController();
  const base = apiBaseUrl.replace(/\/+$/, '');

  const chatMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      stream: true,
    }),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText}`);
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') {
            onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) onChunk(content);
          } catch {
            // skip unparseable chunks
          }
        }
      }
      onDone();
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        onError(err);
      }
    });

  return controller;
}

export function streamStoryChunk(options: {
  apiBaseUrl: string;
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (err: Error) => void;
}): AbortController {
  const controller = new AbortController();
  const base = options.apiBaseUrl.replace(/\/+$/, '');

  fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: [
        { role: 'system', content: options.systemPrompt },
        { role: 'user', content: options.userPrompt },
      ],
      stream: true,
    }),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API error ${res.status}: ${errText}`);
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') {
            options.onDone();
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) options.onChunk(content);
          } catch {
            // skip
          }
        }
      }
      options.onDone();
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        options.onError(err);
      }
    });

  return controller;
}

export function parseOptionsFromText(text: string): StoryOption[] {
  const lines = text.split('\n').filter((l) => l.trim());
  const options: StoryOption[] = [];
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(?:[A-D]|选项?\s*[A-D]|[\d]+)\s*[\.\)、:：]\s*(.*)/i);
    if (match) {
      options.push({ index: options.length, text: match[1].trim() });
    }
  }
  return options.length >= 2 ? options : [];
}
