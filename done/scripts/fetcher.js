export async function fetchData(url) {
    try {
        if (arguments.length > 0) {
            url += `?${[...arguments].slice(1).join('&')}`;
        }

        const result = await fetch(url).then(res => res.json());
        console.log(result);
        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}