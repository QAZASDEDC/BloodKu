// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import bloodBankArtifact from '../../build/contracts/BloodBank.json'

// BloodBank is our usable abstraction, which we'll use through the code below.
const BloodBank = contract(bloodBankArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
let accounts
let account
let accountnum

const App = {
  start: function () {
    const self = this

    // Bootstrap the BloodBank abstraction for Use.
    BloodBank.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[accountnum]

      self.refreshInfo()
      self.getBloodBankInfo()
    })
  },

  setStatus: function (message) {
    const status = document.getElementById('status')
    status.innerHTML = message
  },

  refreshInfo: function () {
    const self = this

    let bBank
    BloodBank.deployed().then(function (instance) {
      bBank = instance
      return bBank.getDonatorInfo.call({ from: account })
    }).then(function (value) {
      var Bldtp=new Array("A","B","AB","O")
      const bloodtypeElement = document.getElementById('bloodtype')
      bloodtypeElement.innerHTML = Bldtp[value[0].valueOf()]
      const quotaElement = document.getElementById('quota')
      quotaElement.innerHTML = value[1].valueOf()
      const approvalElement = document.getElementById('approval')
      approvalElement.innerHTML = value[2].valueOf()
      const appliedElement = document.getElementById('applied')
      appliedElement.innerHTML = value[3].valueOf()
      const approvedElement = document.getElementById('approved')
      approvedElement.innerHTML = value[4].valueOf()
      const usedElement = document.getElementById('used')
      usedElement.innerHTML = value[5].valueOf()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting donator infomation; see log.')
    })
  },

  getBloodBankInfo: function () {
    const self = this

    let bBank
    BloodBank.deployed().then(function (instance) {
      bBank = instance
      return bBank.getBloodBankInfo.call({ from: account })
    }).then(function (value) {
      const AElement = document.getElementById('A')
      AElement.innerHTML = value[0].valueOf()
      const BElement = document.getElementById('B')
      BElement.innerHTML = value[1].valueOf()
      const ABElement = document.getElementById('AB')
      ABElement.innerHTML = value[2].valueOf()
      const OElement = document.getElementById('O')
      OElement.innerHTML = value[3].valueOf()
      const wnElement = document.getElementById('winnernum')
      wnElement.innerHTML = value[4].valueOf()
      const lupdtElement = document.getElementById('lastupdated')
      var unixTimestamp = new Date(value[5].valueOf()*1000)
      lupdtElement.innerHTML = unixTimestamp
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error getting blood bank infomation; see log.')
    })
  },

  loadDonatorBtype: function () {
    const self = this

    const btyte = parseInt(document.getElementById('btype').value)

    this.setStatus('Initiating transaction... (please wait)')

    let bBank
    BloodBank.deployed().then(function (instance) {
      bBank = instance
      return bBank.loadDonatorBtype(btyte, { from: account })
    }).then(function () {
      self.setStatus('Load complete!')
      self.refreshInfo()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error loading bloodtype; see log.')
    })
  },

  applyforBlood: function () {
    const self = this

    const applyamount = parseInt(document.getElementById('applyamount').value)

    this.setStatus('Initiating transaction... (please wait)')

    let bBank
    BloodBank.deployed().then(function (instance) {
      bBank = instance
      return bBank.applyforBlood(applyamount, { from: account , gas: 200000})
    }).then(function () {
      self.setStatus('Apply complete!')
      self.refreshInfo()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error applying for blood; see log.')
    })
  },

  userSetUsed: function () {
    const self = this

    this.setStatus('Initiating transaction... (please wait)')

    let bBank
    BloodBank.deployed().then(function (instance) {
      bBank = instance
      return bBank.userSetUsed({ from: account })
    }).then(function () {
      self.setStatus('Set used complete!')
      self.refreshInfo()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error setting used; see log.')
    })
  },

  donate: function () {
    const self = this

    const damount = parseInt(document.getElementById('damount').value)
    const ldonator = document.getElementById('ldonator').value

    this.setStatus('Initiating transaction... (please wait)')

    let bBank
    BloodBank.deployed().then(function (instance) {
      bBank = instance
      return bBank.donate(ldonator, damount, { from: account })
    }).then(function () {
      self.setStatus('Donation complete!')
      self.getBloodBankInfo()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error loading donation; see log.')
    })
  },

  bloodUsedRegistration: function () {
    const self = this

    const registeree = document.getElementById('registeree').value

    this.setStatus('Initiating transaction... (please wait)')

    let bBank
    BloodBank.deployed().then(function (instance) {
      bBank = instance
      return bBank.bloodUsedRegistration(registeree, { from: account })
    }).then(function () {
      self.setStatus('Registration complete!')
      self.getBloodBankInfo()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error loading Registration; see log.')
    })
  },

  setWinnernum: function () {
    const self = this

    const wn = parseInt(document.getElementById('winnernumset').value)

    this.setStatus('Initiating transaction... (please wait)')

    let bBank
    BloodBank.deployed().then(function (instance) {
      bBank = instance
      return bBank.setWinnernum(wn, { from: account })
    }).then(function () {
      self.setStatus('Winnernum set complete!')
      self.getBloodBankInfo()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error setting winnernum; see log.')
    })
  },

  winningAppliers: function () {
    const self = this

    this.setStatus('Initiating transaction... (please wait)')

    let bBank
    BloodBank.deployed().then(function (instance) {
      bBank = instance
      return bBank.winningAppliers({ from: account, gas: 800000})
    }).then(function () {
      self.setStatus('Winners calculate complete!')
      self.getBloodBankInfo()
    }).catch(function (e) {
      console.log(e)
      self.setStatus('Error calculating winners; see log.')
    })
  }

}

window.App = App
accountnum=prompt("请输入你的账户序号","1")
window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/bBankMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 BloodBank,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using bBankMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-bBankmask'
    )
    // Use Mist/bBankMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to bBankmask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-bBankmask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }
  App.start()
})
