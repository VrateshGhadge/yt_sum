function extractVideoId(url){
    if (!url || typeof url !== 'string'){
        return null;
    }
    // Case 1: https://www.youtube.com/watch?v=VIDEO_ID
    if(url.includes('watch?v=')){
        const parts = url.split('watch?v=');
        const videoId = parts[1].split('&')[0];
        return videoId
    }
    // Case 2: https://youtu.be/VIDEO_ID
    if(url.includes('youtu.be/')){
        const parts = url.split('/'); //parts = ["https:", "", "youtu.be", "abc123XYZ"]
        return parts[parts.length - 1] //parts[3] = "abc123XYZ"
    }

    // Case 3: https://www.youtube.com/shorts/VIDEO_ID
    if(url.includes('/shorts/')){
        const parts = url.split('/shorts/') //parts = ["https://www.youtube.com","abc123XYZ"]
        return parts[1]
    }
    return null;
}
//utils should not throw HTTP errors
//It just returns null or value.

function validateYouTubeUrl(url){
    if(!url || typeof url !=="string"){
        return false  
    }
    return url.includes('youtube.com') || url.includes('youtu.be');
}

function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let cleanedText = text
    .replace(/\n/g, ' ') //"Hello\nWorld" → "Hello World"
    .replace(/\t/g, ' ') //"Hello\tWorld" → "Hello World"
    .replace(/\s+/g, ' ') //"Hello    World" → "Hello World"
    .trim(); //"   Hello World   " → "Hello World"

  return cleanedText;
}

function chunkTranscript(text, maxLength) {
  if (!text || typeof text !== 'string' || !maxLength) {
    return [];
  }

  const words = text.split(' ');
  const chunks = [];
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + ' ' + word).length > maxLength) {
      chunks.push(currentChunk);
      currentChunk = word;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// Like chunkTranscript, but each new chunk re-starts ~overlapChars before the
// previous chunk's end so sentence/idea boundaries aren't cut mid-thought.
function chunkWithOverlap(text, maxChars, overlapChars) {
  if (!text || typeof text !== 'string' || !maxChars) {
    return [];
  }

  const words = text.split(' ');
  const chunks = [];
  let current = [];

  for (const word of words) {
    const nextLength = (current.length ? current.join(' ').length + 1 : 0) + word.length;
    if (current.length && nextLength > maxChars) {
      chunks.push(current.join(' '));

      // Build the overlap tail from the end of the current chunk.
      let tail = [];
      let tailLength = 0;
      for (let i = current.length - 1; i >= 0; i--) {
        if (tail.length && tailLength + 1 + current[i].length > overlapChars) break;
        tail.unshift(current[i]);
        tailLength += current[i].length + (tail.length ? 1 : 0);
      }
      // Guarantee forward progress even if overlapChars >= maxChars.
      if (tail.length >= current.length) {
        tail = current.slice(1);
      }
      current = tail;
    }
    current.push(word);
  }

  if (current.length) {
    chunks.push(current.join(' '));
  }

  return chunks;
}

// Free + keyless YouTube video title lookup via oEmbed. Best-effort: returns
// null on any failure so callers can degrade gracefully.
async function getVideoTitle(videoId) {
  if (!videoId) return null;
  try {
    const url =
      'https://www.youtube.com/oembed?url=' +
      encodeURIComponent('https://www.youtube.com/watch?v=' + videoId) +
      '&format=json';
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return {
      title: data.title || null,
      author: data.author_name || null,
    };
  } catch {
    return null;
  }
}

// Group timed segments into passages of ~maxChars. Each passage carries its
// segment span (startMs/endMs) so answers can cite exact timestamps.
function chunkPassages(segments, maxChars = 2500) {
  if (!Array.isArray(segments) || segments.length === 0) {
    return [];
  }

  const passages = [];
  let current = { text: '', segments: [], startMs: null, endMs: null };

  for (const seg of segments) {
    const segText = seg.text || '';
    const wouldOverflow = current.text.length + (current.text ? 1 : 0) + segText.length > maxChars;

    // A single oversized segment still gets its own passage (never drop it),
    // but once a passage has content we flush on overflow.
    if (wouldOverflow && current.segments.length > 0) {
      passages.push(current);
      current = { text: '', segments: [], startMs: null, endMs: null };
    }

    current.text += (current.text ? ' ' : '') + segText;
    current.segments.push(seg);
    if (current.startMs === null) current.startMs = seg.offsetMs;
    current.endMs = (seg.offsetMs || 0) + (seg.durationMs || 0);
  }

  if (current.segments.length > 0) {
    passages.push(current);
  }

  return passages;
}

// ms → "m:ss" or "h:mm:ss" for human-readable citations.
function formatTimecode(ms) {
  const totalSeconds = Math.floor((ms || 0) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}

module.exports = { chunkPassages, chunkTranscript, chunkWithOverlap, extractVideoId, formatTimecode, getVideoTitle, sanitizeText, validateYouTubeUrl };



