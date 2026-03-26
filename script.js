// Excel Mastery Hub - Script.js

document.addEventListener('DOMContentLoaded', () => {
    // Select Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const content = document.querySelector('.content');
    const themeToggle = document.getElementById('theme-toggle');
    const searchBar = document.getElementById('search-bar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.module-content');
    const scrollProgress = document.getElementById('scroll-progress');
    const overallProgressBar = document.getElementById('overall-progress-bar');
    const overallProgressText = document.getElementById('overall-progress-text');

    // --- Sidebar Toggle ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
    });

    // --- Theme Toggle ---
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // --- Navigation Logic ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            if (targetId) {
                e.preventDefault();
                showSection(targetId);
                // On mobile, close sidebar when link is clicked
                if (window.innerWidth <= 992) {
                    sidebar.classList.add('collapsed');
                    content.classList.add('expanded');
                }
            }
        });
    });

    window.showSection = (id) => {
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === id) {
                section.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                markAsVisited(id);
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    };

    function showSection(id) {
        window.showSection(id);
    }

    // Function to scroll to a specific module from home page
    window.scrollToModule = (id) => {
        showSection(id);
    };

    // Helper to scroll to any ID on page
    window.scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            // If it's a module-content section, use showSection
            if (element.classList.contains('module-content')) {
                showSection(id);
            } else {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    // --- Progress Tracking ---
    const visitedModules = JSON.parse(localStorage.getItem('visitedModules')) || [];
    const totalModules = sections.length - 1; // Exclude welcome section

    function markAsVisited(id) {
        if (id !== 'welcome-section' && !visitedModules.includes(id)) {
            visitedModules.push(id);
            localStorage.setItem('visitedModules', JSON.stringify(visitedModules));
            updateProgress();
        }
    }

    // --- Solution Toggle Utility ---
    window.toggleSolution = (btnId) => {
        const solution = document.getElementById(btnId);
        if (solution.style.display === 'block') {
            solution.style.display = 'none';
        } else {
            solution.style.display = 'block';
        }
    };

    // Update progress check to trigger confetti at 100%
    function updateProgress() {
        const count = visitedModules.filter(id => id.startsWith('module-')).length;
        const progress = Math.min(Math.round((count / totalModules) * 100), 100);
        
        if (overallProgressBar) {
            overallProgressBar.style.width = `${progress}%`;
        }
        if (overallProgressText) {
            overallProgressText.innerText = `${progress}% Completed`;
        }

        // Show certificate and trigger confetti if 100% completed
        if (progress === 100) {
            const certLink = document.querySelector('a[href="#module-certificate"]');
            if (certLink) {
                certLink.style.color = '#107c41';
                certLink.style.fontWeight = '700';
            }
        }
    }

    updateProgress();

    // --- Search Functionality ---
    searchBar.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        // This is a simple implementation, it could be expanded to search content
        navLinks.forEach(link => {
            const text = link.innerText.toLowerCase();
            const parent = link.parentElement;
            if (text.includes(term)) {
                parent.style.display = 'block';
            } else {
                parent.style.display = 'none';
            }
        });
    });

    // --- Scroll Progress Bar ---
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";
    });

    // --- Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter-text');
    const phrases = ["Master Advanced Excel", "Build Professional Dashboards", "Automate Data Cleaning", "Excel for Job Success"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    
    if (typewriterElement) type();

    // --- Toast Notification ---
    window.showToast = (message) => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    };

    // --- Copy Formula Utility (Updated) ---
    window.copyFormula = (btn, formula) => {
        navigator.clipboard.writeText(formula).then(() => {
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.color = '#107c41';
            showToast("Formula copied to clipboard!");
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.style.color = '';
            }, 2000);
        });
    };

    // --- Simple Confetti Effect ---
    window.triggerConfetti = () => {
        const colors = ['#107c41', '#18a356', '#ffffff', '#ffd700'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.zIndex = '10000';
            confetti.style.borderRadius = '2px';
            confetti.style.pointerEvents = 'none';
            document.body.appendChild(confetti);

            const animation = confetti.animate([
                { transform: `translate3d(0, 0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate3d(${(Math.random() - 0.5) * 200}px, 100vh, 0) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0, .9, .57, 1)'
            });

            animation.onfinish = () => confetti.remove();
        }
    };

    // --- User Registration & Login Logic ---
    const regModal = document.getElementById('user-reg-modal');
    const loginModal = document.getElementById('login-modal');
    const otpModal = document.getElementById('otp-modal');
    const regForm = document.getElementById('reg-form');
    const loginForm = document.getElementById('login-form');
    const otpForm = document.getElementById('otp-form');
    const userProfile = document.getElementById('user-profile');
    const loginNavBtn = document.getElementById('login-nav-btn');
    const sidebarElement = document.getElementById('sidebar');
    const mainContent = document.querySelector('.content');
    const landingSection = document.getElementById('landing-page');
    const welcomeSection = document.getElementById('welcome-section');
    
    let tempUserData = null;
    let generatedOtp = null;

    window.openRegModal = () => {
        loginModal.style.display = 'none';
        regModal.style.display = 'flex';
    };
    window.closeRegModal = () => regModal.style.display = 'none';
    
    window.openLoginModal = () => {
        regModal.style.display = 'none';
        loginModal.style.display = 'flex';
    };
    window.closeLoginModal = () => loginModal.style.display = 'none';

    window.closeOtpModal = () => otpModal.style.display = 'none';

    function updateAuthUI(user) {
        const adminNavItem = document.getElementById('admin-nav-item');
        const adminPhone = "923459572281"; // Admin Phone Number

        if (user) {
            userProfile.style.display = 'flex';
            loginNavBtn.style.display = 'none';
            document.getElementById('user-display-name').innerText = user.name.split(' ')[0];
            document.getElementById('panel-user-name').innerText = user.name;
            document.getElementById('panel-user-phone').innerText = user.phone;
            
            // Show Sidebar & Learning Section
            sidebarElement.style.display = 'block';
            sidebarElement.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
            
            // Hide Landing Page, Show Welcome
            if (landingSection) landingSection.classList.remove('active');
            if (welcomeSection) welcomeSection.classList.add('active');
            
            // Show Sidebar Toggle
            document.getElementById('sidebar-toggle').style.display = 'block';

            // Show/Hide Admin Menu
            if (user.phone === adminPhone) {
                adminNavItem.style.display = 'block';
            } else {
                adminNavItem.style.display = 'none';
            }

            // Auto-fill contact phone if exists
            const contactPhoneInput = document.getElementById('contact-phone');
            if (contactPhoneInput) contactPhoneInput.value = user.phone;

            // Populate Account Settings
            document.getElementById('setting-user-name').innerText = user.name;
            document.getElementById('setting-user-phone').innerText = user.phone;

            // Render user submissions
            renderSubmissions(user.phone);
        } else {
            userProfile.style.display = 'none';
            loginNavBtn.style.display = 'flex';
            adminNavItem.style.display = 'none';
            
            // Hide Sidebar & show Landing Page
            sidebarElement.style.display = 'none';
            mainContent.classList.add('expanded');
            
            if (landingSection) landingSection.classList.add('active');
            if (welcomeSection) welcomeSection.classList.remove('active');
            
            // Hide Sidebar Toggle
            document.getElementById('sidebar-toggle').style.display = 'none';
        }
    }

    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    updateAuthUI(savedUser);

    // --- WhatsApp API Integration Helper (UltraMsg - Automatic Background) ---
    async function sendWhatsAppMessage(phone, message) {
        const INSTANCE_ID = "instance167289";
        const TOKEN = "y610w9462j4c2vxc";
        
        // --- Phone Number Formatting ---
        let formattedPhone = phone.trim().replace(/\D/g, ''); 
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '92' + formattedPhone.substring(1);
        } else if (formattedPhone.length === 10) {
            formattedPhone = '92' + formattedPhone;
        }
        
        console.log("Attempting to send OTP automatically to:", formattedPhone);

        // Using GET method for better CORS compatibility on GitHub Pages
        const url = `https://api.ultramsg.com/${INSTANCE_ID}/messages/chat?token=${TOKEN}&to=${formattedPhone}&body=${encodeURIComponent(message)}&priority=10`;

        try {
            const response = await fetch(url, { method: "GET" });
            const result = await response.json();
            console.log("UltraMsg API Response:", result);
            
            if (result.sent === "true" || result.id || result.success) {
                console.log("OTP Sent Successfully in Background!");
                return true;
            } else {
                console.error("UltraMsg API Error Detail:", result);
                showToast("OTP API Error: " + (result.error || "Check UltraMsg credits/status"));
                return false;
            }
        } catch (error) {
            console.error("WhatsApp API Final Catch Error:", error);
            showToast("Connection Error: Background OTP failed. Check Console (F12).");
            return false;
        }
    }

    // Updated Toast to include optional "Copy" button for OTP testing
    window.showToast = (message, isOtp = false, otpCode = '') => {
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerHTML = `
            <span>${message}</span>
            ${isOtp ? `<button class="btn btn-sm btn-secondary" onclick="copyToClipboard('${otpCode}')" style="margin-left: 10px; padding: 2px 8px; font-size: 0.7rem;">Copy</button>` : ''}
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            showToast("OTP copied to clipboard!");
        });
    };

    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const phone = document.getElementById('reg-phone').value;
        const password = document.getElementById('reg-password').value;
        
        // Password Strength Validation
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/.test(password)) {
            showToast("Password must meet all requirements!");
            return;
        }

        // WhatsApp Phone Validation
        if (!/^\d{10,12}$/.test(phone)) {
            showToast("Please enter a valid WhatsApp number.");
            return;
        }

        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        if (allUsers.find(u => u.phone === phone)) {
            showToast("Phone number already registered. Please login.");
            openLoginModal();
            return;
        }

        tempUserData = { name, phone, password, registrationDate: new Date().toLocaleDateString() };
        
        // Generate OTP
        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Show OTP Modal first
        regModal.style.display = 'none';
        otpModal.style.display = 'flex';
        document.getElementById('display-otp-phone').innerText = phone;
        
        // Send WhatsApp OTP
        const otpMessage = `Your Excel Mastery Hub OTP is: *${generatedOtp}*. Do not share this with anyone.`;
        const sent = await sendWhatsAppMessage(phone, otpMessage);
        
        if (sent) {
            showToast(`OTP sent to WhatsApp! (Code: ${generatedOtp})`, true, generatedOtp);
        } else {
            showToast("Failed to send OTP.");
        }
    });

    // --- Password Strength Checker ---
    const passwordInput = document.getElementById('reg-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const requirements = {
        length: document.getElementById('req-length'),
        uppercase: document.getElementById('req-uppercase'),
        lowercase: document.getElementById('req-lowercase'),
        number: document.getElementById('req-number'),
        special: document.getElementById('req-special'),
    };

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        let score = 0;
        const regex = {
            uppercase: /[A-Z]/,
            lowercase: /[a-z]/,
            number: /[0-9]/,
            special: /[!@#$%]/, 
        };

        const reqs = {
            length: password.length >= 8,
            uppercase: regex.uppercase.test(password),
            lowercase: regex.lowercase.test(password),
            number: regex.number.test(password),
            special: regex.special.test(password),
        };

        Object.keys(reqs).forEach(key => {
            if (reqs[key]) {
                score++;
                requirements[key].classList.add('valid');
            } else {
                requirements[key].classList.remove('valid');
            }
        });

        strengthBar.style.width = (score / 5) * 100 + '%';
        switch (score) {
            case 0:
            case 1:
            case 2:
                strengthText.innerText = 'Weak';
                strengthBar.style.background = '#d13438';
                break;
            case 3:
            case 4:
                strengthText.innerText = 'Medium';
                strengthBar.style.background = '#f0ad4e';
                break;
            case 5:
                strengthText.innerText = 'Strong';
                strengthBar.style.background = '#107c41';
                break;
        }
    });

    otpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredOtp = document.getElementById('otp-code').value;
        
        if (enteredOtp === generatedOtp) {
            // Success! Save user
            const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
            allUsers.push(tempUserData);
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            localStorage.setItem('currentUser', JSON.stringify(tempUserData));
            
            closeOtpModal();
            updateAuthUI(tempUserData);
            showToast(`Welcome ${tempUserData.name}! Verified successfully.`);
            triggerConfetti();
        } else {
            showToast("Invalid OTP code. Please check your WhatsApp.");
        }
    });

    window.resendOtp = () => {
        if (!tempUserData) return;
        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpMessage = `Your Excel Mastery Hub OTP is: *${generatedOtp}*. Do not share this with anyone.`;
        const waUrl = `https://wa.me/${tempUserData.phone}?text=${encodeURIComponent(otpMessage)}`;
        window.open(waUrl, '_blank');
        showToast("New OTP sent!");
    };

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = document.getElementById('login-phone').value;
        const password = document.getElementById('login-password').value;
        
        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        const user = allUsers.find(u => u.phone === phone && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            closeLoginModal();
            updateAuthUI(user);
            showToast(`Welcome back, ${user.name}!`);
        } else {
            showToast("Invalid phone number or password.");
        }
    });

    // --- Account Settings & Password Forms Logic ---
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const oldPass = document.getElementById('old-password').value;
            const newPass = document.getElementById('new-password').value;
            const confirmPass = document.getElementById('confirm-new-password').value;
            const user = JSON.parse(localStorage.getItem('currentUser'));

            if (oldPass !== user.password) {
                showToast("Old password is incorrect!");
                return;
            }
            if (newPass !== confirmPass) {
                showToast("Passwords do not match!");
                return;
            }
            
            // Password Strength Check for New Password
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/.test(newPass)) {
                showToast("New password does not meet requirements!");
                return;
            }

            // Update user in all records
            const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
            const userIdx = allUsers.findIndex(u => u.phone === user.phone);
            if (userIdx !== -1) {
                allUsers[userIdx].password = newPass;
                localStorage.setItem('allUsers', JSON.stringify(allUsers));
                user.password = newPass;
                localStorage.setItem('currentUser', JSON.stringify(user));
                showToast("Password updated successfully!");
                closeChangePasswordModal();
                changePasswordForm.reset();
            }
        });
    }

    const forgotPasswordForm = document.getElementById('forgot-password-form');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('forgot-phone').value;
            const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
            const user = allUsers.find(u => u.phone === phone);

            if (user) {
                tempUserData = user; // Store for reset logic
                generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpMessage = `Your Excel Mastery Hub Password Reset OTP is: *${generatedOtp}*`;
                
                const sent = await sendWhatsAppMessage(phone, otpMessage);
                if (sent) {
                    closeForgotPasswordModal();
                    document.getElementById('reset-password-otp-modal').style.display = 'flex';
                    showToast(`OTP sent to WhatsApp! (Code: ${generatedOtp})`, true, generatedOtp);
                } else {
                    showToast("Failed to send OTP.");
                }
            } else {
                showToast("Number not registered!");
            }
        });
    }

    const resetPasswordOtpForm = document.getElementById('reset-password-otp-form');
    if (resetPasswordOtpForm) {
        resetPasswordOtpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredOtp = document.getElementById('reset-otp-code').value;
            const newPass = document.getElementById('reset-new-password').value;

            if (enteredOtp !== generatedOtp) {
                showToast("Invalid OTP!");
                return;
            }

            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,}$/.test(newPass)) {
                showToast("Password does not meet requirements!");
                return;
            }

            const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
            const userIdx = allUsers.findIndex(u => u.phone === tempUserData.phone);
            if (userIdx !== -1) {
                allUsers[userIdx].password = newPass;
                localStorage.setItem('allUsers', JSON.stringify(allUsers));
                showToast("Password reset successfully! Please login.");
                closeResetPasswordOtpModal();
                openLoginModal();
            }
        });
    }

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contact-name').value;
            const phone = document.getElementById('contact-phone').value;
            const message = document.getElementById('contact-message').value;
            
            const adminPhone = "923459572281";
            const waMessage = `*New Contact Message*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Message:* ${message}`;
            const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(waMessage)}`;
            
            // Show Success Animation
            const successModal = document.getElementById('contact-success-modal');
            successModal.style.display = 'flex';
            
            setTimeout(() => {
                successModal.style.display = 'none';
                window.open(waUrl, '_blank');
                contactForm.reset();
                // Re-fill phone if logged in
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser) document.getElementById('contact-phone').value = currentUser.phone;
            }, 3000);
        });
    }

    window.toggleUserPanel = () => {
        document.getElementById('user-panel').classList.toggle('show');
    };

    window.logoutUser = () => {
        localStorage.removeItem('currentUser');
        updateAuthUI(null);
        showToast("Logged out successfully.");
        window.location.reload();
    };

    // Close panel when clicking outside
    window.addEventListener('click', (e) => {
        const panel = document.getElementById('user-panel');
        const profileBtn = document.querySelector('.profile-btn');
        if (panel && !panel.contains(e.target) && !profileBtn.contains(e.target)) {
            panel.classList.remove('show');
        }
    });

    // --- WhatsApp Submission Logic ---
    window.submitViaWhatsApp = (topic) => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            showToast("Please register first!");
            if (regModal) regModal.style.display = 'flex';
            return;
        }

        const adminPhone = "923459572281"; // Updated as per user request
        const message = `*Practice File Submission*\n\n*Name:* ${user.name}\n*Phone:* ${user.phone}\n*Topic:* ${topic}\n\n_I have completed the practice file. Please review it._`;
        const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
        showToast("Opening WhatsApp to submit...");
    };

    window.downloadAndPromptSubmit = (fileName) => {
        showToast(`Downloading ${fileName}... Please solve and submit via WhatsApp.`);
        // Simulating download (actual link is dummy)
    };

    // --- Updated Assessment Data (20 Questions for Beginner) ---
    const quizData = {
        beginner: {
            title: "Beginner Level Assessment (50 Marks)",
            passingScore: 30,
            questions: [
                { q: "What is the correct way to start an Excel formula?", options: ["+", "-", "=", "@"], correct: 1 },
                { q: "What is the keyboard shortcut to 'Flash Fill' data based on a pattern?", options: ["Ctrl+F", "Ctrl+E", "Ctrl+D", "Ctrl+G"], correct: 1 },
                { q: "How do you make a cell reference 'Absolute' so it doesn't change when copied?", options: ["Add #", "Add $", "Add @", "Add %"], correct: 1 },
                { q: "Where can you find the 'Wrap Text' option to show all content in one cell?", options: ["Data Tab", "Insert Tab", "Home Tab", "View Tab"], correct: 2 },
                { q: "Which function is used to calculate the total of a range of numbers?", options: ["TOTAL()", "ADD()", "COUNT()", "SUM()"], correct: 3 },
                { q: "Shortcut key to open a New Workbook?", options: ["Ctrl+O", "Ctrl+N", "Ctrl+S", "Ctrl+M"], correct: 1 },
                { q: "Shortcut key to Save a Workbook?", options: ["Ctrl+S", "Ctrl+V", "Ctrl+Z", "Ctrl+A"], correct: 0 },
                { q: "Shortcut key to Print a Workbook?", options: ["Ctrl+P", "Ctrl+Q", "Ctrl+R", "Ctrl+T"], correct: 0 },
                { q: "What is the intersection of a Row and a Column called?", options: ["Sheet", "Cell", "Grid", "Range"], correct: 1 },
                { q: "Name Box displays the:", options: ["Formula", "Cell Address", "Worksheet Name", "Total Sum"], correct: 1 },
                { q: "Formula Bar displays the:", options: ["Cell content", "File name", "Sheet name", "Excel version"], correct: 0 },
                { q: "Shortcut key to Undo an action?", options: ["Ctrl+Y", "Ctrl+Z", "Ctrl+X", "Ctrl+C"], correct: 1 },
                { q: "Shortcut key to Redo an action?", options: ["Ctrl+Y", "Ctrl+Z", "Ctrl+X", "Ctrl+C"], correct: 0 },
                { q: "How are columns labeled in Excel?", options: ["1, 2, 3...", "A, B, C...", "I, II, III...", "First, Second..."], correct: 1 },
                { q: "How are rows labeled in Excel?", options: ["1, 2, 3...", "A, B, C...", "I, II, III...", "First, Second..."], correct: 0 },
                { q: "Quick Access Toolbar is usually located at the:", options: ["Bottom", "Top Left", "Middle", "Right Side"], correct: 1 },
                { q: "What is a collection of worksheets called?", options: ["Workpage", "Workbook", "Workfile", "Worksite"], correct: 1 },
                { q: "Shortcut to find a specific text?", options: ["Ctrl+H", "Ctrl+F", "Ctrl+G", "Ctrl+D"], correct: 1 },
                { q: "Shortcut to replace text?", options: ["Ctrl+H", "Ctrl+F", "Ctrl+G", "Ctrl+D"], correct: 0 },
                { q: "Shortcut to apply a Filter?", options: ["Ctrl+Shift+F", "Ctrl+Shift+L", "Ctrl+Shift+K", "Ctrl+Shift+A"], correct: 1 }
            ]
        },
        intermediate: {
            title: "Intermediate Level Assessment (70 Marks)",
            passingScore: 50,
            questions: [
                { q: "What is a major limitation of the VLOOKUP function?", options: ["Cannot handle text", "Only looks to the right", "Cannot handle numbers", "Slow for small data"], correct: 1 },
                { q: "Which Excel feature allows you to create a Dropdown list in a cell?", options: ["Conditional Formatting", "Goal Seek", "Data Validation", "Text to Columns"], correct: 2 },
                { q: "What is the keyboard shortcut to quickly apply/remove a Filter?", options: ["Ctrl+Shift+F", "Ctrl+Shift+L", "Ctrl+Alt+F", "Ctrl+Alt+L"], correct: 1 },
                { q: "Which tool is used to find the input value needed to achieve a specific result?", options: ["Slicer", "Pivot Table", "Goal Seek", "Data Model"], correct: 2 },
                { q: "How do you update a Pivot Table after the source data has changed?", options: ["Save & Reopen", "Right-click > Refresh", "Ctrl+U", "Insert new Pivot"], correct: 1 },
                { q: "What is the difference between COUNT() and COUNTA()?", options: ["No difference", "COUNT handles text, COUNTA numbers", "COUNT handles numbers, COUNTA handles all non-empty", "COUNTA is for hidden cells"], correct: 2 },
                { q: "What does it mean when a cell displays '####'?", options: ["Formula Error", "Cell is Empty", "Column width is too small", "File is corrupted"], correct: 2 }
            ]
        },
        expert: {
            title: "Expert Level Assessment (100 Marks)",
            passingScore: 70,
            questions: [
                { q: "What is the default match type for the modern XLOOKUP function?", options: ["Approximate (1)", "Exact (0)", "Next Smaller (-1)", "Wildcard (2)"], correct: 1 },
                { q: "Why is INDEX+MATCH often preferred over VLOOKUP by professionals?", options: ["It's easier to write", "It can look both left and right", "It's slower but safer", "It only works with Tables"], correct: 1 },
                { q: "In Power Query, what does 'Unpivoting' columns do?", options: ["Deletes empty columns", "Transforms columns into attribute-value pairs (rows)", "Sorts columns alphabetically", "Merges multiple tables"], correct: 1 },
                { q: "What is the official formula language used in Power Pivot and Data Models?", options: ["VBA", "SQL", "DAX", "Python"], correct: 2 },
                { q: "Which function returns a reference to a range based on a text string?", options: ["INDIRECT()", "OFFSET()", "INDEX()", "MATCH()"], correct: 0 },
                { q: "What is the primary purpose of the IFERROR() function?", options: ["To delete errors", "To highlight errors in red", "To display a custom value if a formula fails", "To stop Excel from crashing"], correct: 2 },
                { q: "Which function is used to create a dynamic range that starts from a specific cell?", options: ["VLOOKUP()", "OFFSET()", "CONCAT()", "TEXT()"], correct: 1 },
                { q: "In older versions of Excel, how were Array Formulas (CSE) finalized?", options: ["Enter", "Ctrl+Enter", "Ctrl+Shift+Enter", "Alt+Enter"], correct: 2 },
                { q: "What is the main benefit of using the 'Data Model' in Excel?", options: ["Makes file size smaller", "Allows relationships between different tables", "Adds more colors to charts", "Protects cells with passwords"], correct: 1 },
                { q: "What is the visual filtering tool used for Pivot Tables and Charts?", options: ["Filter Icon", "Slicer", "Timeline", "Both Slicer and Timeline"], correct: 3 }
            ]
        }
    };

    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];

    // --- Assessment Logic ---
    window.startAssessment = (level) => {
        const progress = calculateProgress();
        // For development/testing, you can bypass this by setting progress to 100
        if (progress < 100) {
            showToast(`Course not complete! Progress: ${progress}%. Please visit all modules first.`);
            return;
        }

        if (completedLevels.includes(level)) {
            showToast("You have already passed this level!");
            return;
        }

        if (level === 'intermediate' && !completedLevels.includes('beginner')) {
            showToast("Complete Beginner level first!");
            return;
        }
        if (level === 'expert' && !completedLevels.includes('intermediate')) {
            showToast("Complete Intermediate level first!");
            return;
        }

        currentQuiz = quizData[level];
        currentQuestionIndex = 0;
        userAnswers = new Array(currentQuiz.questions.length).fill(null);
        quizAttempted = false;
        
        document.getElementById('quiz-intro').style.display = 'none';
        document.getElementById('quiz-area').style.display = 'block';
        document.getElementById('current-quiz-level').innerText = currentQuiz.title;
        
        showQuestion();
    };

    function showQuestion() {
        const question = currentQuiz.questions[currentQuestionIndex];
        const container = document.getElementById('question-container');
        document.getElementById('quiz-progress').innerText = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
        
        let html = `<p class="quiz-question-text" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1.5rem;">${question.q}</p>`;
        question.options.forEach((opt, idx) => {
            const isSelected = userAnswers[currentQuestionIndex] === idx;
            let btnClass = 'quiz-option';
            
            if (quizAttempted) {
                if (idx === question.correct) {
                    btnClass += ' correct-answer';
                } else if (isSelected && idx !== question.correct) {
                    btnClass += ' wrong-answer';
                }
            } else if (isSelected) {
                btnClass += ' selected';
            }

            html += `<button class="${btnClass}" onclick="selectOption(${idx})" ${quizAttempted ? 'disabled' : ''}>${opt}</button>`;
        });
        
        container.innerHTML = html;
        
        document.getElementById('prev-btn').style.display = 'none'; // Hide previous button to prevent going back
        document.getElementById('next-btn').innerText = currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Submit' : 'Next';
    }

    let quizAttempted = false;

    window.selectOption = (idx) => {
        if (quizAttempted) return; // Prevent changing answer
        userAnswers[currentQuestionIndex] = idx;
        quizAttempted = true;
        showQuestion();
    };

    document.getElementById('next-btn').addEventListener('click', () => {
        if (userAnswers[currentQuestionIndex] === null) {
            showToast("Please select an answer!");
            return;
        }

        quizAttempted = false; // Reset for next question

        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            finishQuiz();
        }
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    });

    // --- Account Settings & Password Modals ---
    const changePasswordModal = document.getElementById('change-password-modal');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const resetPasswordOtpModal = document.getElementById('reset-password-otp-modal');

    window.openChangePasswordModal = () => changePasswordModal.style.display = 'flex';
    window.closeChangePasswordModal = () => changePasswordModal.style.display = 'none';
    window.openForgotPasswordModal = () => {
        closeChangePasswordModal(); // Close other modals
        forgotPasswordModal.style.display = 'flex';
    };
    window.closeForgotPasswordModal = () => forgotPasswordModal.style.display = 'none';
    window.closeResetPasswordOtpModal = () => resetPasswordOtpModal.style.display = 'none';

    // --- My Submissions Logic ---
    function renderSubmissions(userPhone) {
        const submissions = JSON.parse(localStorage.getItem('allSubmissions')) || [];
        const userSubmissions = submissions.filter(s => s.phone === userPhone);
        const submissionsBody = document.getElementById('submissions-body');
        
        if (userSubmissions.length > 0) {
            submissionsBody.innerHTML = userSubmissions.map(s => `
                <tr>
                    <td>${s.level}</td>
                    <td>${s.score}</td>
                    <td><span class="badge ${s.status === 'Passed' ? 'badge-success' : 'badge-danger'}">${s.status}</span></td>
                    <td>${s.date}</td>
                </tr>
            `).join('');
        } else {
            submissionsBody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No submissions yet.</td></tr>`;
        }
    }

    // --- Finalize Quiz & Save Submission ---
    function finishQuiz() {
        let score = 0;
        currentQuiz.questions.forEach((q, idx) => {
            if (userAnswers[idx] === q.correct) score++;
        });

        const totalMarks = score * (currentQuiz.title.includes('Beginner') ? 10 : (currentQuiz.title.includes('Intermediate') ? 14 : 20));
        const requiredMarks = currentQuiz.passingScore;
        const level = Object.keys(quizData).find(key => quizData[key] === currentQuiz);
        const status = totalMarks >= requiredMarks ? 'Passed' : 'Failed';
        const user = JSON.parse(localStorage.getItem('currentUser'));

        // Save submission
        const allSubmissions = JSON.parse(localStorage.getItem('allSubmissions')) || [];
        allSubmissions.push({
            phone: user.phone,
            level: level,
            score: `${totalMarks} / ${currentQuiz.questions.length * (level === 'beginner' ? 10 : (level === 'intermediate' ? 14 : 20))}`,
            status: status,
            date: new Date().toLocaleDateString(),
        });
        localStorage.setItem('allSubmissions', JSON.stringify(allSubmissions));

        if (status === 'Passed') {
            if (!completedLevels.includes(level)) {
                completedLevels.push(level);
                localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
            }
            showToast(`Excellent! You scored ${totalMarks} marks. Level Cleared!`);
            triggerConfetti();
            if (level === 'expert') {
                showToast("Congratulations! You are now an Excel Expert. Claim your certificate!");
            }
        } else {
            showToast(`You scored ${totalMarks} marks. You need at least ${requiredMarks} to pass. Try again!`);
        }
        exitQuiz();
    }

    function exitQuiz() {
        document.getElementById('quiz-area').style.display = 'none';
        document.getElementById('quiz-intro').style.display = 'block';
        updateAssessmentUI();
    }

    function updateAssessmentUI() {
        completedLevels.forEach(level => {
            const card = document.getElementById(`level-${level}-card`);
            card.classList.add('completed');
            card.classList.remove('locked');
            document.getElementById(`${level}-status`).innerText = "Passed";
        });

        if (completedLevels.includes('beginner')) {
            document.getElementById('level-intermediate-card').classList.remove('locked');
            document.getElementById('btn-intermediate').disabled = false;
        }
        if (completedLevels.includes('intermediate')) {
            document.getElementById('level-expert-card').classList.remove('locked');
            document.getElementById('btn-expert').disabled = false;
        }

        // Show "Get Certificate" button only if Expert is passed
        const welcomeHero = document.querySelector('.hero-buttons');
        const existingCertBtn = document.getElementById('hero-cert-btn');
        
        if (completedLevels.includes('expert') && !existingCertBtn) {
            const certBtn = document.createElement('button');
            certBtn.id = 'hero-cert-btn';
            certBtn.className = 'btn btn-primary btn-lg';
            certBtn.innerHTML = '<i class="fas fa-certificate"></i> Claim Certificate';
            certBtn.onclick = () => showCertificate();
            welcomeHero.appendChild(certBtn);
        }
    }

    function calculateProgress() {
        const count = visitedModules.filter(id => id.startsWith('module-')).length;
        return Math.min(Math.round((count / totalModules) * 100), 100);
    }

    // --- Record System ---
    const certificateRecords = JSON.parse(localStorage.getItem('certRecords')) || [];

    function saveRecord(name, level) {
        const record = {
            name: name,
            date: new Date().toLocaleDateString(),
            level: level,
            id: 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        };
        certificateRecords.push(record);
        localStorage.setItem('certRecords', JSON.stringify(certificateRecords));
        renderRecords();
    }

    function renderRecords(data = certificateRecords) {
        const body = document.getElementById('records-body');
        document.getElementById('total-certs').innerText = certificateRecords.length;
        
        body.innerHTML = data.map(rec => `
            <tr>
                <td>${rec.name}</td>
                <td>${rec.date}</td>
                <td>${rec.level}</td>
                <td style="font-family: monospace; font-weight: bold;">${rec.id}</td>
            </tr>
        `).join('');
    }

    window.searchRecords = () => {
        const term = document.getElementById('admin-search').value.toLowerCase();
        const filtered = certificateRecords.filter(rec => 
            rec.name.toLowerCase().includes(term) || 
            rec.date.toLowerCase().includes(term) || 
            rec.id.toLowerCase().includes(term)
        );
        renderRecords(filtered);
    };

    window.bypassProgress = () => {
        sections.forEach(section => {
            if (section.id !== 'welcome-section' && !visitedModules.includes(section.id)) {
                visitedModules.push(section.id);
            }
        });
        localStorage.setItem('visitedModules', JSON.stringify(visitedModules));
        updateProgress();
        updateAssessmentUI();
        showToast("Dev Mode: All modules marked as visited. Tests unlocked!");
    };

    window.clearAllRecords = () => {
        if (confirm("Are you sure you want to clear all certificate records? This cannot be undone.")) {
            localStorage.removeItem('certRecords');
            certificateRecords.length = 0;
            renderRecords();
        }
    };

    // --- Certificate Modal ---
    const modal = document.getElementById('certificate-modal');
    const closeBtn = document.querySelector('.close-modal');

    window.showCertificate = () => {
        if (!completedLevels.includes('expert')) {
            showToast("Complete Expert Level test first!");
            return;
        }

        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            document.getElementById('student-name').innerText = user.name;
            document.getElementById('student-phone').innerText = user.phone;
            document.getElementById('cert-date-text').innerText = new Date().toLocaleDateString();
            modal.style.display = 'flex';
            triggerConfetti();
            saveRecord(user.name, "Expert Specialist");
        } else {
            showToast("User data not found. Please register.");
        }
    };

    window.shareCertificateWhatsApp = () => {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const adminPhone = "923459572281"; // Updated as per user request
        const message = `*Excel Mastery Hub Certificate Claim*\n\n*Name:* ${user.name}\n*Phone:* ${user.phone}\n*Status:* Completed Expert Level\n\n_I have earned my certificate. Please verify my records._`;
        const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    // --- Admin Search Users ---
    window.searchUsers = () => {
        const term = document.getElementById('admin-user-search').value.toLowerCase();
        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
        const filtered = allUsers.filter(u => 
            u.name.toLowerCase().includes(term) || 
            u.phone.toLowerCase().includes(term)
        );
        renderUsers(filtered);
    };

    function renderUsers(data = null) {
        const allUsers = data || JSON.parse(localStorage.getItem('allUsers')) || [];
        const body = document.getElementById('users-body');
        document.getElementById('total-users').innerText = allUsers.length;
        
        body.innerHTML = allUsers.map(u => `
            <tr>
                <td>${u.name}</td>
                <td>${u.phone}</td>
                <td>${u.registrationDate}</td>
                <td><span class="password-hidden" onclick="this.innerText='${u.password}'">••••••••</span></td>
            </tr>
        `).join('');
    }

    // Initial calls
    updateAssessmentUI();
    renderRecords();
    renderUsers();

    if (closeBtn) {
        closeBtn.onclick = () => modal.style.display = 'none';
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
