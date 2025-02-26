interface User {
  id: number;
  ime: string;
  prezime: string;
  brojTelefona: string;
  pol: string;
  email: string;
  drzavaId: number;
  gradId: number;
  datumRodjenja: string;
  starost: number;
  grad?: {
    id: number;
    naziv: string;
  };
  drzava?: {
    id: number;
    naziv: string;
  };
}

interface Country {
  id: number;
  naziv: string;
}

interface City {
  id: number;
  naziv: string;
}

interface UserFormData {
  Ime: string;
  Prezime: string;
  BrojTelefona: string;
  Pol: string;
  Email: string;
  DrzavaId: number;
  GradId: number;
  DatumRodjenja: string;
  Starost: number;
}

const usersTable = document.getElementById('users') as HTMLTableElement;
const userModal = document.getElementById('userModal') as HTMLDivElement;
const editUserForm = document.getElementById('editUserForm') as HTMLFormElement;
const modalTitle = document.querySelector('.modal-content h2') as HTMLHeadingElement;
const closeBtn = document.querySelector('.close') as HTMLSpanElement;
const cancelBtn = document.querySelector('.close-btn') as HTMLButtonElement;
const submitBtn = document.querySelector('.submit') as HTMLButtonElement;
const addBtn = document.querySelector('.btn-add') as HTMLButtonElement;
const drzavaSelect = document.getElementById('drzavaSelect') as HTMLSelectElement;
const gradSelect = document.getElementById('gradSelect') as HTMLSelectElement;

let currentUserId: number | null = null;

async function fetchUsers(): Promise<void> {
  try {
    const response = await fetch('https://localhost:7090/korisnici');
    const users: User[] = await response.json();
    renderUsers(users);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

function renderUsers(users: User[]): void {
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

function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function parseDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

usersTable.addEventListener('click', async (event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains('btn-edit')) {
    const userId = target.dataset.id;
    if (userId) {
      currentUserId = parseInt(userId);
      await openEditModal(currentUserId);
    }
  }

  if (target.classList.contains('btn-delete')) {
    const userId = target.dataset.id;
    if (userId && confirm('Are you sure you want to delete this user?')) {
      await deleteUser(parseInt(userId));
    }
  }
});

async function deleteUser(userId: number): Promise<void> {
  try {
    const response = await fetch(`https://localhost:7090/korisnici/${userId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await fetchUsers();
    } else {
      console.error('Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}

async function openEditModal(userId: number | null): Promise<void> {
  try {
    modalTitle.textContent = 'Uredi korisnika';

    await fetchCountries();

    if (userId) {
      const response = await fetch(`https://localhost:7090/korisnici/${userId}`);
      const user: User = await response.json();

      editUserForm.ime.value = user.ime;
      editUserForm.prezime.value = user.prezime;
      editUserForm.brojTelefona.value = user.brojTelefona;
      // editUserForm.pol.value = user.pol;
      editUserForm.email.value = user.email;
      editUserForm.starost.value = user.starost.toString();
      editUserForm.datumRodjenja.value = parseDate(user.datumRodjenja);
      editUserForm.drzavaId.value = user.drzavaId.toString();
      await loadCitiesForCountry(user.drzavaId, user.gradId);
    }

    userModal.style.display = 'flex';
  } catch (error) {
    console.error('Error opening edit modal:', error);
  }
}

async function openAddModal(): Promise<void> {
  modalTitle.textContent = 'Dodaj korisnika';
  currentUserId = null;

  editUserForm.reset();

  await fetchCountries();

  gradSelect.innerHTML = '<option>Select a country first</option>';

  userModal.style.display = 'flex';
}

function closeModal(): void {
  userModal.style.display = 'none';
  editUserForm.reset();
}

async function fetchCountries(): Promise<void> {
  try {
    const response = await fetch('https://localhost:7090/drzave');
    const countries: Country[] = await response.json();

    drzavaSelect.innerHTML = '<option value="">Select a country</option>';

    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.id.toString();
      option.textContent = country.naziv;
      drzavaSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

async function loadCitiesForCountry(countryId: number, selectedCityId: number | null = null): Promise<void> {
  if (!countryId) {
    gradSelect.innerHTML = '<option value="">Select a country first</option>';
    return;
  }

  try {
    const response = await fetch(`https://localhost:7090/gradovi/${countryId}`);
    const cities: City[] = await response.json();

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
  } catch (error) {
    console.error('Error loading cities:', error);
  }
}

async function saveUser(userData: UserFormData): Promise<void> {
  try {
    const url = currentUserId
      ? `https://localhost:7090/korisnici/${currentUserId}`
      : 'https://localhost:7090/korisnici';

    const method = currentUserId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      closeModal();
      await fetchUsers();
    } else {
      console.error('Failed to save user');
    }
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();

  addBtn.addEventListener('click', openAddModal);

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  drzavaSelect.addEventListener('change', (e) => {
    const selectElement = e.target as HTMLSelectElement;
    loadCitiesForCountry(parseInt(selectElement.value));
  });

  editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(editUserForm);

    const userData: UserFormData = {
      Ime: formData.get('ime') as string,
      Prezime: formData.get('prezime') as string,
      BrojTelefona: formData.get('brojTelefona') as string,
      Pol: (formData.get('pol') as string) === 'M' ? 'Muški' : 'Ženski',
      Email: formData.get('email') as string,
      DrzavaId: parseInt(formData.get('drzavaId') as string),
      GradId: parseInt(formData.get('gradId') as string),
      DatumRodjenja: new Date(formData.get('datumRodjenja') as string).toISOString(),
      Starost: parseInt(formData.get('starost') as string)
    };

    await saveUser(userData);
  });

  window.addEventListener('click', (e) => {
    if (e.target === userModal) {
      closeModal();
    }
  });
});
