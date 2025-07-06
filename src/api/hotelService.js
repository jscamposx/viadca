/**
 * Obtiene los hoteles cercanos a una ubicación específica usando OpenStreetMap y la Overpass API.
 * @param {object} location - Un objeto con las propiedades lat y lng.
 * @returns {Promise} - Una promesa que resuelve con la lista de hoteles.
 */
export const getHotelesByLocation = async (location) => {
  const lat = location.lat;
  const lng = location.lng;
  const radius = 25000; // Radio de búsqueda de 5km

  // Esta es la consulta en el lenguaje de Overpass
  // Busca nodos (node) y geometrías (way) que tengan la etiqueta "tourism"="hotel"
  // dentro de un radio desde el punto que seleccionamos.
  const query = `
    [out:json];
    (
      node["tourism"="hotel"](around:${radius},${lat},${lng});
      way["tourism"="hotel"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  const url = "https://overpass-api.de/api/interpreter";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error en la solicitud a Overpass API: ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error al contactar la Overpass API:", error);
    // Devuelve una estructura similar a la esperada en caso de error para no romper el componente
    return { elements: [] };
  }
};
