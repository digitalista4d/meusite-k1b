import { products } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
    const commandButton = document.getElementById('command-button');
    const menuOverlay = document.getElementById('menu-overlay');
    const menuLinks = menuOverlay.querySelectorAll('a');

    const toggleMenu = () => {
        const isActive = menuOverlay.classList.contains('menu-active');
        if (isActive) {
            menuOverlay.classList.remove('menu-active');
            commandButton.innerHTML = `<i data-lucide="menu" class="w-6 h-6"></i>`;
        } else {
            menuOverlay.classList.add('menu-active');
            commandButton.innerHTML = `<i data-lucide="x" class="w-6 h-6"></i>`;
        }
        lucide.createIcons();
    };

    commandButton.addEventListener('click', toggleMenu);
    
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuOverlay.classList.contains('menu-active')) {
                toggleMenu();
            }
        });
    });

    const productsContainer = document.getElementById('produtos-grid');
    if (productsContainer) {
        products.forEach(product => {
            const card = document.createElement('div');
            card.setAttribute('data-product-name', product.name);
            card.className = 'product-card group bg-[var(--cor-fundo-secundario)] rounded-lg p-6 border border-[var(--cor-borda)] transition-all duration-300 hover:border-[var(--cor-destaque)] hover:shadow-2xl hover:shadow-[var(--cor-destaque)]/20 hover:-translate-y-2';
            
            card.innerHTML = `
                <div class="relative w-full h-40 bg-[var(--cor-fundo-primario)] rounded-md mb-4 flex items-center justify-center overflow-hidden border border-[var(--cor-borda)]">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" onerror="this.style.display='none'">
                    <div class="absolute inset-0 bg-gradient-to-t from-[var(--cor-fundo-secundario)] to-transparent"></div>
                    <i data-lucide="image-off" class="absolute w-12 h-12 text-[var(--cor-texto-secundario)]/50"></i>
                </div>
                <h3 class="text-xl font-bold text-[var(--cor-texto)] mb-2 group-hover:text-[var(--cor-destaque)] transition-colors duration-300">${product.name}</h3>
                <p class="text-[var(--cor-texto-secundario)] text-sm">${product.description}</p>
            `;
            productsContainer.appendChild(card);
        });
        lucide.createIcons();
    }

    const modal = document.getElementById('product-modal');
    if (modal && productsContainer) {
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const closeModalButton = document.getElementById('modal-close-button');
        const modalContactLink = document.getElementById('modal-contact-link');

        const openModal = (product) => {
            if (!product) return;
            
            modalImage.src = product.imageUrl || product.image;
            modalImage.alt = `Imagem de ${product.name}`;
            modalTitle.textContent = product.name;
            modalDescription.textContent = product.description;
            
            modal.classList.add('modal-visible');
            document.body.style.overflow = 'hidden';
            lucide.createIcons();
        };

        const closeModal = () => {
            modal.classList.remove('modal-visible');
            document.body.style.overflow = '';
        };

        productsContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            if (card) {
                const productName = card.dataset.productName;
                const productData = products.find(p => p.name === productName);
                openModal(productData);
            }
        });

        closeModalButton.addEventListener('click', closeModal);
        modalContactLink.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('modal-visible')) {
                closeModal();
            }
        });
    }
});
