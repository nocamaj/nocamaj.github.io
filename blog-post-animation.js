// blog-post-animation.js
document.addEventListener('DOMContentLoaded', () => {
    const postBody = document.querySelector('.blog-post-content .post-body');
    if (!postBody) return;

    const titleElement = postBody.querySelector('.blog-title');
    const metaElement = postBody.querySelector('.blog-meta');
    // Select only P tags that are NOT .blog-meta for typing
    const storyParagraphs = Array.from(postBody.querySelectorAll('p:not(.blog-meta)'));

    const typingSpeed = 5; // Milliseconds per character
    const preTypingBlinkDuration = 1250; 
    const postTypingBlinkDuration = 2500; 
    const blinkInterval = 250; // For ~2 blinks per second (0.5s total cycle / 2 for half)
    
    let globalCursor = null;
    let blinkTimerId = null; // To control blinking interval

    function createAndShowCursor(parentElement, makeVisible = true) {
        if (globalCursor) removeCursor();
        globalCursor = document.createElement('span');
        globalCursor.className = 'typing-cursor';
        
        // Append cursor at the end of current text content if any, or just append
        let lastTextNode = null;
        for(let i = parentElement.childNodes.length -1; i >=0; i--){
            if(parentElement.childNodes[i].nodeType === Node.TEXT_NODE){
                lastTextNode = parentElement.childNodes[i];
                break;
            }
        }
        if(lastTextNode){
            parentElement.insertBefore(globalCursor, lastTextNode.nextSibling);
        } else {
            parentElement.appendChild(globalCursor);
        }
        if(makeVisible) globalCursor.style.opacity = '1'; // Trigger CSS blink
        return globalCursor;
    }

    function removeCursor() {
        if (blinkTimerId) clearInterval(blinkTimerId);
        blinkTimerId = null;
        if (globalCursor && globalCursor.parentNode) {
            globalCursor.parentNode.removeChild(globalCursor);
        }
        globalCursor = null;
    }

    function startBlinkingCursor(elementForCursor, duration, callback) {
        if (!elementForCursor) {
            if(callback) callback();
            return;
        }
        removeCursor(); // Clear previous cursor
        globalCursor = createAndShowCursor(elementForCursor, true); // Create and make visible for CSS animation
        
        if (duration > 0) {
            setTimeout(() => {
                if (callback) callback();
            }, duration);
        } else { // Indefinite blink (not used here but could be)
            if (callback) callback(); // Or handle differently
        }
    }
    
    async function typeTextInElement(element, isLastParagraph) {
        return new Promise(async (resolve) => {
            const originalText = element.getAttribute('data-original-text') || element.textContent;
            if (!element.hasAttribute('data-original-text')) {
                element.setAttribute('data-original-text', originalText);
            }
            element.textContent = ''; // Clear before typing
            element.style.opacity = '1'; // Make sure paragraph is visible

            createAndShowCursor(element); // Add cursor for this paragraph

            for (let i = 0; i < originalText.length; i++) {
                if (!globalCursor || !globalCursor.parentNode) { 
                    globalCursor = createAndShowCursor(element); // Recreate if removed
                }
                element.insertBefore(document.createTextNode(originalText.charAt(i)), globalCursor);
                await new Promise(r => setTimeout(r, typingSpeed));
            }
            
            // If it's not the very last paragraph of the story, remove its cursor.
            // The cursor for the last paragraph will be handled by the post-typing blink.
            if (!isLastParagraph) {
                removeCursor();
            }
            resolve();
        });
    }

    async function runTypingSequence() {
        // 1. Initially hide all content to be animated
        if (titleElement) titleElement.style.opacity = '0';
        if (metaElement) metaElement.style.opacity = '0';
        storyParagraphs.forEach(p => {
            p.style.opacity = '0';
             // Store original text if not already done, and clear for typing
            if (!p.hasAttribute('data-original-text')) {
                p.setAttribute('data-original-text', p.textContent);
            }
            p.textContent = '';
        });

        // 2. Fade in Title and Meta
        if (titleElement) {
            titleElement.style.transition = 'opacity 0.5s ease-in';
            titleElement.style.opacity = '1';
            await new Promise(r => setTimeout(r, 500)); // Wait for fade
        }
        if (metaElement) {
            metaElement.style.transition = 'opacity 0.5s ease-in';
            metaElement.style.opacity = '1';
            await new Promise(r => setTimeout(r, 300)); // Shorter wait after meta
        }

        // 3. Pre-typing blink
        const firstStoryP = storyParagraphs[0];
        if (firstStoryP) {
            firstStoryP.style.opacity = '1'; // Make the empty paragraph visible for cursor
            startBlinkingCursor(firstStoryP, preTypingBlinkDuration, async () => {
                removeCursor(); // Remove the pre-typing blinker before typing starts

                // 4. Type out paragraphs sequentially
                for (let i = 0; i < storyParagraphs.length; i++) {
                    const p = storyParagraphs[i];
                    const isLast = i === storyParagraphs.length - 1;
                    await typeTextInElement(p, isLast);
                }

                // 5. Post-typing blink on the last paragraph
                const lastStoryP = storyParagraphs[storyParagraphs.length - 1];
                if (lastStoryP) {
                    // Cursor should already be there from the last typeTextInElement if isLast was true
                    if (!globalCursor || globalCursor.parentNode !== lastStoryP) {
                         createAndShowCursor(lastStoryP); // Recreate if needed
                    } else {
                        globalCursor.style.opacity = '1'; // Ensure it's visible for CSS blink
                    }

                    startBlinkingCursor(lastStoryP, postTypingBlinkDuration, () => {
                        removeCursor(); // Final removal
                        // console.log("Blog post typing complete.");
                    });
                } else {
                    removeCursor(); // Ensure cursor is removed if no paragraphs
                }
            });
        } else {
             // console.log("No story paragraphs to type.");
        }
    }

    if (postBody && (titleElement || metaElement || storyParagraphs.length > 0)) {
        runTypingSequence();
    }
});