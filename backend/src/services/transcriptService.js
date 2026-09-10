const { fetchTranscript } = require('youtube-transcript-plus')
const { decodeHtmlEntities, sanitizeText } = require('../utils/transcript')

async function fetchRawTranscript(videoId){
    if(!videoId){
        return null
    }
    try{
        // youtube-transcript-plus solves YouTube's PoToken requirement, which
        // makes the older youtube-transcript package return empty results.
        return await fetchTranscript(videoId)
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

    // Segment offset/duration are in SECONDS; convert to ms for the API.
    const segments = transcript
        .map(item => ({
            text: sanitizeText(decodeHtmlEntities(item.text)),
            offsetMs: Math.round((item.offset || 0) * 1000),
            durationMs: Math.round((item.duration || 0) * 1000)
        }))
        .filter(segment => segment.text)

    if(segments.length === 0){
        return null
    }

    const text = sanitizeText(segments.map(segment => segment.text).join(' '))

    return { text, segments }
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