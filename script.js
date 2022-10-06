'use strict';


// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2017-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2016-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2021-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',    
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUSD = 1.1


let now

const movementsDescriptions = movements.map( (mov, i) =>
   `Movemment ${i+1}: You ${mov > 0? 'deposited': 'withdrew'} ${Math.abs(mov)}`
)

//FUNCTIONS
const displayBalance = (acc) => {
  acc.balance = acc.movements.reduce((sum,curr) => {
    return sum + curr
  }, 0)
  labelBalance.textContent = acc.balance + ' EUR'
}

const calcDisplaySummary = (account) => {
  const incomes = account.movements.filter(mov => mov>0).reduce((acc,curr) => acc+curr,0)
  const outcomes = account.movements.filter(mov => mov<0).reduce((acc,curr) => acc+curr,0)
  const interest = account.movements.filter(mov => mov>0).map(deposit => deposit*account.interestRate).filter((int,i)=> int>=1).reduce((acc,int) => acc+int,0)
  labelSumIn.textContent = incomes + ' €'
  labelSumOut.textContent = outcomes + ' €'
  labelSumInterest.textContent = interest + ' €'
}

const createUserNames = function(accs){
  accs.forEach((acc) =>{
    acc.username = acc.owner.toLowerCase().split(' ').map((name) => name[0]).join('')
  })
}

const displayMovements = function(acc, sort = false){
  containerMovements.innerHTML = ''

  const movements = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements

  movements.forEach(function(mov,i){

    const type = mov > 0? 'deposit':'withdrawal'

    const htmlTemplate = 
    `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
          <div class="movements__date">${new Date(acc.movementsDates[i]).toLocaleDateString(acc.locale)}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `

    containerMovements.insertAdjacentHTML('afterbegin',htmlTemplate)
  }
  )
}

const updateUI = (acc) => {
  displayMovements(acc)
  calcDisplaySummary(acc)
  displayBalance(acc)
  now = new Date()
  labelDate.textContent = now.toLocaleDateString(acc.locale)
}

const hideUI = () => {
containerApp.opacity = 0
}

//values
let currentAccount
const movementsDollars = movements.map((mov) => Math.floor(mov * eurToUSD))

//event handlers
btnLogin.addEventListener('click', function (e) {
  //prevents form from submitting
  e.preventDefault()
  currentAccount = accounts.find((acc) => acc.username === inputLoginUsername.value && acc.pin === Number(inputLoginPin.value))
  if(currentAccount){
    inputLoginUsername.value = ''
    inputLoginPin.value = ''
    inputLoginPin.blur()
    //display UI and message
    labelWelcome.textContent = ` Welcome ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100
    
    updateUI(currentAccount)

  }
})

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.username ===inputTransferTo.value)
  if(amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username){
    currentAccount.movements.push(-amount)
    currentAccount.movementsDates.push(now.toISOString())
    
    receiverAcc.movements.push(amount)
    receiverAcc.movementsDates.push(now.toISOString())
  }
  inputTransferTo.value = ''
  inputTransferAmount.value = ''
  updateUI(currentAccount)
})

btnLoan.addEventListener('click', (e) =>{
  e.preventDefault()
  const loanAmount = Number(inputLoanAmount.value)
  if(loanAmount > 0 && currentAccount.movements.some(deposit => deposit >= loanAmount * 0.1 )){
    currentAccount.movements.push(loanAmount)
    currentAccount.movementsDates.push(now.toISOString())
    inputLoanAmount.value = 0
    updateUI(currentAccount)
  }else{
    alert("Loan not granted")
  }
})

btnClose.addEventListener('click',(e) => {
  e.preventDefault()
  
  if(inputClosePin.value === currentAccount.pin && inputCloseUsername.value === currentAccount.username){
    //const index = accounts.findIndex(acc => acc.username === currentAccount.username)
    accounts.splice(accounts.findIndex(acc => acc.username === currentAccount.username),1)
    inputClosePin.value = ''
    inputCloseUsername.value = ''
    inputClosePin.blur()
    hideUI()
  }
})


let sortState = false
btnSort.addEventListener('click', (e) => {
  e.preventDefault()
  displayMovements(currentAccount, !sortState)
  sortState = !sortState
})

createUserNames(accounts)
