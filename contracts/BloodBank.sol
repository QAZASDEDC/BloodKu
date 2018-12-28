pragma solidity ^0.4.24;

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract BloodBank {
   
    enum BloodType {A, B, AB, O}
   
    struct Donator {
        BloodType bType;
        int quota;
        int approval;
        bool applied;
        bool approved;
        bool used;
    }
    
    struct WaitingApplier {
        address applier;
        int priority;
        bool approved;
    }

    address chairperson;
    mapping(address => Donator) donators;
    int[4] bBank;
    int winnernum;
    WaitingApplier[] waiting;
    uint lastupdated;
   
    event Donate(
        address indexed donator,
        int indexed amount
    );
   
    event SetWinnernum(
        int num
    );
   
    event ApprovedBlood(
        address indexed aprovee,
        int indexed amount
    );
    
    event Useblood(
        address indexed user,
        int indexed amount
    );

    constructor() public {
        chairperson = msg.sender;
        winnernum = 1;
        emit SetWinnernum(1);
    }

    
    function loadDonatorBtype(uint8 btype) public {
        require(msg.sender != chairperson);
        donators[msg.sender].bType = BloodType(btype);
    }

   
    function donate(address ldonator, int amount) public {
        require(msg.sender == chairperson);
        require(ldonator != chairperson);
        donators[ldonator].quota += amount;
        bBank[uint(donators[ldonator].bType)] += amount;
        emit Donate(ldonator, amount);
    }
   
    function applyforBlood(int amount) public {
        require(msg.sender != chairperson);
        Donator storage sender = donators[msg.sender];
        require(!sender.approved);
        require(!sender.applied);
        require(bBank[uint(sender.bType)] >= amount);
        sender.applied = true;
        sender.approval = amount;
        waiting.push(WaitingApplier({
            applier:msg.sender,
            priority:sender.quota - amount,
            approved:false
        }));
    }

    function userSetUsed() public {
        require(donators[msg.sender].used == false);
        require(donators[msg.sender].approved == true);
        donators[msg.sender].used = true;
    }

    function bloodUsedRegistration(address registeree) public {
        require(msg.sender == chairperson);
        require(donators[registeree].used);
        emit Useblood(registeree, donators[registeree].approval);
        bBank[uint(donators[registeree].bType)] -= donators[registeree].approval;
        donators[registeree].quota -= donators[registeree].approval;
        donators[registeree].used = false;
        donators[registeree].approved = false;
        donators[registeree].approval = 0;
        
    }

    function winningApplier() internal returns (uint _winningApplier) {
        int winningpriority = -bBank[uint(BloodType.A)]-bBank[uint(BloodType.B)]-bBank[uint(BloodType.AB)]-bBank[uint(BloodType.O)];
        for (uint i = 0; i < waiting.length; i++)
            if (waiting[i].priority > winningpriority&&waiting[i].approved == false) {
                winningpriority = waiting[i].priority;
                _winningApplier = i;
            }
        waiting[_winningApplier].approved = true;
    }
   
    function setWinnernum(int num) public {
        require(msg.sender == chairperson);
        winnernum = num;
        emit SetWinnernum(num);
    }
    
    function getDonatorInfo() public view returns (BloodType, int, int, bool, bool, bool){
        Donator storage sender = donators[msg.sender];
        return (sender.bType, sender.quota, sender.approval, sender.applied, sender.approved, sender.used);
    }
    
    function getBloodBankInfo() public view returns (int, int, int, int, int, uint){
        return (bBank[uint(BloodType.A)], bBank[uint(BloodType.B)], bBank[uint(BloodType.AB)], bBank[uint(BloodType.O)], winnernum, lastupdated);
    }
    
    function winningAppliers() public {
        require(msg.sender == chairperson);
        int w = winnernum;
        if(uint(winnernum) >= waiting.length){
            w = int(waiting.length);
        }
        for(uint8 i = 0; i < w; i++){
            uint winApplier = winningApplier();
            donators[waiting[winApplier].applier].approved = true;
            emit ApprovedBlood(waiting[winApplier].applier, donators[waiting[winApplier].applier].approval);
        }
        for (uint j = 0; j < waiting.length; j++){
            donators[waiting[j].applier].applied = false;
        }
        delete waiting;
        lastupdated = now;
    }
}
