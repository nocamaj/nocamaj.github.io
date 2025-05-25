// blog-post-animation.js

document.addEventListener('DOMContentLoaded', () => {
    const postBody = document.querySelector('.blog-post-content .post-body');
    if (!postBody) return;

    // Select all direct children of post-body for the typing sequence
    const elementsToType = Array.from(postBody.children);
    const typingSpeed = 5; // Milliseconds per character
    const preTypingBlinkDuration = 2000; 
    const postTypingBlinkDuration = 2000; 
    
    let globalCursor = null;
    let typingEffectActive = false; 

    function createAndShowCursor(parentElement) {
        if (globalCursor) removeCursor();
        globalCursor = document.createElement('span');
        globalCursor.className = 'typing-cursor';
        globalCursor.style.opacity = '1'; 
        
        if (parentElement.childNodes.length > 0 && parentElement.lastChild.nodeType === Node.TEXT_NODE && parentElement.lastChild.textContent.length > 0) {
            parentElement.appendChild(globalCursor); 
        } else if (parentElement.childNodes.length > 0) {
            let lastTextNode = null;
            for(let i = parentElement.childNodes.length -1; i >=0; i--){
                if(parentElement.childNodes[i].nodeType === Node.TEXT_NODE && parentElement.childNodes[i].textContent.trim().length > 0){
                    lastTextNode = parentElement.childNodes[i];
                    break;
                }
            }
            if(lastTextNode && lastTextNode.nextSibling){
                parentElement.insertBefore(globalCursor, lastTextNode.nextSibling);
            } else {
                parentElement.appendChild(globalCursor);
            }
        } else {
            parentElement.appendChild(globalCursor); 
        }
        return globalCursor;
    }

    function removeCursor() {
        if (globalCursor && globalCursor.parentNode) {
            globalCursor.parentNode.removeChild(globalCursor);
        }
        globalCursor = null;
    }
    
    async function typeElement(element, isLastStoryParagraph) { // Added isLastStoryParagraph flag
        return new Promise(async (resolve) => {
            typingEffectActive = true;
            const isParagraph = element.nodeName === 'P' && !element.classList.contains('blog-meta');
            
            if (element.nodeName === 'H1' || element.classList.contains('blog-meta')) {
                element.style.opacity = '0';
                requestAnimationFrame(() => {
                   element.style.transition = 'opacity 0.3s ease-in 0.2s';
                   element.style.opacity = '1';
                });
                await new Promise(r => setTimeout(r, 300 + 200)); 
                typingEffectActive = false;
                resolve();
                return;
            }
            
            if (!isParagraph) {
                element.style.opacity = '1'; 
                typingEffectActive = false;
                resolve(); 
                return;
            }

            const originalText = element.getAttribute('data-original-text'); 
            element.style.opacity = '1'; 

            removeCursor(); 
            globalCursor = createAndShowCursor(element); 

            for (let i = 0; i < originalText.length; i++) {
                if (!globalCursor || !globalCursor.parentNode) { 
                    globalCursor = createAndShowCursor(element);
                }
                element.insertBefore(document.createTextNode(originalText.charAt(i)), globalCursor);
                await new Promise(r => setTimeout(r, typingSpeed));
            }
            
            typingEffectActive = false;
            if (!isLastStoryParagraph) { 
               removeCursor();
            }
            resolve();
        });
    }

    async function runTypingSequence() {
        elementsToType.forEach(el => {
            if (el.nodeName === 'P' && !el.classList.contains('blog-meta')) {
                el.style.opacity = '0'; 
                if (!el.hasAttribute('data-original-text')) { 
                    el.setAttribute('data-original-text', el.textContent);
                }
                el.textContent = ''; 
            } else if (el.nodeName === 'H1' || el.classList.contains('blog-meta')) {
                 el.style.opacity = '0'; 
            }
        });

        const titleEl = elementsToType.find(el => el.nodeName === 'H1');
        const metaEl = elementsToType.find(el => el.classList.contains('blog-meta'));

        if (titleEl) await typeElement(titleEl, false); // Pass false for isLastStoryParagraph
        if (metaEl) await typeElement(metaEl, false);   // Pass false for isLastStoryParagraph

        const firstStoryParagraph = elementsToType.find(el => el.nodeName === 'P' && !el.classList.contains('blog-meta'));

        if (firstStoryParagraph) {
            firstStoryParagraph.style.opacity = '1'; 
            createAndShowCursor(firstStoryParagraph); 
            typingEffectActive = true; 

            await new Promise(r => setTimeout(r, preTypingBlinkDuration)); 
            
            // Typing of the first paragraph will handle its own cursor
            // No need to remove cursor explicitly here if typeElement is called next for it
            
            for (let i = 0; i < elementsToType.length; i++) {
                const el = elementsToType[i];
                if (el.nodeName === 'P' && !el.classList.contains('blog-meta')) {
                    typingEffectActive = true; 
                    const isTheVeryLastStoryP = 
                        i === elementsToType.length - 1 || 
                        !elementsToType.slice(i + 1).some(nextEl => nextEl.nodeName === 'P' && !nextEl.classList.contains('blog-meta'));

                    await typeElement(el, isTheVeryLastStoryP); 
                    typingEffectActive = false; 
                    if (!isTheVeryLastStoryP) { 
                        removeCursor(); 
                    }
                }
            }
            
            const lastStoryParagraph = [...elementsToType].reverse().find(el => el.nodeName === 'P' && !el.classList.contains('blog-meta'));
            if (lastStoryParagraph && (!globalCursor || globalCursor.parentNode !== lastStoryParagraph)) {
                // If cursor was removed by the loop, but we need it for final blinks
                createAndShowCursor(lastStoryParagraph);
            }
            if (globalCursor) { // Only proceed if there is a cursor to blink
                typingEffectActive = true;
                await new Promise(r => setTimeout(r, postTypingBlinkDuration));
            }
        }
        typingEffectActive = false;
        removeCursor(); 
        // console.log("All typing and blinking sequences done.");
    }

    if (postBody && elementsToType.length > 0) {
        runTypingSequence();
    }
});