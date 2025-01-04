// This will be populated with the actual data
const candidateData = [
    // Example format:
    { award: "18", member: "698", typeId: "1", name: "Muzik" },
    { award: "18", member: "708", typeId: "1", name: "Dopamine" },
    { award: "18", member: "696", typeId: "1", name: "Sundays" },
    { award: "18", member: "697", typeId: "1", name: "Flash" },
    { award: "18", member: "712", typeId: "1", name: "Cừu có cánh" },
    { award: "18", member: "707", typeId: "1", name: "FC Hurrykng" },
    { award: "18", member: "713", typeId: "1", name: "XA XA" },
    { award: "18", member: "717", typeId: "1", name: "HIP" },
    { award: "18", member: "715", typeId: "1", name: "Lion Kingdom" },
    { award: "1", member: "678", typeId: "1", name: "Quang Hùng" },
    { award: "1", member: "691", typeId: "1", name: "HIEUTHUHAI" },
    { award: "1", member: "700", typeId: "1", name: "Rhyder" },
    { award: "5", member: "486", typeId: "1", name: "ITAY" },
    { award: "6", member: "512", typeId: "1", name: "Quang Hùng" },
    { award: "6", member: "543", typeId: "1", name: "HTH" },
    { award: "6", member: "512", typeId: "1", name: "Rhyder" },
    { award: "7", member: "560", typeId: "1", name: "Atus" },
    { award: "7", member: "480", typeId: "1", name: "Justatee" },
    { award: "8", member: "524", typeId: "1", name: "ATSH" },
    { award: "13", member: "580", typeId: "1", name: "Duong Domic" },
    { award: "13", member: "582", typeId: "1", name: "HURRYKNG" },
    { award: "13", member: "628", typeId: "1", name: "Wean Le" },
    { award: "24", member: "747", typeId: "1", name: "Đã ai làm gì đâu, đã ai chạm vào đâu" },
];

// Function to initialize the candidate list
function initializeCandidateList() {
    const candidateList = document.getElementById('candidateList');
    candidateList.innerHTML = '';
    
    candidateData.forEach((candidate, index) => {
        const candidateElement = document.createElement('div');
        candidateElement.className = 'candidate-item';
        candidateElement.innerHTML = `
            <span>${candidate.name}</span>
            <span class="status-indicator pending" id="status-${index}"></span>
        `;
        candidateList.appendChild(candidateElement);
    });
}

// Function to update status indicator
function updateStatus(index, status) {
    const statusIndicator = document.getElementById(`status-${index}`);
    statusIndicator.className = `status-indicator ${status}`;
}

// Function to make the voting request
async function makeVoteRequest(cookie, award, member, typeId) {
    const sign = `${award}|${member}|${typeId}`;
    const encodedSign = encodeURIComponent(sign);
    
    try {
        const response = await fetch(`https://api2024.wechoice.vn/vote-token.htm?m=set-vote&sign=${encodedSign}&award=${award}&member=${member}&typeId=${typeId}&g-recaptcha-response=`, {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
                'cookie': cookie,
                'dnt': '1',
                'origin': 'https://wechoice.vn',
                'priority': 'u=1, i',
                'referer': 'https://wechoice.vn/',
                'sec-ch-ua': '"Chromium";v="131", "Not_A Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
            }
        });
        
        return response.ok;
    } catch (error) {
        console.error('Error making vote request:', error);
        return false;
    }
}

// Main function to start voting process
async function startVoting() {
    const cookie = document.getElementById('cookieInput').value.trim();
    if (!cookie) {
        alert('Please enter your cookie');
        return;
    }

    // Reset all status indicators
    candidateData.forEach((_, index) => {
        updateStatus(index, 'pending');
    });

    // Process each candidate
    for (let i = 0; i < candidateData.length; i++) {
        const candidate = candidateData[i];
        const success = await makeVoteRequest(
            cookie,
            candidate.award,
            candidate.member,
            candidate.typeId
        );
        updateStatus(i, success ? 'success' : 'failed');
        
        // Add a small delay between requests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// Initialize the page when loaded
document.addEventListener('DOMContentLoaded', initializeCandidateList);
