const {YoutubeTranscript} = require('youtube-transcript')
const { sanitizeText } = require('../utils/transcript')


async function  getTranscriptByVideoId(videoId){
    if(!videoId){
        return null
    }
    let transcript;
    try{
        transcript = await YoutubeTranscript.fetchTranscript(videoId)
        //console.log('Transcript raw result:', transcript);
    }catch(err){
        //console.log('Transcript fetch error:', err?.message || err);
        return null
    }
    
    if(!transcript || transcript.length === 0){
        return null
    }
    
    // using for.. of iteration 
    // const fullText = '';
    // for (const item of transcript){
    //     fullText += item.text + ' ';
    // }
    
    const fullText = transcript.map(item => item.text).join(' ');
    const cleanText = sanitizeText(fullText)
    return cleanText
  
}
module.exports =  { getTranscriptByVideoId }