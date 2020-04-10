document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    let start = document.querySelector('#start'),
        cancel = document.querySelector('#cancel'),
        plusBtns = document.querySelectorAll('.data button'),
        incomeAddBtn = plusBtns[0],
        expensesAddBtn = plusBtns[1],
        depositeCheck = document.querySelector('#deposit-check'),
        depositeBank = document.querySelector('.deposit-bank'),
        depositeAmount = document.querySelector('.deposit-amount'),
        depositePercent = document.querySelector('.deposit-percent'),
        additionalIncomeItems = document.querySelectorAll('.additional_income-item'),
        additionalExpensesItem = document.querySelector('.additional_expenses-item'),
        salaryAmount = document.querySelector('.salary-amount'),
        expensesTitle = document.querySelector('.expenses-title'),
        expensesItems = document.querySelectorAll('.expenses-items'),
        incomeItems = document.querySelectorAll('.income-items'),
        targetAmount = document.querySelector('.target-amount'),
        periodSelect = document.querySelector('.period-select'),
        periodAmount = document.querySelector('.period-amount'),

        budgetMonthValue = document.querySelector('.budget_month-value'),
        budgetDayValue = document.querySelector('.budget_day-value'),
        expensesMonthValue = document.querySelector('.expenses_month-value'),
        additionalIncomeValue = document.querySelector('.additional_income-value'),
        additionalExpensesValue = document.querySelector('.additional_expenses-value'),
        incomePeriodValue = document.querySelector('.income_period-value'),
        targetMonthValue = document.querySelector('.target_month-value');

    const isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n) ? true : false
    };

    class AppData {
        constructor() {
            this.budget = 0,
            this.income = {},
            this.addIncome = [],
            this.expenses = {},
            this.addExpenses = [],
            this.deposite = false,
            this.depositePercent = 0,
            this.depositeMoney = 0,
            this.budgetDay = 0,
            this.budgetMonth = 0,
            this.expensesMonth = 0,
            this.incomeMonth = 0;
        };

        start() {

            this.budget = +salaryAmount.value;

            this.getCash(expensesItems, '.expenses-title', '.expenses-amount', this.expenses); //get expenses
            this.getCash(incomeItems, '.income-title', '.income-amount', this.income);
            this.getExpensesAndIncomeMonth();

            this.getAddExpenses();
            this.getAddIncome();
            this.getInfoDeposite();

            this.getBudget();
            this.showResult();

            this.stop();
        };

        showResult() {
            budgetMonthValue.value = this.budgetMonth;
            budgetDayValue.value = this.budgetDay;
            expensesMonthValue.value = this.expensesMonth;
            additionalExpensesValue.value = this.addExpenses.join(', ');
            additionalIncomeValue.value = this.addIncome.join(', ');
            targetMonthValue.value = this.getTargetMonth();
            incomePeriodValue.value = this.calcSavedMoney();

            periodSelect.addEventListener('input', () => {
                incomePeriodValue.value = this.calcSavedMoney.call(this);
            });
        };

        addBlock(elem, elemClass, titleInputClass, AmountInputClass, btn) {
            let cloneItems = elem[0].cloneNode(true),
                cloneTitle = cloneItems.querySelector(titleInputClass),
                cloneAmount = cloneItems.querySelector(AmountInputClass);

            cloneTitle.value = '';
            cloneAmount.value = '';

            cloneTitle.addEventListener('input', () => {
                cloneTitle.value = cloneTitle.value.replace(/[^а-яА-ЯёЁ ,.!?%;:/]/, '');
            });
            cloneAmount.addEventListener('input', () => {
                cloneAmount.value = cloneAmount.value.replace(/[^\d]/g, '');
            });

            btn.before(cloneItems);

            elem = document.querySelectorAll(elemClass);
            if (elem.length === 3) {
                btn.style.display = 'none';
            }
            return (elem);
        };

        addExpensesBlock() {
            expensesItems = this.addBlock(expensesItems, '.expenses-items', '.expenses-title', '.expenses-amount', expensesAddBtn);
        };

        addIncomeBlock() {
            incomeItems = this.addBlock(incomeItems, '.income-items', '.income-title', '.income-amount', incomeAddBtn);
        };

        getCash(elem, titleClass, AmountClass, appDataElem) {
            elem.forEach(function (item) {
                let itemExpenses = item.querySelector(titleClass).value,
                    cashExpenses = item.querySelector(AmountClass).value;

                if (itemExpenses !== '' && cashExpenses !== '') {
                    appDataElem[itemExpenses] = +cashExpenses;
                }
            });
        };

        getAddExpenses() {
            let addExpenses = additionalExpensesItem.value.split(',');
            this.addExpenses = [];
            addExpenses.forEach((item) => {
                item = item.trim();
                if (item !== '') {
                    this.addExpenses.push(item);
                }
            });
        };

        getAddIncome() {
            this.addIncome = [];
            additionalIncomeItems.forEach((item) => {
                let itemValue = item.value.trim();
                if (itemValue !== '') {
                    this.addIncome.push(itemValue);
                }
            });
        };

        getExpensesAndIncomeMonth() {
            this.expensesMonth = 0;
            for (let key in this.expenses) {
                this.expensesMonth += +this.expenses[key];
            }
            this.incomeMonth = 0;
            for (let key in this.income) {
                this.incomeMonth += +this.income[key];
            }
        };

        getBudget() {
            const monthDeposite = this.depositeMoney * (this.depositePercent / 100);
            this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposite;
            this.budgetDay = Math.floor(this.budgetMonth / 30);
        };

        getTargetMonth() {
            return Math.ceil(targetAmount.value / this.budgetMonth)
        };

        getInfoDeposite() {
            if (this.deposite) {
                this.depositePercent = depositePercent.value;
                this.depositeMoney = depositeAmount.value;
            }
        };

        calcSavedMoney() {
            return this.budgetMonth * periodSelect.value;
        };

        stop() {
            start.style.display = 'none';
            cancel.style.display = 'block';
            document.querySelectorAll('input').forEach((elem) => {
                elem.setAttribute('readonly', true);
            });
            expensesAddBtn.disabled = true;
            incomeAddBtn.disabled = true;
        };

        reset() {
            this.budget = 0,
            this.income = {},
            this.addIncome = [],
            this.expenses = {},
            this.addExpenses = [],
            this.deposite = false,
            this.depositePercent = 0,
            this.depositeMoney = 0,
            this.budgetDay = 0,
            this.budgetMonth = 0,
            this.expensesMonth = 0,
            this.incomeMonth = 0;
            
            start.style.display = 'block';
            cancel.style.display = 'none';
            document.querySelectorAll('input').forEach((elem) => {
                elem.removeAttribute('readonly');
                elem.value = '';
            });
            this.budgetMonth = 0;
            expensesAddBtn.disabled = false;
            incomeAddBtn.disabled = false;
            start.disabled = true;
            depositeCheck.checked = false;
            this.depositHandler();
        };

        depositHandler() {
            if (depositeCheck.checked) {
                this.deposite = true;
                depositeBank.style.display = 'inline-block';
                depositeAmount.style.display = 'inline-block';
                depositeBank.addEventListener('change', this.changePercent);
            } else {
                this.deposite = false;
                depositeBank.style.display = 'none';
                depositeAmount.style.display = 'none';
                depositePercent.style.display = 'none';
                depositeBank.value = '';
                depositeAmount.value = '';
                depositeBank.removeEventListener('change', this.changePercent);
            }
        };

        changePercent() {
            const valueSelect = this.value;
            if (valueSelect === 'other') {
                depositePercent.style.display = 'inline-block';
                depositePercent.value = '';
                depositePercent.addEventListener('input', () => {
                    if (+depositePercent.value > 50) {
                        alert('Введите корректный процент');
                        depositePercent.value = '';
                    }
                });
            } else {
                depositePercent.style.display = 'none';
                depositePercent.value = valueSelect;
            }

        }

        eventsListeners() {
            start.disabled = true;

            salaryAmount.addEventListener('input', function () {
                if (this.value.length > 2) {
                    start.disabled = false;

                } else {
                    start.disabled = true;
                }
            });

            start.addEventListener('click', this.start.bind(this));
            cancel.addEventListener('click', this.reset.bind(this))
            expensesAddBtn.addEventListener('click', this.addExpensesBlock.bind(this));
            incomeAddBtn.addEventListener('click', this.addIncomeBlock.bind(this));

            document.querySelectorAll('input[placeholder="Наименование"]').forEach((item) => {
                item.addEventListener('input', () => {
                    item.value = item.value.replace(/[^а-яА-ЯёЁ ,.!?%;:/]/, '');
                });
            });

            document.querySelectorAll('input[placeholder="Сумма"]').forEach((item) => {
                item.addEventListener('input', () => {
                    item.value = item.value.replace(/[^\d]/g, '');
                });
            });

            document.querySelector('input[placeholder="Процент"]').addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^\d.]/g, '');
            });

            periodSelect.addEventListener('input', () => {
                periodAmount.textContent = periodSelect.value;
            });

            depositeCheck.addEventListener('change', this.depositHandler.bind(this))

        };
    };

    const appData = new AppData();

    appData.eventsListeners();
});