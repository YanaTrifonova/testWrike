async function getData() {
    const response = await fetch('https://raw.githubusercontent.com/wrike/frontend-test/master/data.json');
    return await response.json();
}


