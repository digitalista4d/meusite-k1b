document.addEventListener('DOMContentLoaded', () => {
    const cursorDot = document.querySelector('#cursor-dot');
    const cursorRing = document.querySelector('#cursor-ring');
    const body = document.body;

    let dotX = 0, dotY = 0;
    
    window.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
    });

    const followCursor = () => {
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;
        
        cursorRing.style.left = `${dotX}px`;
        cursorRing.style.top = `${dotY}px`;

        requestAnimationFrame(followCursor);
    };
    
    requestAnimationFrame(followCursor);

    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"], .product-card');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            body.classList.remove('cursor-hover');
        });
    });

    document.addEventListener('mousedown', () => {
        body.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
        body.classList.remove('cursor-click');
    });

    lucide.createIcons();
});
