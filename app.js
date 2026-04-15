let currStep = 1;
const totalSteps = 3

let formData = {
    email: '',
    username: '',
    password: '',
    fullname: '',
    age: '',
    phone: '',
    color: '',
    newsletter: 'yes'
}

function init() {
    loadSaveData();
    updateProgress();
    updateButtons();
    setupAutoSave();

    document.getElementById("nextBtn").addEventListener("click", nextStep);
    document.getElementById("prevBtn").addEventListener("click", prevStep);
    document.getElementById("resetBtn").addEventListener("click", resetAllData);
}

init();

function loadSaveData() {
    const saved = localStorage.getItem("multipart-form");
    if (saved) {
        const parsed = JSON.parse(saved);
        formData = { ...formData, ...parsed }

        // Populate form fields with saved data
        document.getElementById('email').value = formData.email;
        document.getElementById('username').value = formData.username;
        document.getElementById('password').value = formData.password;
        document.getElementById('fullname').value = formData.fullname;
        document.getElementById('age').value = formData.age;
        document.getElementById('phone').value = formData.phone;
        document.getElementById('color').value = formData.color;
        document.getElementById('newsletter').value = formData.newsletter;
    }
}

function updateProgress() {
    const progressPercent = (currStep / totalSteps) * 100
    document.getElementById("progress-fill").style.width = progressPercent + '%';
}

function updateButtons() {
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (currStep === 1) {
        prevBtn.style.display = "none";
    } else {
        prevBtn.style.display = "block";
    }

    if (currStep === totalSteps) {
        nextBtn.textContent = "Submit";
        nextBtn.classList.add("btn-submit");
        nextBtn.classList.remove('btn-next');
    } else {
        nextBtn.textContent = "Next";
        nextBtn.classList.remove('btn-submit');
        nextBtn.classList.add("btn-next");
    }
}

function setupAutoSave() {
    const inputs = document.querySelectorAll("input, select")
    inputs.forEach(input => {
        input.addEventListener("input", function () {
            saveCurrentStepData();
        });
    });
}

function saveCurrentStepData() {
    if (currStep === 1) {
        formData.email = document.getElementById('email').value;
        formData.username = document.getElementById('username').value;
        formData.password = document.getElementById('password').value;
    } else if (currStep === 2) {
        formData.fullname = document.getElementById('fullname').value;
        formData.age = document.getElementById('age').value;
        formData.phone = document.getElementById('phone').value;
    } else if (currStep === 3) {
        formData.color = document.getElementById('color').value;
        formData.newsletter = document.getElementById('newsletter').value;
    }

    //save
    localStorage.setItem("multipart-form", JSON.stringify(formData));
}

function showSummary() {
    saveCurrentStepData();

    const summary = `
        <div class=summary-card>
            <h3>📋 Registration Summary</h3>
            <div class="summary-item">
                <div class="summary-label">Email:</div>
                <div class="summary-value">${escapeHtml(formData.email)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Username:</div>
                <div class="summary-value">${escapeHtml(formData.username)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Full Name:</div>
                <div class="summary-value">${escapeHtml(formData.fullname)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Age:</div>
                <div class="summary-value">${escapeHtml(formData.age)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Phone:</div>
                <div class="summary-value">${formData.phone ? escapeHtml(formData.phone) : 'Not provided'}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Favorite Color:</div>
                <div class="summary-value">${escapeHtml(formData.color)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Newsletter Subscription:</div>
                <div class="summary-value">${formData.newsletter === 'yes' ? 'Yes' : 'No'}</div>      
        </div>
        <div class="success-message">
            ✅ Registration Complete! Check your email to verify.
        </div>
    `;

    const stepContainer = document.querySelector('.progress-container').parentNode;
    const oldContent = document.querySelectorAll('.step, .buttons, .btn-reset');

    oldContent.forEach(el => el.style.display = "none");

    //Insert summary
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = summary;
    stepContainer.appendChild(tempDiv);
}

function escapeHtml(text) {
    if (!text) {
        return '';
    }
    return text.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function nextStep() {
    if (!validateStep(currStep)) {
        return; //Validation failed
    }

    saveCurrentStepData();

    if (currStep === totalSteps) {
        showSummary();
        return;
    }

    //hide current steps
    document.getElementById(`step-${currStep}`).classList.remove("active");

    currStep++;

    //show next step
    document.getElementById(`step-${currStep}`).classList.add("active");

    //ipdate UI
    updateProgress();
    updateButtons();
}

function prevStep() {
    if (currStep === 1) { return; }

    // save cuurent step data before leaving
    saveCurrentStepData();

    //hide current steps
    document.getElementById(`step-${currStep}`).classList.remove("active");
    currStep--;

    document.getElementById(`step-${currStep}`).classList.add("active");

    updateProgress();
    updateButtons();
}

function resetAllData() {
    if (confirm('Are you sure you want to delete all data')) {
        localStorage.removeItem("multipart-form");

        formData = {
            email: '',
            username: '',
            password: '',
            fullname: '',
            age: '',
            phone: '',
            color: '',
            newsletter: 'yes'
        }

        // Reset all form fields
        document.getElementById('email').value = '';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('fullname').value = '';
        document.getElementById('age').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('color').value = '';
        document.getElementById('newsletter').value = 'yes';

        document.querySelectorAll('input', 'select').forEach(field => {
            field.value = "";
        });
        document.querySelectorAll('.error-message').forEach(msg => {
            msg.classList.remove('show');
        });

        currStep = 1;

        for (let i = 0; i <= totalSteps; i++) {
            document.getElementById(`step-${i}`).classList.remove("active");
        }

        document.getElementById(`step-${currStep}`).classList.add("active");

        //show form elements
        document.querySelectorAll('.step, .buttons, .btn-reset').forEach(el => {
            el.style.display = "block";
        });

        //remove summary if exists
        const summaryDiv = document.querySelector('.summary-card, .success-message');
        if (summaryDiv && summaryDiv.parentNode) {
            summaryDiv.parentNode.remove();
        }
    }
}

function validateStep(step) {
    let isValid = true;

    if (step === 1) {
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !regex.test(email)) {
            document.getElementById('email').classList.add('error');
            document.getElementById('email-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('email').classList.remove('error');
            document.getElementById('email-error').classList.remove('show');
        }

        if (!username || username.length < 3) {
            document.getElementById('username').classList.add('error');
            document.getElementById('username-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('username').classList.remove('error');
            document.getElementById('username-error').classList.remove('show');
        }

        if (!password || password.length < 6) {
            document.getElementById('password').classList.add('error');
            document.getElementById('password-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('password').classList.remove('error');
            document.getElementById('password-error').classList.remove('show');
        }
    }

    if (step === 2) {
        const fullname = document.getElementById('fullname').value;
        const age = document.getElementById('age').value;

        // Fullname validation
        if (!fullname || fullname.trim() === '') {
            document.getElementById('fullname').classList.add('error');
            document.getElementById('fullname-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('fullname').classList.remove('error');
            document.getElementById('fullname-error').classList.remove('show');
        }

        // Age validation
        if (!age || parseInt(age) < 18) {
            document.getElementById('age').classList.add('error');
            document.getElementById('age-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('age').classList.remove('error');
            document.getElementById('age-error').classList.remove('show');
        }

    }

    if (step === 3) {
        const color = document.getElementById('color').value;

        if (!color) {
            document.getElementById('color').classList.add('error');
            document.getElementById('color-error').classList.add('show');
            isValid = false;
        } else {
            document.getElementById('color').classList.remove('error');
            document.getElementById('color-error').classList.remove('show');
        }
    }
    return isValid;
}