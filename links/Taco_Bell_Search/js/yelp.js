const SEARCH_ENDPOINT = 'https://api.yelp.com/v3/businesses/search?';
const PROXYURL = 'https://cors-anywhere.herokuapp.com/';
const MAX_RADIUS = 40000; //25 MILES
const METERS_PER_MILE = 1609;
let header = new Headers();
header.append('Authorization', 'Bearer qczd0AxpQ9tYrh_Q-K8S70W0f8O5iMA9rIukDnsrBsiCy13RxNdSuUISFjs6swgkJ8ZUddJbTdxQsbguz1HFBiYF1zysHXlM8WBX_zL5je1mlLuuyvDZ8gnWfWwGX3Yx');

async function requestTacoBells(lon, lat, display_count) {
    const SEARCH_QUERY = `${PROXYURL}${SEARCH_ENDPOINT}radius=${MAX_RADIUS}&latitude=${lat}&longitude=${lon}&term="Taco Bell"`;
    // console.log(SEARCH_QUERY);
    const myRequest = new Request(SEARCH_QUERY, {
        method: 'GET',
        headers: header,
    });
    try {
        const response = await fetch(myRequest);
        let jsonres = await response.json();
        let businesses = jsonres.businesses;
        let tacoBells = businesses.filter((bussiness) => { return bussiness.name == 'Taco Bell'; });
        TacoBells = tacoBells;
        tacoBellsWithinRadius(milesHeader.number, TacoBells);
        console.log(tacoBells);
    } catch (error) {
        console.error(error);
    }

}

