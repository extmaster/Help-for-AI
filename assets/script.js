const contentContainer = document.getElementById('content-container');
const navLinksContainer = document.getElementById('nav-links');

function getSectionName(filename) {
    // Extracts name from filename, e.g., '01-concepts.html' -> 'Концепции'
    // A more robust solution could use a mapping object.
    const name = filename.replace('.html', '').replace(/^\d+-/, '');
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
}

async function loadSection(filename) {
    // Set active link
    document.querySelectorAll('.nav a').forEach(link => {
        if (link.getAttribute('href').substring(1) === filename) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Fetch and load content
    try {
        const response = await fetch(`sections/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to load ${filename}: ${response.statusText}`);
        }
        contentContainer.innerHTML = await response.text();
        // After loading content, initialize any dynamic elements within it
        initializeCollapsibles();
        initializeCopyButtons();
        initializeTabs();
    } catch (error) {
        contentContainer.innerHTML = `<p style="color: var(--warning);">Error loading section: ${error.message}</p>`;
    }
}

function handleRouting() {
    const hash = window.location.hash.substring(1);
    const sectionToLoad = hash || (sections[0] ? sections[0].file : null);
    if (sectionToLoad) {
        loadSection(sectionToLoad);
    } else {
        contentContainer.innerHTML = "<p>Welcome! Please select a section.</p>";
    }
}

function generateNav() {
    if (!sections || sections.length === 0) {
        navLinksContainer.innerHTML = '<li>No sections found.</li>';
        return;
    }

    navLinksContainer.innerHTML = sections.map(section => `
        <li><a href="#${section.file}">${section.name}</a></li>
    `).join('');
}

// --- Initializers for dynamic content ---

function initializeCollapsibles() {
    contentContainer.querySelectorAll('.collapsible-header').forEach(header => {
        // Prevent double-adding listeners
        if (header.dataset.initialized) return;
        header.dataset.initialized = true;

        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('open');
        });
    });
}

function initializeCopyButtons() {
    contentContainer.querySelectorAll('.copy-btn').forEach(btn => {
        if (btn.dataset.initialized) return;
        btn.dataset.initialized = true;

        btn.addEventListener('click', () => {
            const code = btn.previousElementSibling.textContent;
            navigator.clipboard.writeText(code).then(() => {
                btn.textContent = 'Скопировано!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = 'Копировать';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });
}

function initializeTabs() {
    contentContainer.querySelectorAll('.tab').forEach(tab => {
        if (tab.dataset.initialized) return;
        tab.dataset.initialized = true;

        tab.addEventListener('click', (event) => {
            const tabId = event.target.dataset.tab;
            const tabContainer = event.target.closest('.tabs').parentElement;

            tabContainer.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            tabContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            tabContainer.querySelector(`#${tabId}`).classList.add('active');
            event.target.classList.add('active');
        });
    });
}


// --- Main Execution ---

document.getElementById('date').textContent = new Date().toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

window.addEventListener('hashchange', handleRouting);
window.addEventListener('DOMContentLoaded', () => {
    generateNav();
    handleRouting();
});
