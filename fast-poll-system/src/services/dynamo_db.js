const BASE_URL = "http://localhost:8040"; // Substitua pela URL do seu serviço FastAPI

/**
 * Fetches the root endpoint
 * @returns {Promise<Object>} The response from the root endpoint
 */
export async function fetchRoot() {
    try {
        const response = await fetch(`${BASE_URL}/`);
        if (!response.ok) {
            throw new Error(`Error fetching root: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Sends a POST request to add an item to DynamoDB
 * @param {Object} item - The item to add (must include PollID and OptionID)
 * @returns {Promise<Object>} The response from the endpoint
 */
export async function putItem(item) {
    try {
        const response = await fetch(`${BASE_URL}/put-item/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        });
        if (!response.ok) {
            throw new Error(`Error putting item: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Fetches all items with the given PollID
 * @param {number} pollId - The partition key PollID
 * @returns {Promise<Object>} The response from the endpoint
 */
export async function getAllItems(pollId) {
    try {
        // Verifica se pollId foi definido e constrói a URL dinamicamente
        const url = pollId 
            ? `${BASE_URL}/get-all/?poll_id=${pollId}` 
            : `${BASE_URL}/get-all/`;
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error fetching all items: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

/**
 * Fetches a specific item based on PollID and OptionID
 * @param {number} pollId - The partition key PollID
 * @param {number} optionId - The sort key OptionID
 * @returns {Promise<Object>} The response from the endpoint
 */
export async function getItemByKeys(pollId, optionId) {
    try {
        const response = await fetch(`${BASE_URL}/get-by-both-key/?poll_id=${pollId}&option_id=${optionId}`);
        if (!response.ok) {
            throw new Error(`Error fetching item by keys: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
