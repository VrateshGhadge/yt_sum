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

module.exports = { chunkTranscript, extractVideoId, sanitizeText, validateYouTubeUrl };



