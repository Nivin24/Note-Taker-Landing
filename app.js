// Interactive Scripts for Dev Cockpit Landing Page

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    setupModeToggle();
    setupSecretCopy();
    setupCommandRunner();
    setupDragDropInstaller();
    setupPricingSwitcher();
    setupGatekeeperTabs();
});

// 1. Theme Toggle Management (Apple Light vs Minimal Dark)
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const navDownloadBtn = document.getElementById('nav-download-btn');

    // Detect initial theme preference
    let activeTheme = localStorage.getItem('theme');
    if (!activeTheme) {
        // Fallback to system OS preferences
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        activeTheme = prefersDark ? 'dark' : 'light';
    }

    // Apply active theme
    applyTheme(activeTheme);

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });

    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update Theme Icons
        if (theme === 'dark') {
            themeIcon.className = 'bi bi-sun-fill fs-5 text-warning';
            themeToggle.style.color = '#ffc107';
        } else {
            themeIcon.className = 'bi bi-moon-fill fs-5 text-dark';
            themeToggle.style.color = '#1d1d1f';
        }
    }
}

// 2. Toggle between Editor (Unlocked) and Cockpit (Locked) Views
function setupModeToggle() {
    const btnUnlocked = document.getElementById('btn-mode-unlocked');
    const btnLocked = document.getElementById('btn-mode-locked');
    const editorView = document.getElementById('mockup-editor-view');
    const cockpitView = document.getElementById('mockup-cockpit-view');
    const lockBadge = document.getElementById('mockup-lock-badge');

    btnUnlocked.addEventListener('click', () => {
        btnUnlocked.classList.add('active');
        btnLocked.classList.remove('active');
        editorView.classList.remove('d-none');
        cockpitView.classList.add('d-none');
        lockBadge.classList.add('d-none');
    });

    btnLocked.addEventListener('click', () => {
        btnLocked.classList.add('active');
        btnUnlocked.classList.remove('active');
        cockpitView.classList.remove('d-none');
        editorView.classList.add('d-none');
        lockBadge.classList.remove('d-none');
    });
}

// 3. Secret Copy and Clipboard Timer Simulation
function setupSecretCopy() {
    const btnCopy = document.getElementById('btn-copy-secret');
    const secretPlaceholder = document.getElementById('secret-placeholder');
    const countdownContainer = document.getElementById('countdown-container');
    const timerText = document.getElementById('timer-text');
    let timerInterval = null;

    btnCopy.addEventListener('click', () => {
        // Copy simulated value to local user clipboard
        navigator.clipboard.writeText("postgre-master-sec-990").then(() => {
            // Visual Feedback
            btnCopy.innerHTML = '<i class="bi bi-check-lg text-success"></i> Copied!';
            secretPlaceholder.innerText = "postgre-master-sec-990";
            secretPlaceholder.classList.add('text-success');

            setTimeout(() => {
                btnCopy.innerHTML = '<i class="bi bi-copy"></i> Copy';
                secretPlaceholder.innerText = "••••••••";
                secretPlaceholder.classList.remove('text-success');
            }, 3000);

            // Start 30s Security Countdown Ticker
            countdownContainer.classList.remove('d-none');
            countdownContainer.classList.add('d-flex');
            
            let timeLeft = 30;
            timerText.innerText = timeLeft + 's';

            if (timerInterval) clearInterval(timerInterval);
            
            timerInterval = setInterval(() => {
                timeLeft--;
                timerText.innerText = timeLeft + 's';

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    countdownContainer.classList.remove('d-flex');
                    countdownContainer.classList.add('d-none');
                    // Mock clear clipboard message
                    alert("Security Alert: NoteTaker has cleared your clipboard content to prevent accidental paste leak.");
                }
            }, 1000);
        });
    });
}

// 4. Command Runner and Terminal output simulation
function setupCommandRunner() {
    const btnRunAll = document.getElementById('btn-run-all');
    const status1 = document.getElementById('cmd-status-1');
    const status2 = document.getElementById('cmd-status-2');
    const terminalDrawer = document.getElementById('mock-terminal-drawer');
    const terminalLines = document.getElementById('terminal-lines');

    const lines = [
        "[1/2] $ docker-compose up -d",
        "  Creating network \"node-backend_default\" with the default driver",
        "  Creating volume \"node-backend_db-data\" with default driver",
        "  Pulling database (postgres:15)... Done",
        "  Creating node-backend_db_1 ... done",
        "  Container database started successfully.",
        "",
        "[2/2] $ npm run dev",
        "  > backend-app@1.0.0 dev",
        "  > nodemon server.js",
        "",
        "  [nodemon] 3.0.1 starting `node server.js`",
        "  [nodemon] watching path(s): *.*",
        "  [nodemon] watching extensions: js,mjs,json",
        "  Database connected successfully on port 5432.",
        "  Server listening at http://localhost:8080",
        "  Boot complete. Ready."
    ];

    btnRunAll.addEventListener('click', () => {
        // Disable Run Button
        btnRunAll.disabled = true;
        btnRunAll.innerHTML = '<span class="spinner-border spinner-border-sm me-1" role="status"></span>Running';
        
        // Reset states
        status1.innerHTML = '<span class="text-secondary">— Pending</span>';
        status2.innerHTML = '<span class="text-secondary">— Pending</span>';
        terminalDrawer.classList.remove('d-none');
        terminalLines.innerHTML = '';

        // Step 1: Run Command 1
        setTimeout(() => {
            status1.innerHTML = '<i class="bi bi-arrow-repeat text-warning spin-icon"></i> Running';
            streamOutput(0, 7, () => {
                status1.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> OK';
                // Step 2: Run Command 2
                setTimeout(() => {
                    status2.innerHTML = '<i class="bi bi-arrow-repeat text-warning spin-icon"></i> Running';
                    streamOutput(7, lines.length, () => {
                        status2.innerHTML = '<i class="bi bi-check-circle-fill text-success"></i> OK';
                        btnRunAll.disabled = false;
                        btnRunAll.innerHTML = '<i class="bi bi-play-fill me-1"></i>Run All';
                    });
                }, 1000);
            });
        }, 500);
    });

    function streamOutput(startIdx, endIdx, onComplete) {
        let i = startIdx;
        function printNextLine() {
            if (i < endIdx) {
                const div = document.createElement('div');
                div.innerText = lines[i];
                if (lines[i].includes('ERROR')) {
                    div.className = 'text-danger';
                } else if (lines[i].includes('Boot complete') || lines[i].includes('started successfully')) {
                    div.className = 'text-success';
                } else if (lines[i].startsWith('$') || lines[i].startsWith('[')) {
                    div.className = 'text-info';
                } else {
                    div.className = 'text-secondary';
                }
                terminalLines.appendChild(div);
                
                // Scroll to bottom
                terminalDrawer.scrollTop = terminalDrawer.scrollHeight;
                
                i++;
                setTimeout(printNextLine, 150);
            } else {
                if (onComplete) onComplete();
            }
        }
        printNextLine();
    }
}

// 5. Drag and Drop Installer Simulation
function setupDragDropInstaller() {
    const draggable = document.getElementById('draggable-app');
    const dropTarget = document.getElementById('drop-target');
    const successMsg = document.getElementById('install-success-msg');

    if (!draggable || !dropTarget || !successMsg) return;

    draggable.addEventListener('dragstart', (e) => {
        draggable.classList.add('cursor-grabbing', 'dmg-dragging');
        e.dataTransfer.setData('text/plain', 'NoteTaker.app');
    });

    draggable.addEventListener('dragend', () => {
        draggable.classList.remove('cursor-grabbing', 'dmg-dragging');
    });

    dropTarget.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropTarget.classList.add('dmg-drop-hover');
    });

    dropTarget.addEventListener('dragleave', () => {
        dropTarget.classList.remove('dmg-drop-hover');
    });

    dropTarget.addEventListener('drop', (e) => {
        e.preventDefault();
        dropTarget.classList.remove('dmg-drop-hover');
        const data = e.dataTransfer.getData('text/plain');
        if (data === 'NoteTaker.app') {
            // Animate the draggable icon out
            draggable.style.transition = 'all 0.3s ease';
            draggable.style.transform = 'translate(-50%, -50%) scale(0)';
            draggable.style.opacity = '0';
            // Show success overlay
            setTimeout(() => {
                successMsg.classList.remove('d-none');
                successMsg.classList.add('d-flex');
            }, 300);
        }
    });
}

// 6. Scalable Pricing Toggle Interface & Simulated stripe Checkout
function setupPricingSwitcher() {
    const switchToggle = document.getElementById('pricing-switcher');
    const freeCard = document.getElementById('pricing-card-free');
    const paidCard = document.getElementById('pricing-card-paid');
    const btnPurchase = document.getElementById('btn-purchase-mock');
    const labelFree = document.getElementById('label-free-mode');
    const labelPaid = document.getElementById('label-paid-mode');
    
    // Stripe Sim Elements
    const btnPaySim = document.getElementById('btn-simulate-pay');
    const paySuccessBlock = document.getElementById('payment-success-block');

    const checkoutModalEl = document.getElementById('checkoutModal');
    let checkoutModalInstance = null;
    if (checkoutModalEl) {
        checkoutModalInstance = new bootstrap.Modal(checkoutModalEl);
    }

    switchToggle.addEventListener('change', () => {
        if (switchToggle.checked) {
            // Paid License Mode
            paidCard.classList.remove('opacity-60');
            paidCard.classList.add('border-active-glow', 'opacity-100');
            freeCard.classList.remove('border-active-glow');
            freeCard.classList.add('opacity-60');
            btnPurchase.disabled = false;
            
            labelPaid.classList.remove('text-secondary');
            labelPaid.classList.add('text-purple');
            labelFree.classList.remove('text-primary');
            labelFree.classList.add('text-secondary');
        } else {
            // Free Mode
            freeCard.classList.remove('opacity-60');
            freeCard.classList.add('border-active-glow');
            paidCard.classList.remove('border-active-glow', 'opacity-100');
            paidCard.classList.add('opacity-60');
            btnPurchase.disabled = true;

            labelFree.classList.remove('text-secondary');
            labelFree.classList.add('text-primary');
            labelPaid.classList.remove('text-purple');
            labelPaid.classList.add('text-secondary');
        }
    });

    btnPurchase.addEventListener('click', () => {
        if (checkoutModalInstance) {
            paySuccessBlock.classList.add('d-none');
            btnPaySim.disabled = false;
            btnPaySim.innerHTML = '<i class="bi bi-wallet2 me-2"></i>Simulate Stripe Payment';
            checkoutModalInstance.show();
        }
    });

    btnPaySim.addEventListener('click', () => {
        btnPaySim.disabled = true;
        btnPaySim.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Processing Payment...';
        
        setTimeout(() => {
            btnPaySim.innerHTML = '<i class="bi bi-check-lg text-success me-2"></i>Payment Received';
            paySuccessBlock.classList.remove('d-none');
            paySuccessBlock.classList.add('d-block');
        }, 1500);
    });
}

// 7. macOS Gatekeeper Install Guide — Tab Switcher
function setupGatekeeperTabs() {
    const tabButtons = document.querySelectorAll('.gk-tab-btn');
    const methodPanels = document.querySelectorAll('.gk-method-content');

    if (!tabButtons.length) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            // Update button states
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Hide all panels, then reveal the target with animation
            methodPanels.forEach(panel => {
                panel.classList.add('d-none');
                // Re-trigger the CSS fadeInUp by removing/re-adding the class
                panel.style.animation = 'none';
            });

            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.remove('d-none');
                // Force reflow so animation restarts cleanly
                void targetPanel.offsetWidth;
                targetPanel.style.animation = '';
            }
        });
    });
}
