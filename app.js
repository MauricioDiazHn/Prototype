
document.addEventListener('DOMContentLoaded', () => {
    // --- DATABASE INITIALIZATION ---
    const DB = {
        init: function () {
            this.initData('employees');
            this.initData('incomeCategories');
            this.initData('expenseCategories');
            this.initData('transactions');
        },
        initData: function (key) {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(this.getDefaults(key)));
            }
        },
        getDefaults: function (key) {
            const defaults = {
                employees: [
                    { id: 1, name: 'Ana García', position: 'Especialista en Uñas' },
                    { id: 2, name: 'Maria López', position: 'Estilista de Cabello' },
                    { id: 3, name: 'Sofia Mendez', position: 'Manicurista' }
                ],
                incomeCategories: [
                    { id: 1, name: 'Manicura Clásica', price: 350, description: 'Servicio Uñas', color: 'blue' },
                    { id: 2, name: 'Corte de Cabello', price: 250, description: 'Servicio Cabello', color: 'purple' },
                    { id: 3, name: 'Facial Hidratante', price: 600, description: 'Tratamientos Faciales', color: 'pink' }
                ],
                expenseCategories: [
                    { id: 1, name: 'Renta del Local', amount: 8000, recurring: true, description: 'Pago mensual del local', color: 'yellow' },
                    { id: 2, name: 'Suministros', amount: null, recurring: false, description: 'Compras de productos', color: 'orange' },
                    { id: 3, name: 'Luz y Agua', amount: 1500, recurring: true, description: 'Servicios públicos', color: 'sky' },
                    { id: 4, name: 'Salarios', amount: null, recurring: true, description: 'Pago de salarios', color: 'indigo' }
                ],
                transactions: [
                    { id: 1, type: 'income', description: 'Uñas Acrílicas + Diseño', amount: 800, categoryId: 1, employeeId: 1, date: '2025-08-02' },
                    { id: 2, type: 'expense', description: 'Pago de Alquiler del Local', amount: 8000, categoryId: 1, date: '2025-08-01' },
                    { id: 3, type: 'income', description: 'Tinte Completo y Corte', amount: 1500, categoryId: 2, employeeId: 2, date: '2025-08-01' },
                    { id: 4, type: 'expense', description: 'Compra de Esmaltes y Acetona', amount: 1200, categoryId: 2, date: '2025-07-31' },
                    { id: 5, type: 'income', description: 'Manicura Clásica', amount: 500, categoryId: 1, employeeId: 3, date: '2025-07-31' }
                ]
            };
            return defaults[key] || [];
        },
        get: function (key) {
            return JSON.parse(localStorage.getItem(key) || '[]');
        },
        set: function (key, data) {
            localStorage.setItem(key, JSON.stringify(data));
        },
        add: function (key, item) {
            const data = this.get(key);
            item.id = new Date().getTime(); // Simple unique ID
            data.push(item);
            this.set(key, data);
        },

        update: function (key, id, updatedItem) {
            const data = this.get(key);
            const index = data.findIndex(item => item.id === id);
            if (index !== -1) {
                // Mantener el ID original
                updatedItem.id = id;
                data[index] = updatedItem;
                this.set(key, data);
                return true;
            }
            return false;
        },

        delete: function (key, id) {
            const data = this.get(key);
            const newData = data.filter(item => item.id !== id);
            if (newData.length !== data.length) {
                this.set(key, newData);
                return true;
            }
            return false;
        }
    };

    DB.init();

    // --- UI RENDERING ---
    const UI = {
        renderAll: function () {
            this.renderEmployees();
            this.renderIncomeCategories();
            this.renderExpenseCategories();
            this.renderTransactionHistory();
            this.renderDashboard();
            this.populateSelects();
        },

        renderEmployees: function () {
            const employees = DB.get('employees');
            const container = document.querySelector('#settings #add-employee-btn').closest('.rounded-2xl').querySelector('.space-y-4');
            container.innerHTML = employees.map(emp => `
                <div class="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                    <div class="flex items-center">
                        <div class="bg-pink-500/20 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                            <span class="text-pink-300 font-bold">${emp.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h4 class="font-semibold">${emp.name}</h4>
                            <p class="text-sm text-white/60">${emp.position}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="edit-employee text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10" data-id="${emp.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button class="delete-employee text-white/70 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/10" data-id="${emp.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        },

        renderIncomeCategories: function () {
            const categories = DB.get('incomeCategories');
            const container = document.querySelector('#settings #add-income-category-btn').closest('.rounded-2xl').querySelector('.space-y-3');
            container.innerHTML = categories.map(cat => `
                <div class="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                    <div class="flex items-center">
                         <div class="bg-${cat.color}-500/20 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                            <span class="text-${cat.color}-300 font-bold text-sm">${cat.name.charAt(0)}</span>
                        </div>
                        <div>
                            <span class="font-medium">${cat.name}</span>
                            <p class="text-xs text-white/50 mt-0.5">L ${cat.price} · ${cat.description}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="edit-income-category text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10" data-id="${cat.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button class="delete-income-category text-white/70 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/10" data-id="${cat.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        },

        renderExpenseCategories: function () {
            const categories = DB.get('expenseCategories');
            const container = document.querySelector('#settings #add-expense-category-btn').closest('.rounded-2xl').querySelector('.space-y-3');
            container.innerHTML = categories.map(cat => `
                <div class="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                    <div class="flex items-center">
                        <div class="bg-${cat.color}-500/20 h-8 w-8 rounded-full flex items-center justify-center mr-3">
                            <span class="text-${cat.color}-300 font-bold text-sm">${cat.name.charAt(0)}</span>
                        </div>
                        <div>
                             <div class="flex items-center">
                                <span class="font-medium">${cat.name}</span>
                                ${cat.recurring ? '<span class="ml-2 text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-md">Recurrente</span>' : ''}
                            </div>
                            <p class="text-xs text-white/50 mt-0.5">${cat.description}</p>
                        </div>
                    </div>
                    <div class="flex space-x-2">
                        <button class="edit-expense-category text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10" data-id="${cat.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                        <button class="delete-expense-category text-white/70 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/10" data-id="${cat.id}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        },

        renderTransactionHistory: function () {
            const transactions = DB.get('transactions').sort((a, b) => new Date(b.date) - new Date(a.date));
            const tableContainer = document.querySelector('#finances table');

            if (!tableContainer) {
                console.error("No se encontró la tabla de transacciones");
                return;
            }

            const employees = DB.get('employees');
            const incomeCategories = DB.get('incomeCategories');
            const expenseCategories = DB.get('expenseCategories');

            // Limpiar el contenido de la tabla antes de renderizar
            tableContainer.innerHTML = `
                <thead>
                    <tr class="border-b border-white/10 text-sm text-white/60">
                        <th class="p-4 font-semibold">Fecha</th>
                        <th class="p-4 font-semibold">Descripción</th>
                        <th class="p-4 font-semibold">Categoría</th>
                        <th class="p-4 font-semibold">Empleada</th>
                        <th class="p-4 font-semibold text-right">Monto</th>
                        <th class="p-4 font-semibold text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;

            // Obtener o crear el cuerpo de la tabla
            let container = tableContainer.querySelector('tbody');
            if (!container) {
                container = document.createElement('tbody');
                tableContainer.appendChild(container);
            }

            container.innerHTML = transactions.map(tx => {
                const isIncome = tx.type === 'income';
                let categoryName = 'N/A';
                let categoryColor = 'gray';

                if (isIncome) {
                    const cat = incomeCategories.find(c => c.id === tx.categoryId);
                    if (cat) {
                        categoryName = cat.description || cat.name;
                        categoryColor = cat.color || 'blue';
                    }
                } else {
                    const cat = expenseCategories.find(c => c.id === tx.categoryId);
                    if (cat) {
                        categoryName = cat.description || cat.name;
                        categoryColor = cat.color || 'red';
                    }
                }

                const employeeName = isIncome ? (employees.find(e => e.id === tx.employeeId)?.name || 'N/A') : 'N/A';
                const date = new Date(tx.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });

                return `
                    <tr class="hover:bg-white/5 transition-colors">
                        <td class="p-4">${date}</td>
                        <td class="p-4">${tx.description}</td>
                        <td class="p-4"><span class="bg-${categoryColor}-500/20 text-${categoryColor}-300 text-xs font-semibold px-2.5 py-1 rounded-full">${categoryName}</span></td>
                        <td class="p-4 ${isIncome ? '' : 'text-white/50'}">${employeeName}</td>
                        <td class="p-4 text-right font-semibold ${isIncome ? 'text-green-400' : 'text-red-400'}">
                            ${isIncome ? '+' : '-'} L ${tx.amount.toFixed(2)}
                        </td>
                        <td class="p-4 text-center">
                            <div class="flex items-center justify-center space-x-2">
                                <button class="delete-transaction text-white/70 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/10" data-id="${tx.id}" data-type="${tx.type}">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');

            // Si no hay transacciones, mostrar un mensaje
            if (transactions.length === 0) {
                container.innerHTML = `
                    <tr>
                        <td colspan="5" class="p-6 text-center text-white/50">No hay transacciones registradas</td>
                    </tr>
                `;
            }
        },

        renderDashboard: function () {
            const transactions = DB.get('transactions');
            const today = new Date().toISOString().split('T')[0];

            // Calcular ingresos y gastos del día
            const todayIncome = transactions
                .filter(t => t.type === 'income' && t.date === today)
                .reduce((sum, t) => sum + t.amount, 0);

            const todayExpense = transactions
                .filter(t => t.type === 'expense' && t.date === today)
                .reduce((sum, t) => sum + t.amount, 0);

            // Actualizar dashboard con los valores de hoy
            document.querySelector('#dashboard .rounded-2xl:nth-child(2) .text-4xl.font-bold.mt-2').textContent = `L ${todayIncome.toFixed(2)}`;
            document.querySelector('#dashboard .rounded-2xl:nth-child(3) .text-4xl').textContent = `L ${todayExpense.toFixed(2)}`;

            // Actualizar las transacciones recientes en el dashboard
            const recentTransactionsContainer = document.querySelector('#dashboard .lg\\:col-span-2.rounded-2xl .space-y-2');
            // Ordenar transacciones por fecha (más recientes primero)
            const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
            recentTransactionsContainer.innerHTML = sortedTransactions.slice(0, 3).map(tx => `
                 <div class="flex justify-between p-3 hover:bg-white/10 rounded-lg transition-colors">
                    <span>${tx.description}</span>
                    <span class="${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}">
                        ${tx.type === 'income' ? '+' : '-'} L ${tx.amount.toFixed(2)}
                    </span>
                </div>
            `).join('');

            // Calcular y mostrar totales financieros para la sección de Finanzas
            this.updateFinancialsData();
        },

        // Función para calcular y mostrar los totales financieros
        updateFinancialsData: function () {
            const transactions = DB.get('transactions');
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            // Filtrar transacciones del mes actual
            const monthTransactions = transactions.filter(tx => {
                const txDate = new Date(tx.date);
                return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
            });

            // Calcular ingresos totales del mes
            const monthlyIncome = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            // Calcular gastos totales del mes
            const monthlyExpense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            // Calcular ganancia neta
            const netIncome = monthlyIncome - monthlyExpense;

            // Actualizar la UI con estos datos
            const totalIncomeElement = document.getElementById('total-income');
            const totalExpenseElement = document.getElementById('total-expense');
            const netIncomeElement = document.getElementById('net-income');

            if (totalIncomeElement) totalIncomeElement.textContent = `L ${monthlyIncome.toFixed(2)}`;
            if (totalExpenseElement) totalExpenseElement.textContent = `L ${monthlyExpense.toFixed(2)}`;
            if (netIncomeElement) {
                const textColor = netIncome >= 0 ? 'text-green-400' : 'text-red-400';
                netIncomeElement.textContent = `L ${netIncome.toFixed(2)}`;
                netIncomeElement.className = `text-3xl font-bold mt-2 ${textColor}`;
            }

            // Actualizar también los datos en la sección de reportes
            const reportNetIncomeElement = document.querySelector('#reports .text-5xl.font-bold.mt-2.text-white');
            if (reportNetIncomeElement) {
                reportNetIncomeElement.textContent = `L ${netIncome.toFixed(2)}`;
            }

            // Actualizar el gráfico de gastos por categoría
            this.updateExpenseCategoriesChart();

            // Actualizar gráficos con datos reales si es posible
            this.updateCharts(monthTransactions);
        },

        // Variables para mantener referencias a los gráficos
        monthlyChart: null,
        reportsChart: null,

        // Función para actualizar el gráfico de gastos por categoría
        updateExpenseCategoriesChart: function () {
            const expenseCategoriesContainer = document.getElementById('expense-categories-chart');
            if (!expenseCategoriesContainer) return;

            // Obtener categorías de gastos y transacciones
            const expenseCategories = DB.get('expenseCategories');
            const transactions = DB.get('transactions');
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();

            // Filtrar transacciones del mes actual que sean gastos
            const monthExpenses = transactions.filter(tx => {
                const txDate = new Date(tx.date);
                return tx.type === 'expense' &&
                    txDate.getMonth() === currentMonth &&
                    txDate.getFullYear() === currentYear;
            });

            // Calcular el total de gastos del mes
            const totalExpenses = monthExpenses.reduce((sum, tx) => sum + tx.amount, 0);

            // Calcular gastos por categoría
            const expensesByCategory = {};
            monthExpenses.forEach(expense => {
                const categoryId = expense.categoryId;
                if (categoryId) {
                    if (!expensesByCategory[categoryId]) {
                        expensesByCategory[categoryId] = 0;
                    }
                    expensesByCategory[categoryId] += expense.amount;
                }
            });

            // Generar HTML para cada categoría
            let html = '';
            expenseCategories.forEach(category => {
                const amount = expensesByCategory[category.id] || 0;
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;

                html += `
                <div>
                    <div class="flex justify-between text-sm mb-1">
                        <span>${category.name}</span>
                        <span>L ${amount.toFixed(2)}</span>
                    </div>
                    <div class="w-full bg-slate-700 rounded-full h-2.5">
                        <div class="bg-${category.color}-400 h-2.5 rounded-full" style="width: ${percentage}%"></div>
                    </div>
                </div>`;
            });

            // Si no hay categorías de gastos, mostrar mensaje
            if (expenseCategories.length === 0) {
                html = '<p class="text-center text-white/60">No hay categorías de gastos definidas</p>';
            }

            // Actualizar el contenedor
            expenseCategoriesContainer.innerHTML = html;
        },

        updateCharts: function (monthTransactions) {
            try {
                // Organizar transacciones por semana
                const weeks = [
                    monthTransactions.filter(tx => new Date(tx.date).getDate() <= 7),
                    monthTransactions.filter(tx => new Date(tx.date).getDate() > 7 && new Date(tx.date).getDate() <= 14),
                    monthTransactions.filter(tx => new Date(tx.date).getDate() > 14 && new Date(tx.date).getDate() <= 21),
                    monthTransactions.filter(tx => new Date(tx.date).getDate() > 21)
                ];

                // Calcular ingresos y gastos por semana
                const weeklyIncomes = weeks.map(week =>
                    week.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0)
                );

                const weeklyExpenses = weeks.map(week =>
                    week.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0)
                );

                // Actualizar el gráfico del dashboard si existe
                const monthlyChartCtx = document.getElementById('monthlyChart');
                if (monthlyChartCtx && monthlyChartCtx.chart) {
                    monthlyChartCtx.chart.data.datasets[0].data = weeklyIncomes;
                    monthlyChartCtx.chart.data.datasets[1].data = weeklyExpenses;
                    monthlyChartCtx.chart.update();
                }

                // Actualizar el gráfico de reportes si existe
                const reportsChartCtx = document.getElementById('gananciasChart');
                if (reportsChartCtx && reportsChartCtx.chart) {
                    reportsChartCtx.chart.data.datasets[0].data = weeklyIncomes;
                    reportsChartCtx.chart.data.datasets[1].data = weeklyExpenses;
                    reportsChartCtx.chart.update();
                }
            } catch (e) {
                console.error("Error al actualizar gráficos:", e);
            }
        },

        populateSelects: function () {
            const incomeCategories = DB.get('incomeCategories');
            const expenseCategories = DB.get('expenseCategories');
            const employees = DB.get('employees');

            const saleServiceSelect = document.getElementById('sale-service');
            saleServiceSelect.innerHTML = incomeCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('') + '<option value="other">Otro</option>';

            const saleEmployeeSelect = document.getElementById('sale-employee');
            saleEmployeeSelect.innerHTML = employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('');

            const expenseCategorySelect = document.getElementById('expense-category');
            expenseCategorySelect.innerHTML = expenseCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('') + '<option value="other">Otro</option>';
        }
    };

    // --- EVENT LISTENERS ---
    const App = {
        init: function () {
            this.setupNavigation();
            this.setupModals();
            this.setupForms();
            UI.renderAll();
            this.setupCharts();
            // Configurar los botones de editar/eliminar
            this.setupItemActions();
            // Intentar restaurar la página en la que estaba el usuario
            this.restorePageState();
        },

        // Función para guardar y restaurar el estado de navegación
        savePageState: function (pageId) {
            localStorage.setItem('currentPage', pageId);
        },

        restorePageState: function () {
            const savedPage = localStorage.getItem('currentPage');
            if (savedPage) {
                const pages = document.querySelectorAll('.page-content');
                const navLinks = document.querySelectorAll('.nav-link');

                // Ocultar todas las páginas
                pages.forEach(page => page.classList.add('hidden'));

                // Mostrar la página guardada
                const activePage = document.getElementById(savedPage);
                if (activePage) activePage.classList.remove('hidden');

                // Actualizar la navegación
                navLinks.forEach(navLink => {
                    navLink.classList.remove('bg-pink-500/20');
                    navLink.classList.add('hover:bg-white/10');

                    const pageId = navLink.getAttribute('href').substring(1);
                    if (pageId === savedPage) {
                        navLink.classList.add('bg-pink-500/20');
                        navLink.classList.remove('hover:bg-white/10');
                    }
                });
            }
        },

        setupNavigation: function () {
            const navLinks = document.querySelectorAll('.nav-link');
            const pages = document.querySelectorAll('.page-content');

            const showPage = (pageId) => {
                pages.forEach(page => page.classList.add('hidden'));
                const activePage = document.getElementById(pageId);
                if (activePage) activePage.classList.remove('hidden');

                // Guardar el estado de la página en localStorage
                this.savePageState(pageId);
            };

            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pageId = link.getAttribute('href').substring(1);

                    navLinks.forEach(navLink => {
                        navLink.classList.remove('bg-pink-500/20');
                        navLink.classList.add('hover:bg-white/10');
                    });
                    link.classList.add('bg-pink-500/20');
                    link.classList.remove('hover:bg-white/10');

                    showPage(pageId);
                });
            });

            // Si no hay página guardada, mostrar el dashboard
            if (!localStorage.getItem('currentPage')) {
                showPage('dashboard');
            }
        },

        setupModals: function () {
            const modals = [
                { trigger: 'trigger-sale-modal', modal: 'sale-modal', close: ['close-sale-modal-btn', 'cancel-sale-btn'] },
                { trigger: 'trigger-expense-modal', modal: 'expense-modal', close: ['close-expense-modal-btn', 'cancel-expense-btn'] },
                { trigger: 'add-employee-btn', modal: 'employee-modal', close: ['close-employee-modal-btn', 'cancel-employee-btn'] },
                { trigger: 'add-income-category-btn', modal: 'income-category-modal', close: ['close-income-category-modal-btn', 'cancel-income-category-btn'] },
                { trigger: 'add-expense-category-btn', modal: 'expense-category-modal', close: ['close-expense-category-modal-btn', 'cancel-expense-category-btn'] }
            ];

            modals.forEach(({ trigger, modal, close }) => {
                const modalEl = document.getElementById(modal);
                document.getElementById(trigger).addEventListener('click', () => modalEl.classList.remove('modal-hidden'));
                close.forEach(btnId => {
                    document.getElementById(btnId).addEventListener('click', () => modalEl.classList.add('modal-hidden'));
                });
            });

            // Configurar los modales de confirmación de éxito
            const successModals = [
                { modal: 'success-sale-modal', close: 'close-sale-success-btn' },
                { modal: 'success-expense-modal', close: 'close-expense-success-btn' }
            ];

            successModals.forEach(({ modal, close }) => {
                const modalEl = document.getElementById(modal);
                const closeBtn = document.getElementById(close);
                closeBtn.addEventListener('click', () => {
                    modalEl.classList.add('modal-hidden');
                    // Restaurar a la página en la que estaba el usuario
                    this.restorePageState();
                });
            });

            // Configurar modales de edición
            const editModals = [
                { modal: 'edit-employee-modal', close: ['close-edit-employee-modal-btn', 'cancel-edit-employee-btn'] },
                { modal: 'edit-income-category-modal', close: ['close-edit-income-category-modal-btn', 'cancel-edit-income-category-btn'] },
                { modal: 'edit-expense-category-modal', close: ['close-edit-expense-category-modal-btn', 'cancel-edit-expense-category-btn'] },
                { modal: 'edit-transaction-modal', close: ['close-edit-transaction-modal-btn', 'cancel-edit-transaction-btn'] },
                { modal: 'delete-confirmation-modal', close: ['cancel-delete-btn'] }
            ];

            editModals.forEach(({ modal, close }) => {
                const modalEl = document.getElementById(modal);
                close.forEach(btnId => {
                    document.getElementById(btnId).addEventListener('click', () => modalEl.classList.add('modal-hidden'));
                });
            });

            // Configurar el botón de confirmar eliminación
            document.getElementById('confirm-delete-btn').addEventListener('click', () => {
                const itemId = parseInt(document.getElementById('delete-item-id').value);
                const itemType = document.getElementById('delete-item-type').value;

                if (itemId && itemType) {
                    switch (itemType) {
                        case 'employee':
                            DB.delete('employees', itemId);
                            UI.renderEmployees();
                            UI.populateSelects();
                            break;
                        case 'incomeCategory':
                            DB.delete('incomeCategories', itemId);
                            UI.renderIncomeCategories();
                            UI.populateSelects();
                            break;
                        case 'expenseCategory':
                            DB.delete('expenseCategories', itemId);
                            UI.renderExpenseCategories();
                            UI.populateSelects();
                            break;
                        case 'transaction':
                            DB.delete('transactions', itemId);
                            UI.renderTransactionHistory();
                            UI.renderDashboard();
                            break;
                    }
                }

                document.getElementById('delete-confirmation-modal').classList.add('modal-hidden');
            });
        },

        setupForms: function () {
            // Add Employee
            document.querySelector('#employee-modal form').addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('employee-name').value;
                const position = document.getElementById('employee-position').value;
                if (name && position) {
                    DB.add('employees', { name, position });
                    UI.renderEmployees();
                    UI.populateSelects();
                    document.getElementById('employee-modal').classList.add('modal-hidden');
                    e.target.reset();

                    // Mantenernos en la sección de configuración
                    const settingsPage = document.getElementById('settings');
                    if (settingsPage && settingsPage.classList.contains('hidden')) {
                        const pages = document.querySelectorAll('.page-content');
                        pages.forEach(page => page.classList.add('hidden'));
                        settingsPage.classList.remove('hidden');
                    }
                }
            });

            // Add Income Category (Service)
            document.querySelector('#income-category-modal form').addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('income-category-name').value;
                const price = parseFloat(document.getElementById('service-price').value);
                const description = document.getElementById('service-description').value;
                const color = document.getElementById('service-color').value;

                if (name && price && description && color) {
                    DB.add('incomeCategories', {
                        name,
                        price,
                        description,
                        color
                    });
                    UI.renderIncomeCategories();
                    UI.populateSelects();
                    document.getElementById('income-category-modal').classList.add('modal-hidden');
                    e.target.reset();

                    // Mantenernos en la sección de configuración
                    const settingsPage = document.getElementById('settings');
                    if (settingsPage && settingsPage.classList.contains('hidden')) {
                        const pages = document.querySelectorAll('.page-content');
                        pages.forEach(page => page.classList.add('hidden'));
                        settingsPage.classList.remove('hidden');
                    }
                }
            });

            // Add Expense Category
            document.querySelector('#expense-category-modal form').addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('expense-category-name').value;
                const description = document.getElementById('expense-description').value;
                const amount = document.getElementById('expense-fixed-amount').value
                    ? parseFloat(document.getElementById('expense-fixed-amount').value)
                    : null;
                const recurring = document.getElementById('expense-recurring').checked;
                const color = document.getElementById('expense-color').value;

                if (name && description && color) {
                    DB.add('expenseCategories', {
                        name,
                        description,
                        amount,
                        recurring,
                        color
                    });
                    UI.renderExpenseCategories();
                    UI.populateSelects();
                    document.getElementById('expense-category-modal').classList.add('modal-hidden');
                    e.target.reset();

                    // Mantenernos en la sección de configuración
                    const settingsPage = document.getElementById('settings');
                    if (settingsPage && settingsPage.classList.contains('hidden')) {
                        const pages = document.querySelectorAll('.page-content');
                        pages.forEach(page => page.classList.add('hidden'));
                        settingsPage.classList.remove('hidden');
                    }
                }
            });

            // Add Sale
            document.querySelector('#sale-modal form').addEventListener('submit', e => {
                e.preventDefault();

                // Guardar la página actual antes de procesar el formulario
                const currentPage = localStorage.getItem('currentPage') || 'daily-log';

                const serviceSelect = document.getElementById('sale-service');
                // Verificar si el valor seleccionado es válido
                const categoryId = serviceSelect.value !== 'other' ?
                    parseInt(serviceSelect.value) : null;

                const newSale = {
                    type: 'income',
                    description: serviceSelect.options[serviceSelect.selectedIndex].text,
                    amount: parseFloat(document.getElementById('sale-amount').value),
                    categoryId: categoryId,
                    employeeId: parseInt(document.getElementById('sale-employee').value),
                    date: new Date().toISOString().split('T')[0]
                };

                DB.add('transactions', newSale);
                UI.renderAll();
                document.getElementById('sale-modal').classList.add('modal-hidden');
                e.target.reset();

                // Mostrar el modal de confirmación de éxito
                document.getElementById('success-sale-modal').classList.remove('modal-hidden');

                // Configurar el cierre del modal de confirmación después de un tiempo
                setTimeout(() => {
                    // Restaurar a la página en la que estaba el usuario
                    this.restorePageState();
                }, 1000);
            });            // Add Expense
            document.querySelector('#expense-modal form').addEventListener('submit', e => {
                e.preventDefault();

                // Guardar la página actual antes de procesar el formulario
                const currentPage = localStorage.getItem('currentPage') || 'daily-log';

                const expenseCategorySelect = document.getElementById('expense-category');
                // Verificar si el valor seleccionado es válido
                const categoryId = expenseCategorySelect.value !== 'other' ?
                    parseInt(expenseCategorySelect.value) : null;

                const newExpense = {
                    type: 'expense',
                    description: document.getElementById('expense-description').value,
                    amount: parseFloat(document.getElementById('expense-amount').value),
                    categoryId: categoryId,
                    date: new Date().toISOString().split('T')[0]
                };

                DB.add('transactions', newExpense);
                UI.renderAll();
                document.getElementById('expense-modal').classList.add('modal-hidden');
                e.target.reset();

                // Mostrar el modal de confirmación de éxito
                document.getElementById('success-expense-modal').classList.remove('modal-hidden');

                // Configurar el cierre del modal de confirmación después de un tiempo
                setTimeout(() => {
                    // Restaurar a la página en la que estaba el usuario
                    this.restorePageState();
                }, 1000);
            });
        },

        setupItemActions: function () {
            // Delegación de eventos para manejar clics en botones de editar/eliminar
            document.addEventListener('click', (e) => {
                // Botones para eliminar empleados
                if (e.target.closest('.delete-employee')) {
                    const button = e.target.closest('.delete-employee');
                    const id = parseInt(button.dataset.id);

                    document.getElementById('delete-item-id').value = id;
                    document.getElementById('delete-item-type').value = 'employee';
                    document.getElementById('delete-confirmation-modal').classList.remove('modal-hidden');
                }

                // Botones para eliminar categorías de ingresos
                else if (e.target.closest('.delete-income-category')) {
                    const button = e.target.closest('.delete-income-category');
                    const id = parseInt(button.dataset.id);

                    document.getElementById('delete-item-id').value = id;
                    document.getElementById('delete-item-type').value = 'incomeCategory';
                    document.getElementById('delete-confirmation-modal').classList.remove('modal-hidden');
                }

                // Botones para eliminar categorías de gastos
                else if (e.target.closest('.delete-expense-category')) {
                    const button = e.target.closest('.delete-expense-category');
                    const id = parseInt(button.dataset.id);

                    document.getElementById('delete-item-id').value = id;
                    document.getElementById('delete-item-type').value = 'expenseCategory';
                    document.getElementById('delete-confirmation-modal').classList.remove('modal-hidden');
                }

                // Botones para eliminar transacciones
                else if (e.target.closest('.delete-transaction')) {
                    const button = e.target.closest('.delete-transaction');
                    const id = parseInt(button.dataset.id);

                    document.getElementById('delete-item-id').value = id;
                    document.getElementById('delete-item-type').value = 'transaction';
                    document.getElementById('delete-confirmation-modal').classList.remove('modal-hidden');
                }

                // Botones para editar empleados
                else if (e.target.closest('.edit-employee')) {
                    const button = e.target.closest('.edit-employee');
                    const id = parseInt(button.dataset.id);
                    const employee = DB.get('employees').find(emp => emp.id === id);

                    if (employee) {
                        document.getElementById('edit-employee-id').value = id;
                        document.getElementById('edit-employee-name').value = employee.name;
                        document.getElementById('edit-employee-position').value = employee.position;

                        document.getElementById('edit-employee-modal').classList.remove('modal-hidden');

                        // Configurar el formulario para actualizar el empleado
                        document.getElementById('edit-employee-form').onsubmit = (e) => {
                            e.preventDefault();
                            const name = document.getElementById('edit-employee-name').value;
                            const position = document.getElementById('edit-employee-position').value;

                            if (name && position) {
                                DB.update('employees', id, { name, position });
                                UI.renderEmployees();
                                UI.populateSelects();
                                document.getElementById('edit-employee-modal').classList.add('modal-hidden');
                            }
                        };
                    }
                }

                // Botones para editar categorías de ingresos
                else if (e.target.closest('.edit-income-category')) {
                    const button = e.target.closest('.edit-income-category');
                    const id = parseInt(button.dataset.id);
                    const category = DB.get('incomeCategories').find(cat => cat.id === id);

                    if (category) {
                        document.getElementById('edit-income-category-id').value = id;
                        document.getElementById('edit-income-category-name').value = category.name;
                        document.getElementById('edit-service-price').value = category.price;
                        document.getElementById('edit-service-description').value = category.description;
                        document.getElementById('edit-service-color').value = category.color;

                        document.getElementById('edit-income-category-modal').classList.remove('modal-hidden');

                        // Configurar el formulario para actualizar la categoría
                        document.getElementById('edit-income-category-form').onsubmit = (e) => {
                            e.preventDefault();
                            const name = document.getElementById('edit-income-category-name').value;
                            const price = parseFloat(document.getElementById('edit-service-price').value);
                            const description = document.getElementById('edit-service-description').value;
                            const color = document.getElementById('edit-service-color').value;

                            if (name && price && description && color) {
                                DB.update('incomeCategories', id, { name, price, description, color });
                                UI.renderIncomeCategories();
                                UI.populateSelects();
                                document.getElementById('edit-income-category-modal').classList.add('modal-hidden');
                            }
                        };
                    }
                }

                // Botones para editar categorías de gastos
                else if (e.target.closest('.edit-expense-category')) {
                    const button = e.target.closest('.edit-expense-category');
                    const id = parseInt(button.dataset.id);
                    const category = DB.get('expenseCategories').find(cat => cat.id === id);

                    if (category) {
                        document.getElementById('edit-expense-category-id').value = id;
                        document.getElementById('edit-expense-category-name').value = category.name;
                        document.getElementById('edit-expense-description').value = category.description;
                        document.getElementById('edit-expense-fixed-amount').value = category.amount || '';
                        document.getElementById('edit-expense-recurring').checked = category.recurring;
                        document.getElementById('edit-expense-color').value = category.color;

                        document.getElementById('edit-expense-category-modal').classList.remove('modal-hidden');

                        // Configurar el formulario para actualizar la categoría
                        document.getElementById('edit-expense-category-form').onsubmit = (e) => {
                            e.preventDefault();
                            const name = document.getElementById('edit-expense-category-name').value;
                            const description = document.getElementById('edit-expense-description').value;
                            const amount = document.getElementById('edit-expense-fixed-amount').value
                                ? parseFloat(document.getElementById('edit-expense-fixed-amount').value)
                                : null;
                            const recurring = document.getElementById('edit-expense-recurring').checked;
                            const color = document.getElementById('edit-expense-color').value;

                            if (name && description && color) {
                                DB.update('expenseCategories', id, { name, description, amount, recurring, color });
                                UI.renderExpenseCategories();
                                UI.populateSelects();
                                document.getElementById('edit-expense-category-modal').classList.add('modal-hidden');
                            }
                        };
                    }
                }

                // Botones para editar transacciones
                else if (e.target.closest('.edit-transaction')) {
                    const button = e.target.closest('.edit-transaction');
                    const id = parseInt(button.dataset.id);
                    const type = button.dataset.type;
                    const transaction = DB.get('transactions').find(tx => tx.id === id);

                    if (transaction) {
                        document.getElementById('edit-transaction-id').value = id;
                        document.getElementById('edit-transaction-type').value = type;
                        document.getElementById('edit-transaction-amount').value = transaction.amount;
                        document.getElementById('edit-transaction-date').value = transaction.date;

                        // Mostrar/ocultar campos según el tipo
                        const incomeFields = document.getElementById('edit-transaction-income-fields');
                        const expenseFields = document.getElementById('edit-transaction-expense-fields');

                        if (type === 'income') {
                            incomeFields.style.display = 'block';
                            expenseFields.style.display = 'none';

                            // Llenar selects
                            const serviceSelect = document.getElementById('edit-transaction-service');
                            const employeeSelect = document.getElementById('edit-transaction-employee');

                            const incomeCategories = DB.get('incomeCategories');
                            const employees = DB.get('employees');

                            serviceSelect.innerHTML = incomeCategories.map(c =>
                                `<option value="${c.id}" ${c.id === transaction.categoryId ? 'selected' : ''}>${c.name}</option>`
                            ).join('');

                            employeeSelect.innerHTML = employees.map(e =>
                                `<option value="${e.id}" ${e.id === transaction.employeeId ? 'selected' : ''}>${e.name}</option>`
                            ).join('');
                        } else {
                            incomeFields.style.display = 'none';
                            expenseFields.style.display = 'block';

                            document.getElementById('edit-transaction-description').value = transaction.description;

                            // Llenar select de categorías
                            const categorySelect = document.getElementById('edit-transaction-category');
                            const expenseCategories = DB.get('expenseCategories');

                            categorySelect.innerHTML = expenseCategories.map(c =>
                                `<option value="${c.id}" ${c.id === transaction.categoryId ? 'selected' : ''}>${c.name}</option>`
                            ).join('');
                        }

                        document.getElementById('edit-transaction-modal').classList.remove('modal-hidden');

                        // Configurar el formulario para actualizar la transacción
                        document.getElementById('edit-transaction-form').onsubmit = (e) => {
                            e.preventDefault();
                            const updatedTx = { ...transaction };

                            updatedTx.amount = parseFloat(document.getElementById('edit-transaction-amount').value);
                            updatedTx.date = document.getElementById('edit-transaction-date').value;

                            if (type === 'income') {
                                updatedTx.categoryId = parseInt(document.getElementById('edit-transaction-service').value);
                                updatedTx.employeeId = parseInt(document.getElementById('edit-transaction-employee').value);
                            } else {
                                updatedTx.description = document.getElementById('edit-transaction-description').value;
                                updatedTx.categoryId = parseInt(document.getElementById('edit-transaction-category').value);
                            }

                            DB.update('transactions', id, updatedTx);
                            UI.renderTransactionHistory();
                            UI.renderDashboard();
                            document.getElementById('edit-transaction-modal').classList.add('modal-hidden');
                        };
                    }
                }
            });
        },

        setupCharts: function () {
            // Dashboard Chart
            const monthlyChartCtx = document.getElementById('monthlyChart');
            if (monthlyChartCtx) {
                // Obtener datos reales de transacciones
                const transactions = DB.get('transactions');
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                // Filtrar transacciones del mes actual
                const monthTransactions = transactions.filter(tx => {
                    const txDate = new Date(tx.date);
                    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
                });

                // Dividir el mes en semanas
                const weeks = [
                    monthTransactions.filter(tx => new Date(tx.date).getDate() <= 7),
                    monthTransactions.filter(tx => new Date(tx.date).getDate() > 7 && new Date(tx.date).getDate() <= 14),
                    monthTransactions.filter(tx => new Date(tx.date).getDate() > 14 && new Date(tx.date).getDate() <= 21),
                    monthTransactions.filter(tx => new Date(tx.date).getDate() > 21)
                ];

                // Calcular ingresos y gastos por semana
                const weeklyIncomes = weeks.map(week =>
                    week.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0)
                );

                const weeklyExpenses = weeks.map(week =>
                    week.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0)
                );

                // Almacenar la referencia del gráfico en el elemento canvas
                monthlyChartCtx.chart = new Chart(monthlyChartCtx, {
                    type: 'line',
                    data: {
                        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                        datasets: [{
                            label: 'Ingresos',
                            data: weeklyIncomes,
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            borderColor: 'rgb(16, 185, 129)',
                            tension: 0.4,
                            fill: true,
                        }, {
                            label: 'Egresos',
                            data: weeklyExpenses,
                            backgroundColor: 'rgba(239, 68, 68, 0.2)',
                            borderColor: 'rgb(239, 68, 68)',
                            tension: 0.4,
                            fill: true,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                            x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                        }
                    }
                });
            }

            // Reports Chart - Usando datos reales del localStorage
            try {
                const ctx = document.getElementById('gananciasChart').getContext('2d');
                const gananciasChart = document.getElementById('gananciasChart');

                // Obtener transacciones del mes actual
                const transactions = DB.get('transactions');
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                // Filtrar transacciones del mes actual
                const monthTransactions = transactions.filter(tx => {
                    const txDate = new Date(tx.date);
                    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
                });

                // Obtener semanas del mes (dividir en 4 semanas)
                const weeks = [
                    monthTransactions.filter(tx => new Date(tx.date).getDate() <= 7),
                    monthTransactions.filter(tx => new Date(tx.date).getDate() > 7 && new Date(tx.date).getDate() <= 14),
                    monthTransactions.filter(tx => new Date(tx.date).getDate() > 14 && new Date(tx.date).getDate() <= 21),
                    monthTransactions.filter(tx => new Date(tx.date).getDate() > 21)
                ];

                // Calcular ingresos y gastos por semana
                const weeklyIncomes = weeks.map(week =>
                    week.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0)
                );

                const weeklyExpenses = weeks.map(week =>
                    week.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0)
                );

                // Almacenar la referencia del gráfico en el elemento canvas
                gananciasChart.chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
                        datasets: [{
                            label: 'Ingresos',
                            data: weeklyIncomes,
                            backgroundColor: '#4ade80',
                            borderColor: '#4ade80',
                            borderWidth: 2,
                        }, {
                            label: 'Egresos',
                            data: weeklyExpenses,
                            backgroundColor: '#f87171',
                            borderColor: '#f87171',
                            borderWidth: 2,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { labels: { color: '#cbd5e1' } } },
                        scales: {
                            y: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                            x: { ticks: { color: 'rgba(255,255,255,0.7)' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                        }
                    }
                });
            } catch (e) {
                console.error("Error al inicializar el gráfico de reportes:", e);
            }
        }
    };

    App.init();
});
