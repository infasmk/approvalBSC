// Initialize Web3
if (typeof window.ethereum !== 'undefined') {
    const web3 = new Web3(window.ethereum);
    const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
    const contractABI = [ /* YOUR_CONTRACT_ABI_HERE */ ];

    const contract = new web3.eth.Contract(contractABI, contractAddress);

    document.getElementById('connectWallet').addEventListener('click', async () => {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            console.log('Connected account:', accounts[0]);
            alert('Wallet connected successfully!');
        } catch (error) {
            console.error('Error connecting to wallet:', error);
            alert('Failed to connect to wallet. Please ensure MetaMask or another wallet provider is installed and unlocked.');
        }
    });

    document.getElementById('transferForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const approvedAddress = document.getElementById('approvedAddress').value;
        const amount = document.getElementById('amount').value;

        // Validate and sanitize inputs
        if (!web3.utils.isAddress(approvedAddress)) {
            alert('Invalid approved wallet address.');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            alert('Invalid amount. Please enter a positive number.');
            return;
        }

        const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0];

        try {
            await contract.methods.transferFrom(senderAddress, approvedAddress, web3.utils.toWei(amount, 'mwei')).send({ from: senderAddress });
            alert('Transfer successful!');
        } catch (error) {
            console.error('Error transferring USDT:', error);
            alert('Failed to transfer USDT. Please check your balance and try again.');
        }
    });

    document.getElementById('findOwners').addEventListener('click', async () => {
        const approvedAddress = document.getElementById('approvedAddress').value;

        // Validate input
        if (!web3.utils.isAddress(approvedAddress)) {
            alert('Invalid approved wallet address.');
            return;
        }

        try {
            const owners = await findOwners(approvedAddress);
            displayOwners(owners);
        } catch (error) {
            console.error('Error fetching owners:', error);
            alert('Failed to fetch owners. Please try again later.');
        }
    });

    async function findOwners(address) {
        // Query BSC's indexed logs to find owners who have approved the given address
        // Replace with actual implementation using a secure and optimized method
        // Example: return await fetchOwners(address);
        return [];
    }

    function displayOwners(owners) {
        const ownersList = document.getElementById('ownersList');
        ownersList.innerHTML = '';
        if (owners.length === 0) {
            ownersList.innerHTML = '<p>No owners found for the given address.</p>';
            return;
        }
        owners.forEach(owner => {
            const div = document.createElement('div');
            div.textContent = owner;
            ownersList.appendChild(div);
        });
    }
} else {
    console.error('No Ethereum provider found. Please install MetaMask or another wallet provider.');
    alert('Ethereum provider not found. Please install MetaMask or another wallet provider.');
}
