// Modern JavaScript ES6+ for Livraria Aura
class LibrariaAura {
    constructor() {
        this.books = this.loadBooksFromStorage();
        this.currentUser = null;
        this.editingBookId = null;
        
        this.init();
    }

    // Initialize the application
    init() {
        this.setupEventListeners();
        this.renderBooks();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        
        // Load initial data if empty
        if (this.books.length === 0) {
            this.loadInitialBooks();
        }
    }

    // Load initial book data
    loadInitialBooks() {
        const initialBooks = [
            {
                id: this.generateId(),
                title: "A Arte da Guerra",
                author: "Sun Tzu",
                price: 15.00,
                image: "./img/arte-da-guerra.jpg"
            },
            {
                id: this.generateId(),
                title: "Como Fazer Amigos e Influenciar Pessoas",
                author: "Dale Carnegie",
                price: 30.00,
                image: "./img/como-fazer-amigos.jpg"
            },
            {
                id: this.generateId(),
                title: "Diário de um Banana",
                author: "Jeff Kinney",
                price: 10.00,
                image: "./img/diario-de-um-banana.jpg"
            },
            {
                id: this.generateId(),
                title: "Moby Dick, ou A Baleia",
                author: "Herman Melville",
                price: 15.00,
                image: "./img/moby-dick.jpg"
            },
            {
                id: this.generateId(),
                title: "Harry Potter e a Pedra Filosofal",
                author: "J.K. Rowling",
                price: 25.00,
                image: "./img/harry-potter-pedra.jpg"
            }
        ];

        this.books = initialBooks;
        this.saveBooksToStorage();
        this.renderBooks();
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => this.handleSort(e.target.value));
        }

        // Admin login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Admin logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Book form
        const bookForm = document.getElementById('bookForm');
        if (bookForm) {
            bookForm.addEventListener('submit', (e) => this.handleBookSubmit(e));
        }

        // Cancel edit
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.cancelEdit());
        }
    }

    // Setup mobile menu
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileNav = document.getElementById('mobileNav');

        if (mobileMenuBtn && mobileNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileNav.classList.toggle('active');
            });

            // Close mobile menu when clicking on a link
            document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    mobileNav.classList.remove('active');
                });
            });
        }
    }

    // Setup smooth scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Handle navigation
    handleNavigation(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');

        // Show/hide sections
        if (href === '#admin') {
            this.showAdminSection();
        } else {
            this.hideAdminSection();
            if (href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
    }

    // Show admin section
    showAdminSection() {
        const adminSection = document.getElementById('admin');
        if (adminSection) {
            adminSection.style.display = 'block';
            adminSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Hide admin section
    hideAdminSection() {
        const adminSection = document.getElementById('admin');
        if (adminSection) {
            adminSection.style.display = 'none';
        }
    }

    // Handle search
    handleSearch(query) {
        const filteredBooks = this.books.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
        );
        this.renderBooks(filteredBooks);
    }

    // Handle sort
    handleSort(sortBy) {
        let sortedBooks = [...this.books];
        
        switch (sortBy) {
            case 'title':
                sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'author':
                sortedBooks.sort((a, b) => a.author.localeCompare(b.author));
                break;
            case 'price-asc':
                sortedBooks.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sortedBooks.sort((a, b) => b.price - a.price);
                break;
        }
        
        this.renderBooks(sortedBooks);
    }

    // Render books in the catalog
    renderBooks(booksToRender = this.books) {
        const booksGrid = document.getElementById('booksGrid');
        const noResults = document.getElementById('noResults');
        
        if (!booksGrid) return;

        if (booksToRender.length === 0) {
            booksGrid.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        if (noResults) noResults.style.display = 'none';

        booksGrid.innerHTML = booksToRender.map(book => `
            <div class="book-card fade-in">
                <img src="${book.image}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/300x400/cccccc/666666?text=Sem+Imagem'">
                <div class="book-card-content">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author">por ${book.author}</p>
                    <p class="book-price">R$ ${book.price.toFixed(2).replace('.', ',')}</p>
                    <div class="book-actions">
                        <button class="btn btn--primary">
                            <i class="fas fa-shopping-cart"></i>
                            Adquirir
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Handle admin login
    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        // Simple authentication (in a real app, this would be more secure)
        if (username === 'admin' && password === 'admin123') {
            this.currentUser = { username };
            this.showAdminPanel();
            this.showAlert('Login realizado com sucesso!', 'success');
        } else {
            this.showAlert('Credenciais inválidas!', 'error');
        }
    }

    // Handle logout
    handleLogout() {
        this.currentUser = null;
        this.hideAdminPanel();
        this.showAlert('Logout realizado com sucesso!', 'success');
    }

    // Show admin panel
    showAdminPanel() {
        const adminLogin = document.getElementById('adminLogin');
        const adminPanel = document.getElementById('adminPanel');
        
        if (adminLogin) adminLogin.style.display = 'none';
        if (adminPanel) {
            adminPanel.style.display = 'block';
            this.renderAdminBooks();
        }
    }

    // Hide admin panel
    hideAdminPanel() {
        const adminLogin = document.getElementById('adminLogin');
        const adminPanel = document.getElementById('adminPanel');
        
        if (adminLogin) adminLogin.style.display = 'block';
        if (adminPanel) adminPanel.style.display = 'none';
        
        this.cancelEdit();
    }

    // Handle book form submission
    handleBookSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const bookData = {
            title: formData.get('title').trim(),
            author: formData.get('author').trim(),
            price: parseFloat(formData.get('price')),
            image: formData.get('image').trim()
        };

        // Validation
        if (!this.validateBookData(bookData)) {
            return;
        }

        const editBookId = document.getElementById('editBookId').value;
        
        if (editBookId) {
            // Update existing book
            this.updateBook(editBookId, bookData);
        } else {
            // Create new book
            this.createBook(bookData);
        }
    }

    // Validate book data
    validateBookData(bookData) {
        if (!bookData.title) {
            this.showAlert('Título é obrigatório!', 'error');
            return false;
        }
        
        if (!bookData.author) {
            this.showAlert('Autor é obrigatório!', 'error');
            return false;
        }
        
        if (isNaN(bookData.price) || bookData.price <= 0) {
            this.showAlert('Preço deve ser um número válido maior que zero!', 'error');
            return false;
        }
        
        if (!bookData.image) {
            this.showAlert('URL da imagem é obrigatória!', 'error');
            return false;
        }
        
        return true;
    }

    // Create new book (CRUD - Create)
    createBook(bookData) {
        const newBook = {
            id: this.generateId(),
            ...bookData
        };
        
        this.books.push(newBook);
        this.saveBooksToStorage();
        this.renderBooks();
        this.renderAdminBooks();
        this.resetBookForm();
        this.showAlert('Livro adicionado com sucesso!', 'success');
    }

    // Update existing book (CRUD - Update)
    updateBook(bookId, bookData) {
        const bookIndex = this.books.findIndex(book => book.id === bookId);
        
        if (bookIndex !== -1) {
            this.books[bookIndex] = { ...this.books[bookIndex], ...bookData };
            this.saveBooksToStorage();
            this.renderBooks();
            this.renderAdminBooks();
            this.resetBookForm();
            this.showAlert('Livro atualizado com sucesso!', 'success');
        } else {
            this.showAlert('Livro não encontrado!', 'error');
        }
    }

    // Delete book (CRUD - Delete)
    deleteBook(bookId) {
        if (confirm('Tem certeza que deseja excluir este livro?')) {
            this.books = this.books.filter(book => book.id !== bookId);
            this.saveBooksToStorage();
            this.renderBooks();
            this.renderAdminBooks();
            this.showAlert('Livro excluído com sucesso!', 'success');
        }
    }

    // Edit book (CRUD - Read for editing)
    editBook(bookId) {
        const book = this.books.find(book => book.id === bookId);
        
        if (book) {
            document.getElementById('editBookId').value = book.id;
            document.getElementById('bookTitle').value = book.title;
            document.getElementById('bookAuthor').value = book.author;
            document.getElementById('bookPrice').value = book.price;
            document.getElementById('bookImage').value = book.image;
            
            const submitBtn = document.getElementById('submitBtn');
            const cancelBtn = document.getElementById('cancelBtn');
            
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar Livro';
            }
            if (cancelBtn) {
                cancelBtn.style.display = 'inline-block';
            }
            
            this.editingBookId = bookId;
            
            // Scroll to form
            document.querySelector('.admin-form').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Cancel edit
    cancelEdit() {
        this.resetBookForm();
        this.editingBookId = null;
    }

    // Reset book form
    resetBookForm() {
        const bookForm = document.getElementById('bookForm');
        if (bookForm) {
            bookForm.reset();
        }
        
        document.getElementById('editBookId').value = '';
        
        const submitBtn = document.getElementById('submitBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Livro';
        }
        if (cancelBtn) {
            cancelBtn.style.display = 'none';
        }
    }

    // Render books in admin table (CRUD - Read)
    renderAdminBooks() {
        const adminBooksTable = document.getElementById('adminBooksTable');
        
        if (!adminBooksTable) return;

        if (this.books.length === 0) {
            adminBooksTable.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">Nenhum livro cadastrado</td>
                </tr>
            `;
            return;
        }

        adminBooksTable.innerHTML = this.books.map(book => `
            <tr>
                <td>
                    <img src="${book.image}" alt="${book.title}" class="book-image-small" 
                         onerror="this.src='https://via.placeholder.com/50x60/cccccc/666666?text=?'">
                </td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>R$ ${book.price.toFixed(2).replace('.', ',')}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn--small" onclick="app.editBook('${book.id}')">
                            <i class="fas fa-edit"></i>
                            Editar
                        </button>
                        <button class="btn btn--small btn--danger" onclick="app.deleteBook('${book.id}')">
                            <i class="fas fa-trash"></i>
                            Excluir
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Local Storage operations
    saveBooksToStorage() {
        try {
            localStorage.setItem('livraria_aura_books', JSON.stringify(this.books));
        } catch (error) {
            console.error('Error saving books to storage:', error);
            this.showAlert('Erro ao salvar dados!', 'error');
        }
    }

    loadBooksFromStorage() {
        try {
            const stored = localStorage.getItem('livraria_aura_books');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading books from storage:', error);
            return [];
        }
    }

    // Show alert messages
    showAlert(message, type = 'success') {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;

        const alertId = this.generateId();
        const alertElement = document.createElement('div');
        alertElement.className = `alert alert-${type}`;
        alertElement.id = alertId;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-circle' : 
                    'exclamation-triangle';
        
        alertElement.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;

        alertContainer.appendChild(alertElement);

        // Auto remove after 5 seconds
        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) {
                alert.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => {
                    if (alert.parentNode) {
                        alert.parentNode.removeChild(alert);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LibrariaAura();
});

// Service Worker registration for PWA capabilities (optional enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}