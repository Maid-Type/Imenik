"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const usersTable = document.getElementById('users');
const userModal = document.getElementById('userModal');
const editUserForm = document.getElementById('editUserForm');
const modalTitle = document.querySelector('.modal-content h2');
const closeBtn = document.querySelector('.close');
const cancelBtn = document.querySelector('.close-btn');
const submitBtn = document.querySelector('.submit');
const addBtn = document.querySelector('.btn-add');
const drzavaSelect = document.getElementById('drzavaSelect');
const gradSelect = document.getElementById('gradSelect');
let currentUserId = null;
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://localhost:7090/korisnici');
            const users = yield response.json();
            renderUsers(users);
        }
        catch (error) {
            console.error('Error fetching users:', error);
        }
    });
}
function renderUsers(users) {
    const headerRow = usersTable.rows[0];
    usersTable.innerHTML = '';
    usersTable.appendChild(headerRow);
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${user.ime}</td>
      <td>${user.prezime}</td>
      <td>${user.brojTelefona}</td>
      <td>${user.pol === 'Muški' ? "🔴 M" : "🔵 Ž"}</td>
      <td>${user.email}</td>
      <td>${user.grad}</td>
      <td>${user.drzava}</td>
      <td>${formatDate(user.datumRodjenja)}</td>
      <td>${user.starost}</td>
      <td class="actions">
        <button class="btn-edit" data-id="${user.id}">Edit</button>
        <button class="btn-delete" data-id="${user.id}">Delete</button>
      </td>
    `;
        usersTable.appendChild(row);
    });
}
function formatDate(dateString) {
    if (!dateString)
        return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}
function parseDate(dateString) {
    if (!dateString)
        return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}
usersTable.addEventListener('click', (event) => __awaiter(void 0, void 0, void 0, function* () {
    const target = event.target;
    if (target.classList.contains('btn-edit')) {
        const userId = target.dataset.id;
        if (userId) {
            currentUserId = parseInt(userId);
            yield openEditModal(currentUserId);
        }
    }
    if (target.classList.contains('btn-delete')) {
        const userId = target.dataset.id;
        if (userId && confirm('Are you sure you want to delete this user?')) {
            yield deleteUser(parseInt(userId));
        }
    }
}));
function deleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://localhost:7090/korisnici/${userId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                yield fetchUsers();
            }
            else {
                console.error('Failed to delete user');
            }
        }
        catch (error) {
            console.error('Error deleting user:', error);
        }
    });
}
function openEditModal(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            modalTitle.textContent = 'Uredi korisnika';
            yield fetchCountries();
            if (userId) {
                const response = yield fetch(`https://localhost:7090/korisnici/${userId}`);
                const user = yield response.json();
                editUserForm.ime.value = user.ime;
                editUserForm.prezime.value = user.prezime;
                editUserForm.brojTelefona.value = user.brojTelefona;
                // editUserForm.pol.value = user.pol;
                editUserForm.email.value = user.email;
                editUserForm.starost.value = user.starost.toString();
                editUserForm.datumRodjenja.value = parseDate(user.datumRodjenja);
                editUserForm.drzavaId.value = user.drzavaId.toString();
                yield loadCitiesForCountry(user.drzavaId, user.gradId);
            }
            userModal.style.display = 'flex';
        }
        catch (error) {
            console.error('Error opening edit modal:', error);
        }
    });
}
function openAddModal() {
    return __awaiter(this, void 0, void 0, function* () {
        modalTitle.textContent = 'Dodaj korisnika';
        currentUserId = null;
        editUserForm.reset();
        yield fetchCountries();
        gradSelect.innerHTML = '<option>Select a country first</option>';
        userModal.style.display = 'flex';
    });
}
function closeModal() {
    userModal.style.display = 'none';
    editUserForm.reset();
}
function fetchCountries() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://localhost:7090/drzave');
            const countries = yield response.json();
            drzavaSelect.innerHTML = '<option value="">Select a country</option>';
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.id.toString();
                option.textContent = country.naziv;
                drzavaSelect.appendChild(option);
            });
        }
        catch (error) {
            console.error('Error fetching countries:', error);
        }
    });
}
function loadCitiesForCountry(countryId_1) {
    return __awaiter(this, arguments, void 0, function* (countryId, selectedCityId = null) {
        if (!countryId) {
            gradSelect.innerHTML = '<option value="">Select a country first</option>';
            return;
        }
        try {
            const response = yield fetch(`https://localhost:7090/gradovi/${countryId}`);
            const cities = yield response.json();
            gradSelect.innerHTML = '<option value="">Select a city</option>';
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.id.toString();
                option.textContent = city.naziv;
                gradSelect.appendChild(option);
            });
            if (selectedCityId) {
                gradSelect.value = selectedCityId.toString();
            }
        }
        catch (error) {
            console.error('Error loading cities:', error);
        }
    });
}
function saveUser(userData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = currentUserId
                ? `https://localhost:7090/korisnici/${currentUserId}`
                : 'https://localhost:7090/korisnici';
            const method = currentUserId ? 'PUT' : 'POST';
            const response = yield fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (response.ok) {
                closeModal();
                yield fetchUsers();
            }
            else {
                console.error('Failed to save user');
            }
        }
        catch (error) {
            console.error('Error saving user:', error);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    fetchUsers();
    addBtn.addEventListener('click', openAddModal);
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    drzavaSelect.addEventListener('change', (e) => {
        const selectElement = e.target;
        loadCitiesForCountry(parseInt(selectElement.value));
    });
    editUserForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const formData = new FormData(editUserForm);
        const userData = {
            Ime: formData.get('ime'),
            Prezime: formData.get('prezime'),
            BrojTelefona: formData.get('brojTelefona'),
            Pol: formData.get('pol') === 'M' ? 'Muški' : 'Ženski',
            Email: formData.get('email'),
            DrzavaId: parseInt(formData.get('drzavaId')),
            GradId: parseInt(formData.get('gradId')),
            DatumRodjenja: new Date(formData.get('datumRodjenja')).toISOString(),
            Starost: parseInt(formData.get('starost'))
        };
        yield saveUser(userData);
    }));
    window.addEventListener('click', (e) => {
        if (e.target === userModal) {
            closeModal();
        }
    });
});
