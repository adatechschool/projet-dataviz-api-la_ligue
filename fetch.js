// const => lier le js au html
async function api_pokemon() {
    const reponse = await fetch("https://tyradex.vercel.app/api/v1/types");
    const types = await reponse.json();
    return types
  }
  
api_pokemon()



