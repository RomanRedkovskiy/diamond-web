// Format registration time to a more readable format
export default function formatDate(isoString) {
    const options = {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'};
    return new Date(isoString).toLocaleString('en-US', options);
};