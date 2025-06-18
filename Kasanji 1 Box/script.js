document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section.section');
    const navLinks = document.querySelectorAll('header nav a');
    const parallaxBgs = document.querySelectorAll('.parallax-bg');
    const contactForm = document.querySelector('#contato form');
    const formFeedback = document.querySelector('#form-feedback');

    function updateActiveLink() {
        let index = sections.length;
        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
        
        navLinks.forEach((link) => link.classList.remove('active'));
        if (navLinks[index]) {
            navLinks[index].classList.add('active');
        }
    }

    function handleScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        parallaxBgs.forEach(bg => {
            const speed = 0.3;
            bg.style.transform = `translateY(${bg.parentElement.offsetTop * speed + scrollY * speed * 0.5}px)`;
        });

        updateActiveLink();
    }

    window.addEventListener('scroll', handleScroll);
    updateActiveLink();

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const scrollTargets = document.querySelectorAll('.scroll-target');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    scrollTargets.forEach(target => {
        observer.observe(target);
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.5 });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    function showFormFeedback(message, isSuccess = true) {
        if (!formFeedback) return;
        
        formFeedback.textContent = message;
        formFeedback.className = `form-feedback ${isSuccess ? 'success' : 'error'}`;
        formFeedback.classList.remove('hidden');
        
        setTimeout(() => {
            formFeedback.classList.add('fade-out');
            setTimeout(() => {
                formFeedback.classList.add('hidden');
                formFeedback.classList.remove('fade-out');
            }, 300);
        }, 5000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = contactForm.querySelector('#name');
            const emailInput = contactForm.querySelector('#email');
            const messageInput = contactForm.querySelector('#message');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();

            let isValid = true;
            let errorMessage = '';

            if (name === '') {
                isValid = false;
                errorMessage = 'Por favor, preencha o campo Nome.';
                nameInput.focus();
            } else if (email === '') {
                isValid = false;
                errorMessage = 'Por favor, preencha o campo Email.';
                emailInput.focus();
            } else {
                const emailRegex = new RegExp('^(([^<>()\\\\[\\\\]\\\\\\\\.,;:\\\\s@\"]+(\\\\.[^<>()\\\\[\\\\]\\\\\\\\.,;:\\\\s@\"]+)*)|(\".+\"))@((\\\\[[0-9]{1,3}\\\\.[0-9]{1,3}\\\\.[0-9]{1,3}\\\\.[0-9]{1,3}\\\\])|(([a-zA-Z\\\\-0-9]+\\\\.)+[a-zA-Z]{2,}))$', 'i');
                if (!emailRegex.test(String(email).toLowerCase())) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um endereço de email válido.';
                    emailInput.focus();
                } else if (message === '') {
                    isValid = false;
                    errorMessage = 'Por favor, escreva a sua mensagem.';
                    messageInput.focus();
                }
            }

            if (!isValid) {
                showFormFeedback(errorMessage, false);
                return;
            }

            showFormFeedback('Mensagem enviada com sucesso! Obrigado pelo seu contato. Nossa equipe entrará em contato em breve.', true);
            contactForm.reset();
        });
    }

    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('#gallery-modal');
    const modalContent = modal ? modal.querySelector('div') : null;
    const modalImg = document.querySelector('#modal-img');
    const modalTitle = document.querySelector('#modal-title');
    const modalDescription = document.querySelector('#modal-description');
    const closeModalBtn = document.querySelector('#modal-close-btn');

    function openModal(imgSrc, title, descriptionHTML) {
        if (!modal || !modalImg || !modalTitle || !modalDescription) return;

        modalImg.src = imgSrc;
        modalTitle.textContent = title;
        modalDescription.innerHTML = descriptionHTML;
        
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            if(modalContent) modalContent.classList.remove('scale-95');
        }, 10);
    }

    function closeModal() {
        if (!modal || !modalContent) return;

        modal.classList.add('opacity-0');
        if(modalContent) modalContent.classList.add('scale-95');

        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.classList.remove('modal-open');
        }, 300);
    }

    if (galleryItems.length > 0 && modal) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('h3');
                const descriptionParts = item.querySelectorAll('.p-6 > p');
                
                let descriptionHTML = '';
                descriptionParts.forEach(p => {
                    descriptionHTML += `<p class="${p.className}">${p.innerHTML}</p>`;
                });

                if (img && title) {
                    openModal(img.src, title.textContent, descriptionHTML);
                }
            });
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }
});
