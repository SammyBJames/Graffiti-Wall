const logger = require('firebase-functions/logger');
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require('firebase-admin/firestore');
const { onCall } = require('firebase-functions/v2/https');
const beautify = require('js-beautify').html;
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');


initializeApp();
const firestore = getFirestore();
const DOMPurify = createDOMPurify(new JSDOM('').window);


exports.updateWall = onCall(async request => {
    if (!request.auth || !request.auth.uid) {
        return {
            success: false,
            error: 'Nice try buddy. Get authenticated.'
        };
    }
    if (!('contents' in request.data) || !request.data.contents.trim()) {
        return {
            success: false,
            error: 'Nice try buddy. You need to provide some content.'
        };
    }
    if (request.data.contents.length > 10000000) {
        return {
            success: false,
            error: 'Nice try buddy. Your content is too long.'
        };
    }
    try {
        const sanitizedHTML = DOMPurify.sanitize(request.data.contents);
        const formattedHTML = beautify(
            sanitizedHTML,
            {
                indent_size: 2,
                indent_char: ' ',
                preserve_newlines: true,
                max_preserve_newlines: 2
            }
        );
        firestore.collection('entries').doc('wall').set({
            contents: formattedHTML
        });
        logger.info(`Wall updated by ${request.auth.uid}.`, { uid: request.auth.uid, contents: request.data.contents, saved: formattedHTML });
        return { success: true };
    }
    catch (e) {
        logger.error(e);
        return {
            success: false,
            error: e.message
        };
    }
});
