const {YoutubeTranscript} = require('youtube-transcript')
const { sanitizeText } = require('../utils/transcript')

async function fetchRawTranscript(videoId){
    if(!videoId){
        return null
    }
    try{
        return await YoutubeTranscript.fetchTranscript(videoId)
    }catch(err){
        //console.log('Transcript fetch error:', err?.message || err);
        return null
    }
}

// Full clean text + timed segments in a single fetch (used by the summary flow).
async function getTranscriptData(videoId){
    const transcript = await fetchRawTranscript(videoId)

    if(!transcript || transcript.length === 0){
        return null
    }

    const text = sanitizeText(transcript.map(item => item.text).join(' '));

    const segments = transcript
        .map(item => ({
            text: sanitizeText(item.text),
            offsetMs: item.offset,      // ms from start of video
            durationMs: item.duration   // ms
        }))
        .filter(segment => segment.text);

    return { text, segments };
}

async function getTranscriptByVideoId(videoId){
    const data = await getTranscriptData(videoId);
    return data ? data.text : null;
}

async function getTimedSegments(videoId){
    const data = await getTranscriptData(videoId);
    return data ? data.segments : null;
}

module.exports = { getTranscriptByVideoId, getTimedSegments, getTranscriptData }